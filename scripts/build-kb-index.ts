#!/usr/bin/env ts-node
import MiniSearch, {
  type AsPlainObject,
  type Options as MiniSearchOptions,
} from "minisearch";
import fs from "node:fs/promises";
import path from "node:path";
import removeAccents from "remove-accents";

type KBItem = { id: string; tags: string[]; text: string };

type SerializedDoc = {
  id: number;
  kid: string;
  tags: string;
  text: string;
  lex: string;
};

type ChunkRecord = {
  id: string;
  text: string;
  source?: string;
  embedding?: number[] | null;
  bow?: Record<string, number>;
};

type OutputPayload = {
  version: number;
  createdAt: string;
  count: number;
  chunks: ChunkRecord[];
  options: MiniSearchOptions<SerializedDoc>;
  docs: SerializedDoc[];
  embeddings: number[][];
  miniIndex: AsPlainObject;
  embeddingsEnabled: boolean;
};

type CLIOptions = {
  noEmbed: boolean;
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

const miniSearchOptions: MiniSearchOptions<SerializedDoc> = {
  fields: ["lex", "text", "tags"],
  storeFields: ["kid", "tags", "text"],
  searchOptions: {
    boost: { lex: 2, tags: 1.5, text: 1 },
    fuzzy: 0.1,
    prefix: true,
  },
};

function printHelp(): void {
  const lines = [
    "Usage: tsx scripts/build-kb-index.ts [--no-embed] [--help]",
    "",
    "Options:",
    "  --no-embed     Skip embedding generation (or set KB_NO_EMBED=1)",
    "  --help         Show this message and exit",
  ];
  console.log(lines.join("\n"));
}

function parseArgs(argv: string[]): CLIOptions | null {
  if (argv.includes("--help")) {
    printHelp();
    return null;
  }

  const noEmbed =
    process.env.KB_NO_EMBED === "1" || argv.includes("--no-embed");

  return { noEmbed };
}

function normalizeEs(input: string): string {
  const noAccents = removeAccents(input.toLowerCase());
  const tokens = noAccents
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map(lightSpanishStem)
    .filter((token) => token.length > 2 && !STOPWORDS.has(token));
  return tokens.join(" ").trim();
}

function tokenize(input: string): string[] {
  const normalized = normalizeEs(input);
  return normalized ? normalized.split(" ") : [];
}

function buildBow(text: string): Record<string, number> | undefined {
  const tokens = tokenize(text);
  if (tokens.length === 0) return undefined;

  const freq = new Map<string, number>();
  for (const token of tokens) {
    freq.set(token, (freq.get(token) ?? 0) + 1);
  }

  const total = tokens.length;
  const bow: Record<string, number> = {};
  for (const [term, count] of freq.entries()) {
    bow[term] = count / total;
  }

  return bow;
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

async function getEmbedding(text: string): Promise<number[] | null> {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("Texto inválido para generar embedding");
  }

  const provider = (process.env.KB_EMBED_PROVIDER || "ollama").toLowerCase();

  if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY no definido. Configuralo o usa KB_EMBED_PROVIDER=ollama."
      );
    }

    const response = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_EMBED_MODEL ?? "text-embedding-3-small",
        input: [text.trim()],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Fallo al generar embeddings con OpenAI (${response.status}): ${body}`
      );
    }

    const data = (await response.json()) as {
      data?: Array<{ embedding: number[] }>;
    };
    if (
      !data.data ||
      data.data.some((entry) => !Array.isArray(entry.embedding))
    ) {
      throw new Error("Respuesta inesperada de OpenAI: embeddings faltantes.");
    }

    return data.data[0].embedding;
  }

  const endpoint =
    process.env.OLLAMA_EMBED_URL || "http://localhost:11434/api/embeddings";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model:
        process.env.EMBEDDING_MODEL ??
        process.env.OLLAMA_EMBED_MODEL ??
        "nomic-embed-text",
      input: text.trim(),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Fallo al generar embeddings con Ollama (${response.status}): ${body}`
    );
  }

  type EmbeddingResp = {
    embedding?: number[];
    embeddings?: number[] | number[][];
    data?: Array<{ embedding: number[] }>;
  };

  const data = (await response.json()) as EmbeddingResp;

  if (Array.isArray(data?.embedding)) return data.embedding;

  if (data?.embeddings) {
    const embeddings = data.embeddings as unknown;
    if (Array.isArray(embeddings) && embeddings.length > 0) {
      const first = embeddings[0] as unknown;
      if (typeof first === "number") {
        return embeddings as number[];
      }
      if (
        Array.isArray(first) &&
        first.length > 0 &&
        typeof first[0] === "number"
      ) {
        return first as number[];
      }
    }
  }

  if (Array.isArray(data?.data) && data.data.length > 0) {
    const first = data.data[0];
    if (Array.isArray(first?.embedding)) {
      return first.embedding;
    }
  }

  throw new Error("Respuesta inesperada de Ollama: falta 'embedding'.");
}

function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function verifyOutput(
  filePath: string,
  expected: ChunkRecord[]
): Promise<void> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Archivo JSON inválido");
    }

    const value = parsed as { count?: unknown; chunks?: unknown };
    const count =
      typeof value.count === "number" && Number.isFinite(value.count)
        ? value.count
        : null;
    const chunks = Array.isArray(value.chunks) ? value.chunks : null;
    if (count === null || chunks === null || count !== expected.length) {
      throw new Error("Conteo de chunks inconsistente");
    }
  } catch (error) {
    console.warn(`[kb:build] WARN verificación fallida: ${formatError(error)}`);
  }
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const options = parseArgs(argv);
  if (options === null) {
    return;
  }

  const kbPath = path.join(process.cwd(), "src", "data", "knowledge.json");
  let raw: string;
  try {
    raw = await fs.readFile(kbPath, "utf8");
  } catch (error) {
    console.error(`[kb:build] No pude leer ${kbPath}: ${formatError(error)}`);
    process.exit(1);
    return;
  }

  let kb: KBItem[];
  try {
    kb = JSON.parse(raw) as KBItem[];
  } catch (error) {
    console.error(
      `[kb:build] JSON inválido en knowledge.json: ${formatError(error)}`
    );
    process.exit(1);
    return;
  }

  if (!Array.isArray(kb) || kb.length === 0) {
    console.error("[kb:build] knowledge.json está vacío o mal formado.");
    process.exit(1);
    return;
  }

  // Validar estructura de los elementos
  for (let i = 0; i < kb.length; i++) {
    const item = kb[i];
    if (!item || typeof item !== "object") {
      console.error(`[kb:build] Elemento inválido en índice ${i}`);
      process.exit(1);
      return;
    }
    if (!item.id || typeof item.id !== "string") {
      console.error(`[kb:build] ID inválido en elemento ${i}`);
      process.exit(1);
      return;
    }
    if (!Array.isArray(item.tags)) {
      console.error(`[kb:build] Tags inválidos en elemento ${i}`);
      process.exit(1);
      return;
    }
    if (!item.text || typeof item.text !== "string") {
      console.error(`[kb:build] Texto inválido en elemento ${i}`);
      process.exit(1);
      return;
    }
  }

  const docs: SerializedDoc[] = kb.map((item, index) => {
    const lex = normalizeEs(
      `${item.id} ${item.tags.join(" ")} ${item.text ?? ""}`
    );

    return {
      id: index,
      kid: item.id,
      tags: item.tags.join(" "),
      text: item.text,
      lex,
    };
  });

  const mini = new MiniSearch<SerializedDoc>(miniSearchOptions);
  mini.addAll(docs);

  const chunks: ChunkRecord[] = [];
  const embeddingsRequested = !options.noEmbed;
  let embeddedChunks = 0;
  let embeddingErrorLogged = false;

  console.log(`[kb:build] Procesando ${docs.length} documentos...`);

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    let embedding: number[] | null = null;

    if (embeddingsRequested) {
      try {
        console.log(
          `[kb:build] Generando embedding ${i + 1}/${docs.length}...`
        );
        embedding = await getEmbedding(doc.lex);
      } catch (error) {
        if (!embeddingErrorLogged) {
          console.warn(
            `[kb:build] WARN no se generaron embeddings (${formatError(
              error
            )}). Continuando sin embeddings.`
          );
          embeddingErrorLogged = true;
        }
        embedding = null;
      }
    }

    if (Array.isArray(embedding) && embedding.length > 0) {
      embeddedChunks += 1;
    }

    const chunk: ChunkRecord = {
      id: doc.kid,
      text: doc.text,
      source: doc.kid,
      ...(embedding && embedding.length > 0 ? { embedding } : {}),
    };

    if (!chunk.embedding) {
      const bow = buildBow(doc.text);
      if (bow && Object.keys(bow).length > 0) {
        chunk.bow = bow;
      }
    }

    chunks.push(chunk);
  }

  const embeddingsEnabled = embeddedChunks > 0;
  const embeddingsArray: number[][] = chunks.map((chunk) =>
    Array.isArray(chunk.embedding) ? chunk.embedding : []
  );

  const output: OutputPayload = {
    version: 1,
    createdAt: new Date().toISOString(),
    count: chunks.length,
    chunks,
    options: miniSearchOptions,
    docs,
    embeddings: embeddingsEnabled ? embeddingsArray : [],
    miniIndex: mini.toJSON(),
    embeddingsEnabled,
  };

  const dataDir = path.join(process.cwd(), "data");
  await fs.mkdir(dataDir, { recursive: true });

  const outFile = path.join(dataDir, "kb_index.json");
  await fs.writeFile(outFile, JSON.stringify(output));

  await verifyOutput(outFile, chunks);

  const embedStatus = embeddingsEnabled && embeddedChunks > 0 ? "ON" : "OFF";
  console.log(
    `[kb:build] OK -> ${outFile} (${chunks.length} chunks, embeddings: ${embedStatus})`
  );
}

main().catch((error) => {
  console.error(`[kb:build] Error inesperado: ${formatError(error)}`);
  process.exit(1);
});
