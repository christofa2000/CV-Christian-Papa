import fs from "node:fs/promises";
import path from "node:path";
import MiniSearch, {
  type AsPlainObject,
  type Options as MiniSearchOptions,
} from "minisearch";
import removeAccents from "remove-accents";

type Doc = {
  id: number;
  kid: string;
  tags: string;
  text: string;
  lex: string;
};

type SerializedIndex = {
  version: number;
  builtAt: string;
  options?: MiniSearchOptions<Doc>;
  docs: Doc[];
  embeddings: number[][];
  miniIndex: AsPlainObject;
};

export type HybridHit = Doc & {
  score: number;
  lexicalScore: number;
  semanticScore: number;
};

export type HybridSearchResult = {
  hits: HybridHit[];
  hasStrongEvidence: boolean;
};

const STOPWORDS = new Set([
  "a",
  "acerca",
  "ademas",
  "algo",
  "al",
  "algun",
  "alguna",
  "algunas",
  "alguno",
  "algunos",
  "alli",
  "alla",
  "ante",
  "antes",
  "asi",
  "aun",
  "aunque",
  "cada",
  "como",
  "con",
  "contra",
  "cual",
  "cuales",
  "cuando",
  "cuanto",
  "de",
  "del",
  "desde",
  "donde",
  "dos",
  "durante",
  "e",
  "el",
  "ella",
  "ellas",
  "ellos",
  "en",
  "entre",
  "era",
  "eramos",
  "eran",
  "eres",
  "es",
  "esa",
  "esas",
  "ese",
  "eso",
  "esos",
  "esta",
  "estaba",
  "estaban",
  "estamos",
  "estan",
  "estar",
  "este",
  "esto",
  "estos",
  "fue",
  "fuera",
  "fueron",
  "ha",
  "habia",
  "habian",
  "han",
  "hasta",
  "hay",
  "la",
  "las",
  "le",
  "les",
  "lo",
  "los",
  "mas",
  "me",
  "mi",
  "mis",
  "mientras",
  "muy",
  "no",
  "nos",
  "nosotros",
  "nuestra",
  "nuestro",
  "o",
  "otra",
  "otros",
  "para",
  "pero",
  "poco",
  "por",
  "porque",
  "que",
  "quien",
  "quienes",
  "se",
  "segun",
  "ser",
  "si",
  "siempre",
  "sin",
  "sobre",
  "somos",
  "son",
  "su",
  "sus",
  "tambien",
  "tanto",
  "tiene",
  "tienen",
  "todo",
  "tras",
  "tu",
  "tus",
  "un",
  "una",
  "uno",
  "unos",
  "y",
  "ya",
]);

const miniSearchOptions: MiniSearchOptions<Doc> = {
  fields: ["lex", "text", "tags"],
  storeFields: ["kid", "tags", "text"],
  searchOptions: {
    boost: { lex: 2, tags: 1.5, text: 1 },
    fuzzy: 0.1,
    prefix: true,
  },
};

const INDEX_PATH = path.join(process.cwd(), "data", "kb_index.json");
const DEFAULT_ALPHA = 0.65;
export const MIN_SEMANTIC_SCORE = 0.45;

type IndexCache = {
  docs: Doc[];
  embeddings: number[][];
  mini: MiniSearch<Doc>;
};

let cache: IndexCache | null = null;

function normalizeEs(input: string): string {
  const noAccents = removeAccents(input.toLowerCase());
  const tokens = noAccents
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map(lightSpanishStem)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
  return tokens.join(" ").trim();
}

function lightSpanishStem(token: string): string {
  let stem = token;

  const replacements: Array<[RegExp, string]> = [
    [/mente$/, ""],
    [/aciones$/, "acion"],
    [/iciones$/, "icion"],
    [/uciones$/, "ucion"],
    [/amientos$/, "amiento"],
    [/imientos$/, "imiento"],
    [/encias$/, "encia"],
    [/idades$/, "idad"],
    [/logias$/, "logia"],
    [/ismos$/, "ismo"],
    [/istas$/, "ista"],
    [/ables$/, "able"],
    [/ibles$/, "ible"],
    [/adoras$/, "ador"],
    [/adores$/, "ador"],
  ];

  for (const [pattern, replacement] of replacements) {
    if (pattern.test(stem)) {
      stem = stem.replace(pattern, replacement);
      break;
    }
  }

  if (stem.endsWith("es") && stem.length > 4) {
    stem = stem.slice(0, -2);
  } else if (stem.endsWith("s") && stem.length > 3) {
    stem = stem.slice(0, -1);
  }

  return stem;
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  if (!Number.isFinite(denom) || denom === 0) {
    return 0;
  }
  return dot / denom;
}

async function embedQuery(query: string): Promise<number[]> {
  const provider = (process.env.KB_EMBED_PROVIDER || "ollama").toLowerCase();
  const normalized = normalizeEs(query) || query.toLowerCase();

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY no definido. Configura KB_EMBED_PROVIDER=ollama para embeddings locales."
      );
    }

    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: [normalized],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Fallo al generar embedding con OpenAI (${response.status}): ${body}`
      );
    }

    const data = await response.json();
    return data.data[0].embedding as number[];
  }

  const endpoint =
    process.env.OLLAMA_EMBED_URL || "http://localhost:11434/api/embeddings";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text",
      input: [normalized],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Fallo al generar embedding con Ollama (${response.status}): ${body}`
    );
  }

  const data = await response.json();
  if (!Array.isArray(data.embeddings) || data.embeddings.length === 0) {
    throw new Error("Respuesta inesperada de Ollama: falta 'embeddings'.");
  }

  return data.embeddings[0] as number[];
}

export async function loadIndex(): Promise<IndexCache> {
  if (cache) return cache;

  let raw: string;
  try {
    raw = await fs.readFile(INDEX_PATH, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(
        "No encontré data/kb_index.json. Ejecuta `npm run kb:build` antes de consultar el chat."
      );
    }
    throw error;
  }

  const parsed = JSON.parse(raw) as SerializedIndex;

  const options = parsed.options
    ? {
        ...miniSearchOptions,
        ...parsed.options,
      }
    : miniSearchOptions;

  const mini = MiniSearch.loadJS<Doc>(parsed.miniIndex, options);

  cache = {
    docs: parsed.docs,
    embeddings: parsed.embeddings,
    mini,
  };

  return cache;
}

function computeLexicalScores(
  mini: MiniSearch<Doc>,
  query: string
): Map<number, number> {
  const hits = mini.search(query, {
    boost: { lex: 2, tags: 1.5, text: 1 },
    fuzzy: 0.1,
    prefix: true,
  });
  const map = new Map<number, number>();
  for (const hit of hits) {
    map.set(Number(hit.id), hit.score);
  }
  return map;
}

export async function hybridSearch(
  query: string,
  k = 6,
  alpha = DEFAULT_ALPHA
): Promise<HybridSearchResult> {
  if (!query.trim()) {
    return { hits: [], hasStrongEvidence: false };
  }

  const normalized = normalizeEs(query) || query.toLowerCase();
  const index = await loadIndex();

  const lexicalScores = computeLexicalScores(index.mini, normalized);
  const qEmbedding = await embedQuery(normalized);

  const semScores = index.embeddings.map((embedding, idx) => ({
    id: idx,
    semanticScore: cosine(qEmbedding, embedding),
  }));

  const maxLex = Math.max(
    0,
    ...Array.from(lexicalScores.values()).map((score) => Math.abs(score))
  );

  const scored = semScores.map(({ id, semanticScore }) => {
    const lexicalScore = lexicalScores.get(id) ?? 0;
    const lexicalNormalized = maxLex > 0 ? lexicalScore / maxLex : 0;
    const combined = alpha * semanticScore + (1 - alpha) * lexicalNormalized;

    return {
      id,
      lexicalScore,
      semanticScore,
      combined,
    };
  });

  scored.sort((a, b) => b.combined - a.combined);

  const top = scored.slice(0, k);

  const hits = top.map((entry) => {
    const doc = index.docs[entry.id];
    return {
      ...doc,
      score: entry.combined,
      lexicalScore: entry.lexicalScore,
      semanticScore: entry.semanticScore,
    };
  });

  const hasStrongEvidence = hits.some(
    (hit) => hit.semanticScore >= MIN_SEMANTIC_SCORE
  );

  return { hits, hasStrongEvidence };
}
