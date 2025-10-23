import { ChromaClient } from "chromadb";

export function getChromaClient(): ChromaClient {
  // Si corrés el server: ajustá el path
  return new ChromaClient({ path: "http://localhost:8000" });
}

export async function getKnowledgeCollection() {
  const chroma = getChromaClient();
  const collection = await chroma.getOrCreateCollection({
    name: "cvchris_knowledge",
  });
  return collection;
}





