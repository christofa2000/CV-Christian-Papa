import { ChromaClient } from "chromadb";
import fs from "node:fs";
import path from "node:path";
import { Ollama } from "ollama";
import { z } from "zod";

interface KnowledgeEntry {
  id: string;
  tags: string[];
  text: string;
}

const LineSchema = z.object({
  id: z.string(),
  tags: z.array(z.string()),
  text: z.string().min(1),
});

type Embedder = (texts: string[]) => Promise<number[][]>;

async function main(): Promise<void> {
  const ollama = new Ollama(); // por defecto http://localhost:11434

  const embed: Embedder = async (texts) => {
    const vectors: number[][] = [];
    for (const t of texts) {
      const res = await ollama.embeddings({
        model: "nomic-embed-text",
        prompt: t,
      });
      // la API devuelve { embedding: number[] }
      const v = res.embedding as number[]; // tipado explícito
      vectors.push(v);
    }
    return vectors;
  };

  // Si corrés chroma server: const chroma = new ChromaClient({ path: "http://localhost:8000" });
  // Alternativa (con chroma run local): adaptá el path o omitilo según tu setup.
  const chroma = new ChromaClient({ path: "http://localhost:8000" });

  const collection = await chroma.getOrCreateCollection({
    name: "cvchris_knowledge",
  });

  const file = path.resolve(
    process.cwd(),
    "knowledge/knowledge_cvchris_v5.jsonl"
  );
  const linesRaw = fs
    .readFileSync(file, "utf-8")
    .split(/\r?\n/)
    .filter(Boolean);

  const ids: string[] = [];
  const docs: string[] = [];
  const metas: Array<Record<string, string | number | boolean | null>> = [];
  const embeddings: number[][] = [];

  for (const raw of linesRaw) {
    const parsed = LineSchema.parse(JSON.parse(raw)) as KnowledgeEntry;
    ids.push(parsed.id);
    docs.push(parsed.text);
    metas.push({ tags: JSON.stringify(parsed.tags) });
  }

  // Generar embeddings para todos los documentos
  console.log("Generando embeddings...");
  const allEmbeddings = await embed(docs);
  embeddings.push(...allEmbeddings);

  // Opcional: limpiar antes de reindexar
  // await collection.delete({ ids });

  await collection.upsert({
    ids,
    documents: docs,
    metadatas: metas,
    embeddings: embeddings,
  });
  console.log(`✅ Indexado completo: ${ids.length} documentos`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
