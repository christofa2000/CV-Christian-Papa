"use client";

import localforage from "localforage";

let pipelineRef: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any

type Doc = { id: string; text: string };
type VecDoc = { id: string; text: string; vector: Float32Array };

const store = localforage.createInstance({ name: "cvchris-rag" });

async function loadPipeline() {
  if (pipelineRef) return pipelineRef;

  // Verificar que estamos en el cliente
  if (typeof window === "undefined") {
    throw new Error("loadPipeline can only be called on the client side");
  }

  try {
    // Configurar el entorno para @xenova/transformers
    if (typeof process === "undefined") {
      (globalThis as any).process = { env: {} };
    }

    // Importación dinámica con configuración específica
    const transformers = await import("@xenova/transformers");

    // Configurar el entorno antes de usar pipeline
    transformers.env.allowRemoteModels = false;
    transformers.env.allowLocalModels = true;

    pipelineRef = await transformers.pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    return pipelineRef;
  } catch (error) {
    console.error("Error loading transformers pipeline:", error);
    throw new Error(
      `Failed to load transformers: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function buildIndex(docs: Doc[]) {
  try {
    const embedder = await loadPipeline();
    const out: VecDoc[] = [];

    for (const d of docs) {
      const emb = await embedder(d.text, { pooling: "mean", normalize: true });
      out.push({ id: d.id, text: d.text, vector: new Float32Array(emb.data) });
    }

    await store.setItem("index", out);
    console.log(`Index built with ${out.length} documents`);
  } catch (error) {
    console.error("Error building index:", error);
    throw error;
  }
}

function cosine(a: Float32Array, b: Float32Array) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

export async function retrieve(query: string, k = 5) {
  try {
    const embedder = await loadPipeline();
    const q = await embedder(query, { pooling: "mean", normalize: true });
    const qv = new Float32Array(q.data);
    const index = (await store.getItem<VecDoc[]>("index")) || [];

    if (index.length === 0) {
      console.warn("No index found, returning empty results");
      return [];
    }

    return index
      .map((d) => ({ ...d, score: cosine(qv, d.vector) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  } catch (error) {
    console.error("Error retrieving documents:", error);
    return [];
  }
}

export function guardAnswer(text: string) {
  if (!text || typeof text !== "string") {
    return "No está en mis fuentes locales.";
  }

  const banned = [
    /contacta.*soporte/i,
    /no tengo acceso a internet/i,
    /no puedo acceder/i,
    /fuera de mi conocimiento/i,
    /no tengo información/i,
  ];

  if (banned.some((r) => r.test(text))) {
    return "No está en mis fuentes locales.";
  }

  return text.slice(0, 1400);
}
