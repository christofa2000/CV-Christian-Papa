"use client";
import knowledge from "@/data/knowledge.json";
import { expand } from "@/lib/chunker";
import { getAIResponse, isGroqConfigured } from "@/lib/groq-ai";
import {
  buildIndex,
  retrieve,
  summarizeSentences,
  truncateByWords,
  type RetrieveResult,
} from "@/lib/rag.mini";
import { useCallback, useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

// Constantes de configuración
const MAX_FIRST = 240; // primera respuesta (resumen)
const MAX_BULLET = 140; // cada bullet
const K_FIRST = 1;
const K_NEXT = 3;

// Sugerencias de ayuda
const SUGGESTIONS = [
  "¿Quién es Christian?",
  "Tecnologías que usa",
  "Trabajo actual",
  "Proyectos destacados",
  "Desafíos",
] as const;

export default function Chat() {
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [extendedMode, setExtendedMode] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [useAI, setUseAI] = useState(false);
  const booting = useRef(false);

  const initEngine = useCallback(async () => {
    if (booting.current) return;
    booting.current = true;
    setError(null);

    try {
      console.log("Building MiniSearch index...");
      buildIndex(
        expand(
          knowledge as unknown as Array<{
            id: string;
            text: string;
            tags?: string[];
            keywords?: string[];
          }>
        )
      );
      setReady(true);
      console.log("MiniSearch index ready!");
    } catch (e) {
      console.error("Error initializing index:", e);
      setError(e instanceof Error ? e.message : "Error desconocido");
      setReady(false);
    } finally {
      booting.current = false;
    }
  }, []);

  // Verificar si Groq está configurado
  useEffect(() => {
    setUseAI(isGroqConfigured());
  }, []);

  // Inicialización con requestIdleCallback
  useEffect(() => {
    const url = new URL(window.location.href);
    const defer = url.searchParams.get("defer") === "1";

    if (!defer) {
      const idle = (cb: () => void) => {
        if ("requestIdleCallback" in window) {
          (
            window as {
              requestIdleCallback: (
                callback: () => void,
                options?: { timeout: number }
              ) => void;
            }
          ).requestIdleCallback(cb, { timeout: 2000 });
        } else {
          setTimeout(cb, 1200);
        }
      };
      idle(() => initEngine());
    }

    const onMsg = (e: MessageEvent<unknown>) => {
      if (
        e.data &&
        typeof e.data === "object" &&
        "type" in e.data &&
        e.data.type === "cvchris:init-engine"
      ) {
        initEngine();
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [initEngine]);

  // Función para generar respuesta inteligente
  function generateResponse(query: string, results: RetrieveResult[]): string {
    if (!results || results.length === 0) {
      return "No encontré información relevante en mis fuentes locales.";
    }

    const queryLower = query.toLowerCase();
    const isFirstMessage = messages.length === 0;
    const k = isFirstMessage ? K_FIRST : K_NEXT;

    // Tomar solo los resultados necesarios
    const relevantResults = results.slice(0, k);

    // Detectar si es consulta de desafíos
    const desafiosTerms = [
      "desafios",
      "desafíos",
      "desafio",
      "retos",
      "superacion",
    ];
    const isDesafiosQuery = desafiosTerms.some((term) =>
      queryLower
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(term)
    );

    if (isFirstMessage) {
      // Primera respuesta: breve y coherente (1-2 oraciones)
      const text = relevantResults[0]?.text || "";
      const summary = summarizeSentences(text, MAX_FIRST);
      const isMotivacion = relevantResults[0]?.id === "motivacion";

      // Prefijo según tipo de pregunta
      let prefix = "";
      if (isDesafiosQuery && isMotivacion) {
        prefix = "Desafíos (Aconcagua): ";
        // Asegurar que mencione Aconcagua
        if (!summary.toLowerCase().includes("aconcagua")) {
          return `${prefix}${summary} Su mayor reto fue escalar el Aconcagua.`;
        }
      } else if (queryLower.includes("quién") || queryLower.includes("who")) {
        prefix = "Sobre Christian: ";
      } else if (
        queryLower.includes("qué") ||
        queryLower.includes("what") ||
        queryLower.includes("tecno")
      ) {
        prefix = "Resumen técnico: ";
      } else if (queryLower.includes("cómo") || queryLower.includes("how")) {
        prefix = "Proceso: ";
      } else if (queryLower.includes("dónde") || queryLower.includes("where")) {
        prefix = "Contexto: ";
      }

      return prefix + summary;
    } else {
      // Respuestas siguientes: bullets con top-3
      const bullets = relevantResults
        .filter((r) => r && r.text && r.text.trim())
        .map((r, index) => {
          let bulletText = truncateByWords(r.text.trim(), MAX_BULLET);

          // Para consultas de desafíos, asegurar que el primer bullet mencione Aconcagua
          if (
            isDesafiosQuery &&
            index === 0 &&
            r.id === "motivacion" &&
            !bulletText.toLowerCase().includes("aconcagua")
          ) {
            bulletText += " (Aconcagua)";
          }

          return `• ${bulletText}`;
        })
        .join("\n");

      return (
        bullets || "No encontré información relevante en mis fuentes locales."
      );
    }
  }

  async function ask(input: string, isExtended = false) {
    if (!input || !input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Asegurar que el índice esté listo
      if (!ready) {
        await initEngine();
      }

      const k = isExtended ? 6 : messages.length === 0 ? K_FIRST : K_NEXT;
      const results = await retrieve(input.trim(), k);

      let response: string;

      // Usar IA si está configurado
      if (useAI && results.length > 0) {
        try {
          // Preparar contexto de la búsqueda RAG
          const context = results
            .filter((r) => r && r.text && r.text.trim())
            .map((r) => r.text.trim())
            .join("\n\n");

          // Preparar historial de conversación
          const history = messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));

          // Obtener respuesta de Groq
          response = await getAIResponse(input.trim(), context, history);
        } catch (aiError) {
          console.error("Error con IA, usando fallback:", aiError);
          // Fallback al sistema de búsqueda simple
          response = generateResponse(input.trim(), results);
        }
      } else {
        // Sistema de búsqueda simple (fallback)
        if (isExtended) {
          // Modo extendido: lista numerada sin truncado
          const numberedResults = results
            .filter((r) => r && r.text && r.text.trim())
            .map((r, index) => `${index + 1}. ${r.text.trim()}`)
            .join("\n\n");

          response =
            numberedResults ||
            "No encontré información relevante en mis fuentes locales.";
        } else {
          response = generateResponse(input.trim(), results);
        }
      }

      setMessages((m) => [
        ...m,
        { role: "user", content: input.trim() },
        { role: "assistant", content: response },
      ]);

      // Guardar query para "Ver más"
      setLastQuery(input.trim());
      setExtendedMode(isExtended);
    } catch (err) {
      console.error("Error asking question:", err);
      setError(
        err instanceof Error ? err.message : "Error al procesar la pregunta"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="mx-auto max-w-2xl p-4"
      style={
        {
          "--chat-button-display": "none",
        } as React.CSSProperties
      }
    >
      {error && (
        <div className="mb-4 rounded bg-red-100 border border-red-400 text-red-700 px-4 py-3">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!ready && (
        <p className="text-sm opacity-70">
          {useAI
            ? "Inicializando sistema de IA con Groq…"
            : "Inicializando el sistema de búsqueda…"}
        </p>
      )}

      <ul className="space-y-3">
        {messages.map((m, i) => (
          <li key={i} className="whitespace-pre-wrap">
            <strong>{m.role === "user" ? "Tú" : "ChrisBot"}:</strong>{" "}
            {m.content}
          </li>
        ))}
        {loading && (
          <li className="text-gray-500 italic">
            <strong>ChrisBot:</strong> Procesando...
          </li>
        )}
      </ul>

      <form
        className="mt-4 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget as HTMLFormElement;
          const fd = new FormData(form);
          const q = String(fd.get("q") || "").trim();
          if (q && !loading) {
            await ask(q);
            form.reset();
          }
        }}
      >
        <input
          name="q"
          disabled={loading}
          className="flex-1 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ring-offset-2 disabled:opacity-50"
          placeholder="Pregúntame sobre Christian o sus proyectos"
          aria-label="Entrada para preguntas"
        />
        <button
          disabled={loading}
          className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ring-offset-2 disabled:opacity-50"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </form>

      {/* Botones de ayuda debajo del input */}
      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => ask(suggestion)}
            disabled={loading}
            className="text-sm text-blue-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:text-blue-300"
          >
            {suggestion}
          </button>
        ))}

        {/* Botón "Ver más" */}
        {lastQuery && !extendedMode && messages.length > 0 && (
          <button
            onClick={() => ask(lastQuery, true)}
            disabled={loading}
            className="text-sm text-blue-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 dark:text-blue-300"
          >
            Ver más
          </button>
        )}
      </div>
    </div>
  );
}
