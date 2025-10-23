"use client";

// FunciÃ³n simple para extraer palabras clave
function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .filter((word) => !isStopWord(word));
}

// Palabras comunes a ignorar
function isStopWord(word: string): boolean {
  const stopWords = new Set([
    "que",
    "con",
    "para",
    "por",
    "del",
    "las",
    "los",
    "una",
    "uno",
    "son",
    "the",
    "and",
    "for",
    "are",
    "but",
    "not",
    "you",
    "all",
    "can",
    "had",
  ]);
  return stopWords.has(word);
}

// Calcular similitud simple basada en palabras clave
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

// Base de conocimiento simplificada
const knowledgeBase = [
  {
    id: "stack",
    text: "Mi stack tecnolÃ³gico principal incluye: React, Next.js, React Native, TypeScript, Vite, Zustand, Redux Toolkit, React Query, TailwindCSS, Material UI, ShadCN, Ant Design, Jest, Vitest, React Testing Library, Node.js, Prisma, Postgres, Supabase, Git y Vercel.",
  },
  {
    id: "experiencia",
    text: "Trabajo como React Developer en Santander TecnologÃ­a Argentina desde junio 2024. Anteriormente trabajÃ© en Despegar, Bewise, CÃ­rculo MÃ¡gico y como freelancer.",
  },
  {
    id: "contacto",
    text: "LinkedIn: https://www.linkedin.com/in/christian-oscar-papa Â· GitHub: https://github.com/christofa2000 Â· Email: christofa2000@gmail.com",
  },
];

interface SearchResult {
  id: string;
  text: string;
  score: number;
}


// FunciÃ³n de bÃºsqueda simple
export function searchKnowledge(query: string, limit = 5): SearchResult[] {
  const queryKeywords = extractKeywords(query);

  const results = knowledgeBase
    .map((doc) => {
      const docKeywords = extractKeywords(doc.text);
      const score = calculateSimilarity(queryKeywords, docKeywords);
      return {
        id: doc.id,
        text: doc.text,
        score,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

// FunciÃ³n para generar respuesta contextual
export function generateResponse(query: string, results: SearchResult[]): string {
  if (results.length === 0) {
    return "No encontrÃ© informaciÃ³n relevante sobre esa consulta. Â¿PodrÃ­as reformular tu pregunta?";
  }

  const queryLower = query.toLowerCase();

  // Preguntas sobre stack tecnolÃ³gico
  if (
    queryLower.includes("stack") ||
    queryLower.includes("tecnologÃ­a") ||
    queryLower.includes("tecnologias")
  ) {
    const stackInfo = results.find((r) => r.id === "stack");
    if (stackInfo) {
      return stackInfo.text;
    }
  }

  // Preguntas sobre experiencia
  if (
    queryLower.includes("experiencia") ||
    queryLower.includes("trabajo") ||
    queryLower.includes("empresa")
  ) {
    const expInfo = results.find((r) => r.id === "experiencia");
    if (expInfo) {
      return expInfo.text;
    }
  }

  // Preguntas sobre contacto
  if (
    queryLower.includes("contacto") ||
    queryLower.includes("email") ||
    queryLower.includes("linkedin")
  ) {
    const contactInfo = results.find((r) => r.id === "contacto");
    if (contactInfo) {
      return contactInfo.text;
    }
  }

  // Respuesta genÃ©rica con contexto
  const contextText = results.map((r) => r.text).join("\n\n");
  return `BasÃ¡ndome en mi informaciÃ³n:\n\n${contextText}`;
}



