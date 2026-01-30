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

const MAX_FIRST = 240;
const MAX_BULLET = 140;
const K_FIRST = 1;
const K_NEXT = 3;

const SUGGESTIONS = [
  "¿Quién es Christian?",
  "Tecnologías que usa",
  "Trabajo actual",
  "Proyectos destacados",
  "Desafíos",
] as const;

/** Detecta si el mensaje es un saludo (respuesta directa sin RAG/API) */
function isGreeting(text: string): boolean {
  const t = text.trim().toLowerCase().replace(/\s+/g, " ");
  if (!t) return false;
  const greetings = [
    "hola",
    "holas",
    "buenas",
    "buen día",
    "buenos días",
    "hey",
    "hi",
    "hello",
    "qué tal",
    "que tal",
    "cómo estás",
    "como estas",
    "hola, estás",
    "hola estás",
    "estás?",
    "estas?",
    "saludos",
  ];
  if (greetings.some((g) => t === g || t.startsWith(g + " ") || t.startsWith(g + ",")))
    return true;
  if (/^hola\s*[!?.,]*$/i.test(t) || /^buenas?\s*[!?.,]*$/i.test(t)) return true;
  if (/^(hey|hi|hello)\s*[!?.,]*$/i.test(t)) return true;
  return false;
}

/** Respuesta humana para saludos (sin consultar knowledge ni API) */
function getGreetingResponse(query: string): string {
  const t = query.trim().toLowerCase();
  if (/^buenas?\s*[!?.,]*$/.test(t) || t.startsWith("buenas "))
    return "¡Buenas! ¿Querés saber sobre mi experiencia, stack o proyectos?";
  if (/^(hey|hi|hello)\s*[!?.,]*$/i.test(t))
    return "¡Hola! 👋 I'm ChrisBot. Ask me about my experience, tech stack or projects.";
  return "¡Hola! 👋 Soy ChrisBot. ¿En qué te puedo ayudar? Podés preguntar por mi experiencia, tecnologías o proyectos.";
}

export default function ChatContent() {
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
    } catch (e) {
      console.error("Error initializing index:", e);
      setError(e instanceof Error ? e.message : "Error desconocido");
      setReady(false);
    } finally {
      booting.current = false;
    }
  }, []);

  useEffect(() => {
    setUseAI(isGroqConfigured());
  }, []);

  useEffect(() => {
    initEngine();
  }, [initEngine]);

  function generateResponse(query: string, results: RetrieveResult[]): string {
    if (!results || results.length === 0) {
      return "No encontré información relevante en mis fuentes locales.";
    }

    const queryLower = query.toLowerCase();
    const isFirstMessage = messages.length === 0;
    const k = isFirstMessage ? K_FIRST : K_NEXT;
    const relevantResults = results.slice(0, k);

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
      const text = relevantResults[0]?.text || "";
      const summary = summarizeSentences(text, MAX_FIRST);
      const isMotivacion = relevantResults[0]?.id === "motivacion";

      let prefix = "";
      if (isDesafiosQuery && isMotivacion) {
        prefix = "Desafíos (Aconcagua): ";
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
      const bullets = relevantResults
        .filter((r) => r && r.text && r.text.trim())
        .map((r, index) => {
          let bulletText = truncateByWords(r.text.trim(), MAX_BULLET);
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

    const inputTrimmed = input.trim();

    try {
      // Handler de saludos: respuesta directa sin RAG ni API
      if (isGreeting(inputTrimmed)) {
        const greetingResponse = getGreetingResponse(inputTrimmed);
        setMessages((m) => [
          ...m,
          { role: "user", content: inputTrimmed },
          { role: "assistant", content: greetingResponse },
        ]);
        setLoading(false);
        return;
      }

      if (!ready) {
        await initEngine();
      }

      const k = isExtended ? 6 : messages.length === 0 ? K_FIRST : K_NEXT;
      const results = await retrieve(inputTrimmed, k);

      let response: string;

      if (useAI) {
        try {
          // Siempre llamar a la API cuando useAI: si RAG vacío, la API usa contexto mínimo (anti-silencio)
          const context =
            results.length > 0
              ? results
                  .filter((r) => r && r.text && r.text.trim())
                  .map((r) => r.text.trim())
                  .join("\n\n")
              : "";

          const history = messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }));

          response = await getAIResponse(inputTrimmed, context, history);

          // Regla anti-silencio: si la API devuelve vacío, fallback humano
          if (!response || !response.trim()) {
            response =
              "Estoy acá 🙂 ¿En qué te puedo ayudar? Podés preguntar por mi experiencia, tecnologías o proyectos.";
          }
        } catch (aiError) {
          console.error("Error con IA, usando fallback:", aiError);
          response =
            results.length > 0
              ? generateResponse(inputTrimmed, results)
              : "Estoy acá 🙂 ¿En qué te puedo ayudar? Podés preguntar por mi experiencia, tecnologías o proyectos.";
        }
      } else {
        if (isExtended) {
          const numberedResults = results
            .filter((r) => r && r.text && r.text.trim())
            .map((r, index) => `${index + 1}. ${r.text.trim()}`)
            .join("\n\n");

          response =
            numberedResults ||
            "Estoy acá 🙂 ¿En qué te puedo ayudar? Podés preguntar por mi experiencia, tecnologías o proyectos.";
        } else {
          response = generateResponse(inputTrimmed, results);
          if (
            !response ||
            response.includes("No encontré información relevante")
          ) {
            response =
              "Estoy acá 🙂 ¿En qué te puedo ayudar? Podés preguntar por mi experiencia, tecnologías o proyectos.";
          }
        }
      }

      setMessages((m) => [
        ...m,
        { role: "user", content: inputTrimmed },
        { role: "assistant", content: response },
      ]);

      setLastQuery(inputTrimmed);
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
    <div className="flex flex-col h-full min-h-0">
      {error && (
        <div className="mb-4 rounded bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!ready && (
        <p className="text-sm opacity-70 mb-4">
          {useAI
            ? "Inicializando sistema de IA con Groq…"
            : "Inicializando el sistema de búsqueda…"}
        </p>
      )}

      <ul className="space-y-3 flex-1 overflow-auto pb-4">
        {messages.map((m, i) => (
          <li key={i} className="whitespace-pre-wrap text-sm">
            <strong>{m.role === "user" ? "Tú" : "ChrisBot"}:</strong>{" "}
            {m.content}
          </li>
        ))}
        {loading && (
          <li className="text-neutral-400 italic text-sm">
            <strong>ChrisBot:</strong> Procesando...
          </li>
        )}
      </ul>

      <form
        className="flex gap-2 shrink-0 pt-2 border-t border-neutral-800"
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
          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ring-offset-0 ring-offset-neutral-950 disabled:opacity-50"
          placeholder="Preguntar sobre Christian o proyectos"
          aria-label="Mensaje del chat"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          aria-label="Enviar mensaje"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => ask(suggestion)}
            disabled={loading}
            className="text-xs text-blue-300 hover:text-blue-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
        {lastQuery && !extendedMode && messages.length > 0 && (
          <button
            type="button"
            onClick={() => ask(lastQuery, true)}
            disabled={loading}
            className="text-xs text-blue-300 hover:text-blue-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded disabled:opacity-50"
          >
            Ver más
          </button>
        )}
      </div>
    </div>
  );
}
