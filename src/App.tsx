import { useEffect, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  useReactFlow,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useBoardStore } from './store/useBoardStore';
import { EvidenceNode } from './components/canvas/EvidenceNode';
import { StringEdge } from './components/canvas/StringEdge';
import { Toolbar } from './components/ui/Toolbar';
import { InfoBadge } from './components/ui/InfoBadge';

const nodeTypes = { evidence: EvidenceNode };
const edgeTypes = { string: StringEdge };

function DetectiveCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNote,
    loadFromDB,
  } = useBoardStore();

  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    loadFromDB();
  }, [loadFromDB]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      );
      if (files.length === 0) return;

      const basePos = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      files.forEach((file, idx) => {
        addNote({ x: basePos.x + idx * 30, y: basePos.y + idx * 30 }, file);
      });
    },
    [screenToFlowPosition, addNote]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  return (
    <div
      style={{ width: '100vw', height: '100vh', backgroundColor: '#0b0f0b' }}
      className="w-screen h-screen bg-[#0b0f0b]"
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        elevateEdgesOnSelect={true}
        proOptions={{ hideAttribution: true }}
        connectionMode={ConnectionMode.Loose}
        zoomOnDoubleClick={false}
        onDoubleClick={(e) => {
          if ((e.target as HTMLElement).classList.contains('react-flow__pane')) {
            const pos = screenToFlowPosition({ x: e.clientX - 120, y: e.clientY - 40 });
            addNote(pos);
          }
        }}
        deleteKeyCode={['Backspace', 'Delete']}
        minZoom={0.2}
        maxZoom={2.5}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color="#1e281e"
        />
        <Controls
          position="bottom-left"
          showInteractive={false}
          className="m-6! flex! flex-col! gap-1! p-1.5! rounded-2xl! bg-[#131713]/90! border! border-[#232c23]! shadow-[0_8px_24px_rgba(0,0,0,0.5)]! backdrop-blur-xl! [&_button]:w-9! [&_button]:h-9! [&_button]:rounded-xl! [&_button]:border-0! [&_button]:bg-transparent! [&_button]:fill-[#b0bab0]! active:[&_button]:scale-90! [&_button]:transition-all!"
        />
      </ReactFlow>
      <InfoBadge />
      <Toolbar />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <DetectiveCanvas />
    </ReactFlowProvider>
  );
}
