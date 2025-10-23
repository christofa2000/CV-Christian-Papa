"use client";
import knowledge from "@/data/knowledge.json";
import { expand } from "@/lib/chunker";
import { buildIndex, guardAnswer, retrieve } from "@/lib/rag.simple";
import { useCallback, useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function Chat() {
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const booting = useRef(false);

  const initEngine = useCallback(async () => {
    if (booting.current) return;
    booting.current = true;
    setError(null);

    try {
      // Index local (si ya existe, es muy rápido)
      console.log("Building knowledge index...");
      await buildIndex(expand(knowledge as any)); // eslint-disable-line @typescript-eslint/no-explicit-any
      setReady(true);
      console.log("Index ready!");
    } catch (e) {
      console.error("Error initializing index:", e);
      setReady(false);
    } finally {
      booting.current = false;
    }
  }, []);

  // Si no viene defer, inicializar tras idle; si viene defer=1, esperar mensaje
  useEffect(() => {
    const url = new URL(window.location.href);
    const defer = url.searchParams.get("defer") === "1";

    if (!defer) {
      const idle = (cb: () => void) =>
        "requestIdleCallback" in window
          ? (window as any).requestIdleCallback(cb, { timeout: 2000 }) // eslint-disable-line @typescript-eslint/no-explicit-any
          : setTimeout(cb, 1200);
      idle(() => initEngine());
    }

    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "cvchris:init-engine") initEngine();
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [initEngine]);

  // Función para generar respuesta inteligente basada en contexto
  function generateResponse(query: string, results: any[]): string {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    if (results.length === 0) {
      return "No encontré información relevante en mis fuentes locales.";
    }

    // Analizar el tipo de pregunta
    const queryLower = query.toLowerCase();
    let responseType = "general";

    if (queryLower.includes("quién") || queryLower.includes("who")) {
      responseType = "personal";
    } else if (queryLower.includes("qué") || queryLower.includes("what")) {
      responseType = "technical";
    } else if (queryLower.includes("cómo") || queryLower.includes("how")) {
      responseType = "process";
    } else if (queryLower.includes("dónde") || queryLower.includes("where")) {
      responseType = "location";
    }

    // Construir respuesta contextual
    const context = results.map((r, i) => `${i + 1}. ${r.text}`).join("\n\n");

    let response = "";

    switch (responseType) {
      case "personal":
        response = `Sobre Christian Oscar Papa:\n\n${context}`;
        break;
      case "technical":
        response = `Información técnica:\n\n${context}`;
        break;
      case "process":
        response = `Proceso y metodología:\n\n${context}`;
        break;
      case "location":
        response = `Ubicación y contexto:\n\n${context}`;
        break;
      default:
        response = `Basándome en mi información local:\n\n${context}`;
    }

    return response;
  }

  async function ask(input: string) {
    setLoading(true);
    setError(null);

    try {
      // Asegurar que el índice esté listo
      if (!ready) {
        await initEngine();
      }

      const results = await retrieve(input, 4);
      const response = generateResponse(input, results);
      const text = guardAnswer(response);

      setMessages((m) => [
        ...m,
        { role: "user", content: input },
        { role: "assistant", content: text },
      ]);
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
          // Ocultar botón de chat dentro del iframe
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
          Inicializando el sistema de búsqueda…
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
          if (q && !loading) await ask(q);
          if (form) form.reset();
        }}
      >
        <input
          name="q"
          disabled={loading}
          className="flex-1 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ring-offset-2 disabled:opacity-50"
          placeholder="Pregúntame sobre Christian o sus proyectos"
          aria-label="Entrada para preguntas"
        />
        <button
          disabled={loading}
          className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ring-offset-2 disabled:opacity-50"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
