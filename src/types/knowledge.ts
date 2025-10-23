export interface KnowledgeEntry {
  id: string;
  tags: string[];
  text: string;
}

export type KnowledgeData = KnowledgeEntry[];

export interface SearchResult {
  id: string;
  text: string;
  score: number;
}

export interface VecDoc {
  id: string;
  text: string;
  vector: Float32Array;
}

export interface Doc {
  id: string;
  text: string;
}





