"use client";

import type { Doc } from "@/types/knowledge";

interface SearchResult {
  id: string;
  text: string;
  score: number;
}

// Función simple para extraer palabras clave
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
    "her",
    "was",
    "one",
    "our",
    "out",
    "day",
    "get",
    "has",
    "him",
    "his",
    "how",
    "man",
    "new",
    "now",
    "old",
    "see",
    "two",
    "way",
    "who",
    "boy",
    "did",
    "its",
    "let",
    "put",
    "say",
    "she",
    "too",
    "use",
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

// Base de conocimiento hardcodeada
const knowledgeBase: Doc[] = [
  {
    id: "persona",
    text: "👨‍💻 Christian Oscar Papa es un Desarrollador Frontend y Mobile especializado en React, React Native y TypeScript. Impulsa la creación de experiencias digitales escalables, fluidas y visualmente cuidadas, combinando la lógica del código con una visión artística del diseño. Modalidad de trabajo: 100% remota. Idiomas: español e inglés técnico.",
  },
  {
    id: "stack",
    text: "⚙️ Stack principal: React, Next.js, React Native, TypeScript, Vite, Zustand, Redux Toolkit, React Query, TailwindCSS, Material UI, ShadCN, Ant Design, Jest, Vitest, React Testing Library, Node.js, Prisma, Postgres, Supabase, Git y Vercel. En diseño usa Figma y Framer Motion, con foco en accesibilidad WCAG y performance.",
  },
  {
    id: "experiencia:santander",
    text: "🏦 React Developer en Santander Tecnología Argentina (jun. 2024 – actualidad). Desarrolla interfaces seguras y accesibles con React, TypeScript y Redux. Cumple con regulaciones bancarias y estándares de seguridad. Refactorizó componentes críticos, mejoró la performance y participa en code reviews con foco en calidad.",
  },
  {
    id: "experiencia:despegar",
    text: "✈️ React Developer en Despegar (jul. 2023 – may. 2024). Implementó nuevas funcionalidades en la plataforma de reservas de hoteles y vuelos. Usó React, TypeScript y TailwindCSS para componentes reutilizables e integró APIs en tiempo real. Mejoró el rendimiento (+15 puntos Lighthouse) y colaboró con UX/UI y backend.",
  },
  {
    id: "experiencia:bewise",
    text: "💻 React Developer en Bewise (jun. 2022 – jul. 2023). Desarrolló apps internas bajo metodología SCRUM. Stack: React, Vite, TailwindCSS. Mejoró accesibilidad y performance (Lighthouse +95). Participó en QA técnico y releases.",
  },
  {
    id: "experiencia:circulo",
    text: "🛒 Frontend Developer en Círculo Mágico (oct. 2021 – jun. 2022). Desarrolló el carrito de compras para e-commerce, priorizando rendimiento y experiencia de usuario. Implementó Redux, consumo de APIs RESTful y optimización de endpoints.",
  },
  {
    id: "experiencia:freelance",
    text: "🚀 Frontend & Mobile Developer Freelance (nov. 2020 – sept. 2021). Creó proyectos con React, React Native, Next.js, Vue.js y TypeScript. Desarrolló apps híbridas con Expo y React Native Paper, optimizando interfaces para Android e iOS. Foco en usabilidad, rendimiento y consistencia visual.",
  },
  {
    id: "filosofia",
    text: "💡 Christian combina disciplina técnica con creatividad artística. Encarar un proyecto es como escalar una montaña: requiere constancia, foco y adaptación. Aplica metodologías ágiles, testing continuo y diseño centrado en el usuario. Cree en la mejora constante, en escribir código limpio y en entregar resultados reales que impacten.",
  },
  {
    id: "contacto",
    text: "🔗 LinkedIn: https://www.linkedin.com/in/christian-oscar-papa · GitHub: https://github.com/christofa2000 · Email: christofa2000@gmail.com",
  },
];

// Función de búsqueda simple
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

// Función para generar respuesta contextual
export function generateResponse(
  query: string,
  results: SearchResult[]
): string {
  if (results.length === 0) {
    return "No encontré información relevante sobre esa consulta. ¿Podrías reformular tu pregunta?";
  }

  const queryLower = query.toLowerCase();

  // Preguntas sobre stack tecnológico
  if (
    queryLower.includes("stack") ||
    queryLower.includes("tecnología") ||
    queryLower.includes("tecnologias") ||
    queryLower.includes("herramientas")
  ) {
    const stackInfo = results.find((r) => r.id === "stack");
    if (stackInfo) {
      return `Mi stack tecnológico principal incluye: React, Next.js, React Native, TypeScript, Vite, Zustand, Redux Toolkit, React Query, TailwindCSS, Material UI, ShadCN, Ant Design, Jest, Vitest, React Testing Library, Node.js, Prisma, Postgres, Supabase, Git y Vercel. También uso Figma y Framer Motion para diseño, con foco en accesibilidad WCAG y performance.`;
    }
  }

  // Preguntas sobre experiencia
  if (
    queryLower.includes("experiencia") ||
    queryLower.includes("trabajo") ||
    queryLower.includes("empresa")
  ) {
    const expResults = results.filter((r) => r.id.startsWith("experiencia:"));
    if (expResults.length > 0) {
      const experiences = expResults.map((r) => r.text).join("\n\n");
      return `Mi experiencia profesional incluye:\n\n${experiences}`;
    }
  }

  // Preguntas personales
  if (
    queryLower.includes("quién") ||
    queryLower.includes("quien") ||
    queryLower.includes("sobre")
  ) {
    const personalInfo = results.find((r) => r.id === "persona");
    if (personalInfo) {
      return personalInfo.text;
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

  // Respuesta genérica con contexto
  const contextText = results.map((r) => r.text).join("\n\n");
  return `Basándome en mi información:\n\n${contextText}`;
}



