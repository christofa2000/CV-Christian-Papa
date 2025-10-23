"use client";

import localforage from "localforage";

type Doc = { id: string; text: string };
type VecDoc = { id: string; text: string; keywords: string[] };

const store = localforage.createInstance({ name: "cvchris-rag-simple" });

// Función simple para extraer palabras clave
function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .filter((word) => !isStopWord(word));

  // Contar frecuencia y tomar las más comunes
  const wordCount: Record<string, number> = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
}

function isStopWord(word: string): boolean {
  const stopWords = new Set([
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "up",
    "about",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "among",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
    "my",
    "your",
    "his",
    "her",
    "its",
    "our",
    "their",
    "a",
    "an",
    "some",
    "any",
    "all",
    "both",
    "each",
    "every",
    "no",
    "other",
    "another",
    "such",
    "what",
    "which",
    "who",
    "whom",
    "whose",
    "where",
    "when",
    "why",
    "how",
    "el",
    "la",
    "los",
    "las",
    "un",
    "una",
    "de",
    "del",
    "en",
    "con",
    "por",
    "para",
    "sobre",
    "entre",
    "durante",
    "desde",
    "hasta",
    "hacia",
    "contra",
    "sin",
    "bajo",
    "sobre",
    "tras",
    "ante",
    "según",
    "mediante",
    "durante",
    "excepto",
    "salvo",
    "menos",
    "más",
    "muy",
    "mucho",
    "poco",
    "bastante",
    "demasiado",
    "todo",
    "toda",
    "todos",
    "todas",
    "alguno",
    "alguna",
    "algunos",
    "algunas",
    "ninguno",
    "ninguna",
    "ningunos",
    "ningunas",
    "otro",
    "otra",
    "otros",
    "otras",
    "mismo",
    "misma",
    "mismos",
    "mismas",
    "tal",
    "tales",
    "cual",
    "cuales",
    "cuanto",
    "cuanta",
    "cuantos",
    "cuantas",
    "tanto",
    "tanta",
    "tantos",
    "tantas",
  ]);
  return stopWords.has(word);
}

// Función simple de similitud basada en palabras clave
function calculateSimilarity(
  queryKeywords: string[],
  docKeywords: string[]
): number {
  if (queryKeywords.length === 0 || docKeywords.length === 0) return 0;

  const querySet = new Set(queryKeywords);
  const docSet = new Set(docKeywords);

  const intersection = new Set([...querySet].filter((x) => docSet.has(x)));
  const union = new Set([...querySet, ...docSet]);

  return intersection.size / union.size;
}

export async function buildIndex(docs: Doc[]) {
  try {
    console.log("Building simple keyword index...");
    const out: VecDoc[] = [];

    for (const d of docs) {
      const keywords = extractKeywords(d.text);
      out.push({ id: d.id, text: d.text, keywords });
    }

    await store.setItem("index", out);
    console.log(`Simple index built with ${out.length} documents`);
  } catch (error) {
    console.error("Error building simple index:", error);
    throw error;
  }
}

export async function retrieve(query: string, k = 5) {
  try {
    const queryKeywords = extractKeywords(query);
    const index = (await store.getItem<VecDoc[]>("index")) || [];

    if (index.length === 0) {
      console.warn("No index found, returning empty results");
      return [];
    }

    const results = index
      .map((d) => ({
        ...d,
        score: calculateSimilarity(queryKeywords, d.keywords),
      }))
      .filter((d) => d.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, k);

    console.log(
      `Found ${results.length} relevant documents for query: "${query}"`
    );
    return results;
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

