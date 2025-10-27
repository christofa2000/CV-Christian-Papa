import MiniSearch from "minisearch";

/* ===================== Tipos públicos ===================== */
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

/* ===================== Utils de normalización ===================== */
const STOP_ES = new Set([
  "de",
  "la",
  "el",
  "y",
  "en",
  "a",
  "los",
  "las",
  "un",
  "una",
  "para",
  "con",
  "por",
  "del",
  "al",
  "lo",
  "es",
  "su",
  "sus",
]);

export function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function tokenizeBasic(text: string): string[] {
  return stripAccents(text.toLowerCase())
    .trim()
    .split(/\s+/)
    .filter((t) => t && !STOP_ES.has(t));
}

/* ===================== Sinónimos / expansión ===================== */
const SYN: Record<string, string[]> = {
  // ES
  desafios: [
    "desafíos",
    "desafio",
    "retos",
    "superacion",
    "resiliencia",
    "aconcagua",
  ],
  tecnologias: ["stack", "tech", "herramientas", "frameworks", "librerias"],
  trabajo: ["empleo", "puesto", "actual", "actualmente"],
  contacto: ["email", "correo", "linkedin", "github"],
  rendimiento: [
    "performance",
    "lighthouse",
    "web",
    "optimización",
    "velocidad",
  ],
  accesibilidad: ["a11y", "wcag", "contraste", "teclado", "aria"],
  pruebas: ["testing", "qa", "unitarias", "vitest", "jest", "rtl"],
  // EN básicos (por visitantes en inglés)
  "tech stack": ["stack", "technologies", "frameworks"],
  "current job": ["job", "role", "position", "now"],
  achievements: ["logros", "results", "impact"],
};

function expandQuery(q: string): string {
  const normalized = stripAccents(q.toLowerCase()).trim();
  if (!normalized) return "";

  const bag = new Set<string>(tokenizeBasic(normalized));

  // Coincidencia por claves y por sinónimos
  for (const [key, syns] of Object.entries(SYN)) {
    const keyTokens = tokenizeBasic(key).join(" ");
    if (
      normalized.includes(key) ||
      keyTokens.split(" ").every((t) => bag.has(t))
    ) {
      syns.forEach((s) => tokenizeBasic(s).forEach((t) => bag.add(t)));
    }
    for (const s of syns) {
      const st = tokenizeBasic(s);
      if (st.some((t) => bag.has(t))) {
        tokenizeBasic(key).forEach((t) => bag.add(t));
        st.forEach((t) => bag.add(t));
      }
    }
  }

  return [...bag].join(" ");
}

/* ===================== Índice + cache local ===================== */
let searchIndex: MiniSearch<KnowledgeItem> | null = null;

const INDEX_VERSION = "kb-v2"; // bump si cambiás schema o tokenización
const CACHE_KEY = `minisearch-index-${INDEX_VERSION}`;
const SIG_KEY = `minisearch-sig-${INDEX_VERSION}`;

function itemsSignature(items: KnowledgeItem[]): string {
  // Firma liviana: cantidad + ids concatenados
  return `${items.length}:${items.map((i) => i.id).join("|")}`;
}

function tryLoadFromCache(expectedSig: string): boolean {
  if (typeof window === "undefined" || !("localStorage" in window))
    return false;
  try {
    const storedSig = localStorage.getItem(SIG_KEY);
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw || storedSig !== expectedSig) return false;
    const json = JSON.parse(raw);
    searchIndex = MiniSearch.loadJSON(json, {
      fields: ["text", "tags", "keywords"],
      storeFields: ["id", "text"],
      tokenize: (t: string) => tokenizeBasic(t),
      searchOptions: {
        boost: { text: 3, keywords: 2, tags: 1 },
        fuzzy: 0.2,
        prefix: true,
      },
    });
    return !!searchIndex;
  } catch {
    return false;
  }
}

function saveCache(sig: string) {
  if (
    typeof window === "undefined" ||
    !("localStorage" in window) ||
    !searchIndex
  )
    return;
  try {
    const json = searchIndex.toJSON();
    localStorage.setItem(CACHE_KEY, JSON.stringify(json));
    localStorage.setItem(SIG_KEY, sig);
  } catch {
    /* ignore quota errors */
  }
}

/**
 * Construye el índice (idempotente). Usa cache si coincide la firma.
 */
export function buildIndex(items: KnowledgeItem[]): void {
  if (searchIndex) return;
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("No items provided to build index");
  }

  const sig = itemsSignature(items);
  if (tryLoadFromCache(sig)) return;

  searchIndex = new MiniSearch<KnowledgeItem>({
    fields: ["text", "tags", "keywords"],
    storeFields: ["id", "text"],
    tokenize: (t: string) => tokenizeBasic(t),
    searchOptions: {
      boost: { text: 3, keywords: 2, tags: 1 },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  searchIndex.addAll(
    items.map((i) => ({
      ...i,
      // Garantizar campos presentes
      tags: Array.isArray(i.tags) ? i.tags : [],
      keywords: Array.isArray(i.keywords) ? i.keywords : [],
      text: String(i.text ?? ""),
    }))
  );

  saveCache(sig);
}

/* ===================== Priorización por intención ===================== */
function prioritizeByIntent(
  query: string,
  hits: RetrieveResult[]
): RetrieveResult[] {
  const q = stripAccents(query.toLowerCase());

  // Desafíos → motivacion primero
  if (
    /\b(desafios|desafios|desafio|retos|superacion|resiliencia|aconcagua)\b/.test(
      q
    )
  ) {
    const idx = hits.findIndex((h) => h.id === "motivacion");
    if (idx > 0) {
      const [m] = hits.splice(idx, 1);
      hits.unshift(m);
    }
  }

  // Stack → id "stack"
  if (/\b(stack|tecnolog|framework|herramientas|tech)\b/.test(q)) {
    const idx = hits.findIndex((h) => h.id === "stack");
    if (idx > 0) {
      const [m] = hits.splice(idx, 1);
      hits.unshift(m);
    }
  }

  // Trabajo actual → experiencia:santander preferido
  if (
    /\b(trabajo|empleo|puesto|actual|actualmente|job|role|position)\b/.test(q)
  ) {
    const idx = hits.findIndex((h) => h.id === "experiencia:santander");
    if (idx > 0) {
      const [m] = hits.splice(idx, 1);
      hits.unshift(m);
    }
  }

  // Contacto
  if (/\b(contacto|email|correo|linkedin|github)\b/.test(q)) {
    const idx = hits.findIndex((h) => h.id === "contacto");
    if (idx > 0) {
      const [m] = hits.splice(idx, 1);
      hits.unshift(m);
    }
  }

  return hits;
}

/* ===================== Búsqueda ===================== */
export function retrieve(query: string, k = 4): RetrieveResult[] {
  if (!searchIndex) {
    console.warn("Index not built yet");
    return [];
  }
  const raw = String(query ?? "").trim();
  if (!raw || k <= 0) return [];

  const expanded = expandQuery(raw);
  if (!expanded) return [];

  try {
    const results = searchIndex.search(expanded, {
      boost: { text: 3, keywords: 2, tags: 1 },
      fuzzy: 0.2,
      prefix: true,
    });

    // Mapear y deduplicar por id (por si MiniSearch devuelve duplicados en ciertos merges)
    const mapped = results.map((r) => ({
      id: String((r as unknown as { id: string }).id),
      text: String((r as unknown as { text: string }).text ?? ""),
      score:
        typeof (r as unknown as { score?: number }).score === "number"
          ? (r as unknown as { score: number }).score
          : undefined,
    }));

    const unique: RetrieveResult[] = [];
    const seen = new Set<string>();
    for (const m of mapped) {
      if (!seen.has(m.id)) {
        unique.push(m);
        seen.add(m.id);
      }
    }

    const prioritized = prioritizeByIntent(raw, unique);
    return prioritized.slice(0, k);
  } catch (error) {
    console.error("Error during search:", error);
    return [];
  }
}

/* ===================== Estado del índice ===================== */
export function ready(): boolean {
  return searchIndex !== null;
}

/* ===================== Resúmenes / truncados ===================== */
/** Devuelve 1–2 oraciones completas (máx `maxChars`). */
export function summarizeSentences(text: string, maxChars = 240): string {
  const clean = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return "";

  const sentences = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length === 0) return truncateByWords(clean, maxChars);

  let out = "";
  let count = 0;
  for (const s of sentences) {
    const proposed = out ? `${out} ${s}` : s;
    if (proposed.length <= maxChars && count < 2) {
      out = proposed;
      count += 1;
      if (count >= 2) break;
    } else {
      break;
    }
  }
  return out || truncateByWords(clean, maxChars);
}

/** Recorta por palabras sin partirlas; añade “…” si recorta. */
export function truncateByWords(text: string, maxChars: number): string {
  const s = String(text ?? "");
  if (s.length <= maxChars) return s;
  const cut = s.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  const sliced = lastSpace > maxChars * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${sliced}…`;
}
