import { create } from 'zustand';
import {
  type Connection,
  type EdgeChange,
  type NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import type { EvidenceNodeType, StringEdgeType, EvidenceNodeData, StringEdgeData } from '../types/board';
import { db, blobToBase64, base64ToBlob } from '../db/db';

interface BoardState {
  nodes: EvidenceNodeType[];
  edges: StringEdgeType[];
  activeStringColor: string;
  setActiveStringColor: (color: string) => void;
  onNodesChange: (changes: NodeChange<EvidenceNodeType>[]) => void;
  onEdgesChange: (changes: EdgeChange<StringEdgeType>[]) => void;
  onConnect: (connection: Connection) => void;
  addNote: (position: { x: number; y: number }, file?: File) => Promise<void>;
  updateNodeData: (id: string, data: Partial<EvidenceNodeData>) => void;
  deleteNode: (id: string) => void;
  updateEdgeData: (id: string, data: Partial<StringEdgeData>) => void;
  deleteEdge: (id: string) => void;
  loadFromDB: () => Promise<void>;
  saveToDB: () => Promise<void>;
  clearBoard: () => Promise<void>;
  exportJSON: () => Promise<void>;
  importJSON: (file: File) => Promise<void>;
}

// Tonal Surfaces
const NOTE_COLORS = [
  '#1e251e', // Dark Forest Green Surface
  '#252824', // Sage/Olive Dark
  '#27242a', // Deep Mauve
  '#2a2420', // Warm Clay / Sand
  '#1d242b', // Slate Blue Surface
];

let saveTimeout: ReturnType<typeof setTimeout>;
const triggerAutoSave = (saveFn: () => Promise<void>) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => saveFn(), 400);
};

export const useBoardStore = create<BoardState>((set, get) => ({
  nodes: [],
  edges: [],
  activeStringColor: '#dc2626',

  setActiveStringColor: (color) => set({ activeStringColor: color }),

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
    triggerAutoSave(get().saveToDB);
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
    triggerAutoSave(get().saveToDB);
  },

  onConnect: (connection) => {
    const newEdge: StringEdgeType = {
      ...connection,
      id: `edge-${ crypto.randomUUID() }`,
      type: 'string',
      data: {
        comment: '',
        color: get().activeStringColor,
      },
    };
    set({ edges: addEdge(newEdge, get().edges) });
    triggerAutoSave(get().saveToDB);
  },

  addNote: async (position, file) => {
      let imageUrl: string | undefined;
      let imageId: string | undefined;

      if (file) {
        imageId = `img-${crypto.randomUUID()}`;
        await db.images.put({
          id: imageId,
          blob: file,
        });
        imageUrl = URL.createObjectURL(file);
      }

      const color = file
        ? '#1e251e'
        : NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];

      const newNode: EvidenceNodeType = {
        id: crypto.randomUUID(),
        type: 'evidence',
        position,
        style: {
          width: 288,
          height: file ? 360 : 200,
        },
        data: {
          title: '',
          content: '',
          color,
          imageUrl,
          imageId,
          rotation: 0,
        },
      };

      set((state) => ({
        nodes: [...state.nodes, newNode],
      }));

      get().saveToDB();
    },

  updateNodeData: (id, partialData) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...partialData } } : node
      ),
    });
    triggerAutoSave(get().saveToDB);
  },

  deleteNode: (id) => {
    const node = get().nodes.find((n) => n.id === id);
    if (node?.data.imageId) {
      db.images.delete(node.data.imageId);
    }
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
    });
    triggerAutoSave(get().saveToDB);
  },

  updateEdgeData: (id, partialData) => {
    set({
      edges: get().edges.map((edge) =>
        edge.id === id
          ? { ...edge, data: { ...edge.data!, ...partialData } }
          : edge
      ),
    });
    triggerAutoSave(get().saveToDB);
  },

  deleteEdge: (id) => {
    set({ edges: get().edges.filter((e) => e.id !== id) });
    triggerAutoSave(get().saveToDB);
  },

  saveToDB: async () => {
    const { nodes, edges } = get();
    const cleanNodes = nodes.map((n) => ({
      ...n,
      data: { ...n.data, imageUrl: undefined },
    }));
    await db.boards.put({ id: 'main', nodes: cleanNodes, edges });
  },

  loadFromDB: async () => {
    const board = await db.boards.get('main');
    if (!board) return;

    const hydratedNodes = await Promise.all(
      board.nodes.map(async (node) => {
        if (node.data.imageId) {
          const record = await db.images.get(node.data.imageId);
          if (record) {
            return {
              ...node,
              data: { ...node.data, imageUrl: URL.createObjectURL(record.blob) },
            };
          }
        }
        return node;
      })
    );

    set({ nodes: hydratedNodes, edges: board.edges });
  },

  clearBoard: async () => {
    await db.images.clear();
    await db.boards.clear();
    set({ nodes: [], edges: [] });
  },

  exportJSON: async () => {
    const { nodes, edges } = get();
    const exportedNodes = await Promise.all(
      nodes.map(async (n) => {
        if (n.data.imageId) {
          const img = await db.images.get(n.data.imageId);
          if (img) {
            const base64 = await blobToBase64(img.blob);
            return { ...n, data: { ...n.data, imageUrl: base64 } };
          }
        }
        return n;
      })
    );

    const payload = JSON.stringify({ nodes: exportedNodes, edges }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `info-board-${ new Date().toISOString().slice(0, 10) }.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  importJSON: async (file) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    await db.images.clear();

    const restoredNodes: EvidenceNodeType[] = await Promise.all(
      (parsed.nodes || []).map(async (n: EvidenceNodeType) => {
        if (n.data.imageUrl && n.data.imageUrl.startsWith('data:')) {
          const blob = await base64ToBlob(n.data.imageUrl);
          const imageId = n.data.imageId || `img-${ crypto.randomUUID() }`;
          await db.images.put({ id: imageId, blob });
          return {
            ...n,
            data: { ...n.data, imageId, imageUrl: URL.createObjectURL(blob) },
          };
        }
        return n;
      })
    );

    set({ nodes: restoredNodes, edges: parsed.edges || [] });
    await get().saveToDB();
  },
}));
