import Dexie, { type Table } from 'dexie';
import type { EvidenceNodeType, StringEdgeType } from '../types/board';

export interface StoredImage {
  id: string;
  blob: Blob;
}

export interface BoardSnapshot {
  id: string;
  nodes: EvidenceNodeType[];
  edges: StringEdgeType[];
}

class DetectiveDatabase extends Dexie {
  images!: Table<StoredImage, string>;
  boards!: Table<BoardSnapshot, string>;

  constructor() {
    super('DetectiveBoardDB');
    this.version(1).stores({
      images: 'id',
      boards: 'id',
    });
  }
}

export const db = new DetectiveDatabase();

export const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

export const base64ToBlob = async (base64: string): Promise<Blob> => {
  const res = await fetch(base64);
  return res.blob();
};
