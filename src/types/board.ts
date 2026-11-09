import type { Node, Edge } from '@xyflow/react';

export interface EvidenceNodeData extends Record<string, unknown> {
  title: string;
  content: string;
  color: string;
  imageUrl?: string;
  imageId?: string;
  rotation?: number;
}

export type EvidenceNodeType = Node<EvidenceNodeData, 'evidence'>;

export interface StringEdgeData extends Record<string, unknown> {
  comment?: string;
  color?: string;
  controlPoint?: { x: number; y: number };
}

export type StringEdgeType = Edge<StringEdgeData, 'string'>;
