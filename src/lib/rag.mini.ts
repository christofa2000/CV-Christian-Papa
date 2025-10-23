import MiniSearch from "minisearch";

export type KnowledgeItem = {
  id: string;
  text: string;
  tags?: string[];
  keywords?: string[];
};

export type RetrieveResult = {
  id: string;
  text: string;
  score?: number;
};

// Diccionario de sinónimos/expansiones
const SYN = {
  desafios: [
    "desafíos",
    "desafio",
    "retos",
    "superacion",
    "resiliencia",
    "aconcagua",
  ],
  tecnologias: ["stack", "tech", "herramientas", "frameworks"],
  trabajo: ["empleo", "puesto", "actual", "actualmente"],
} as const;

// Índice singleton
let searchIndex: MiniSearch<KnowledgeItem> | null = null;

/**
 * Construye el índice de búsqueda con MiniSearch
 * Idempotente: si ya existe, lo reutiliza
 */
export function buildIndex(items: KnowledgeItem[]): void {
  if (searchIndex) {
    console.log("Index already exists, reusing...");
    return;
  }

  if (!items || items.length === 0) {
    throw new Error("No items provided to build index");
  }

  console.log(`Building MiniSearch index with ${items.length} items...`);

  searchIndex = new MiniSearch({
    fields: ["text", "tags", "keywords"],
    storeFields: ["id", "text"],
    searchOptions: {
      boost: { text: 3, keywords: 2, tags: 1 },
      fuzzy: 0.2,
      prefix: true,
    },
    tokenize: (text: string) => {
      return text
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter((token) => token.length > 0);
    },
  });

  // Indexar los elementos
  searchIndex.addAll(items);

  console.log(`Index built successfully with ${items.length} items`);
}

/**
 * Expande la consulta con sinónimos
 */
function expandQuery(q: string): string {
  if (!q || typeof q !== "string") return "";

  // Normalizar a minúsculas y quitar tildes
  const normalized = q
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (!normalized) return q;

  // Buscar sinónimos y expandir
  const expandedTerms = [normalized];

  for (const [key, synonyms] of Object.entries(SYN)) {
    if (normalized.includes(key)) {
      expandedTerms.push(...synonyms);
    }
    // También buscar si algún sinónimo está en la consulta
    for (const synonym of synonyms) {
      if (normalized.includes(synonym)) {
        expandedTerms.push(key, ...synonyms);
        break;
      }
    }
  }

  // Unir términos únicos
  return [...new Set(expandedTerms)].join(" ");
}

/**
 * Busca documentos relevantes usando MiniSearch
 */
export function retrieve(query: string, k = 4): RetrieveResult[] {
  if (!searchIndex) {
    console.warn("Index not built yet");
    return [];
  }

  if (!query || typeof query !== "string" || !query.trim()) {
    console.warn("Empty query provided");
    return [];
  }

  if (k <= 0) {
    console.warn("Invalid k value");
    return [];
  }

  try {
    // Expandir consulta con sinónimos
    const expandedQuery = expandQuery(query.trim());

    const results = searchIndex.search(expandedQuery, {
      boost: { text: 3, keywords: 2, tags: 1 },
      fuzzy: 0.2,
      prefix: true,
    });

    const mappedResults = [
      ...results.map((result) => ({
        id: result.id,
        text: result.text,
        score: result.score,
      })),
    ];

    // Post-procesado: priorizar "motivacion" para consultas de desafíos
    const desafiosTerms = [
      "desafios",
      "desafíos",
      "desafio",
      "retos",
      "superacion",
    ];
    const queryLower = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (desafiosTerms.some((term) => queryLower.includes(term))) {
      const motivacionIndex = mappedResults.findIndex(
        (r) => r.id === "motivacion"
      );
      if (motivacionIndex > 0) {
        // Mover motivacion al primer lugar
        const motivacionResult = mappedResults.splice(motivacionIndex, 1)[0];
        mappedResults.unshift(motivacionResult);
      }
    }

    return mappedResults.slice(0, k);
  } catch (error) {
    console.error("Error during search:", error);
    return [];
  }
}

/**
 * Verifica si el índice está construido
 */
export function ready(): boolean {
  return searchIndex !== null;
}

/**
 * Función de utilidad para resumir texto en oraciones completas
 */
export function summarizeSentences(text: string, maxChars = 240): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  // Dividir por oraciones usando regex que preserva los delimitadores
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);

  if (sentences.length === 0) {
    return truncateByWords(text, maxChars);
  }

  let result = "";
  let charCount = 0;

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (charCount + trimmedSentence.length <= maxChars) {
      result += (result ? " " : "") + trimmedSentence;
      charCount += trimmedSentence.length + (result ? 1 : 0);

      // Limitar a máximo 2 oraciones
      if (result.split(/[.!?]/).length >= 2) {
        break;
      }
    } else {
      break;
    }
  }

  return result || truncateByWords(text, maxChars);
}

/**
 * Recorta texto por palabras sin partirlas
 */
export function truncateByWords(text: string, maxChars: number): string {
  if (!text || typeof text !== "string" || text.length <= maxChars) {
    return text;
  }

  const truncated = text.slice(0, maxChars);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxChars * 0.8) {
    return truncated.slice(0, lastSpace) + "…";
  }

  return truncated + "…";
}
