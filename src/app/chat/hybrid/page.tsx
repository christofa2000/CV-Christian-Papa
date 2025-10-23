"use client";

import knowledge from "@/data/knowledge.json";
import { expand } from "@/lib/chunker";
import { buildIndex, guardAnswer, retrieve } from "@/lib/rag.simple";
import { useCallback, useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function HybridChat() {
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const booting = useRef(false);

  const initIndex = useCallback(async () => {
    if (booting.current) return;
    booting.current = true;
    setError(null);

    try {
      console.log("Building knowledge index...");
      await buildIndex(expand(knowledge as any)); // eslint-disable-line @typescript-eslint/no-explicit-any
      setReady(true);
      console.log("Index ready!");
    } catch (err) {
      console.error("Error initializing index:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setReady(false);
    } finally {
      booting.current = false;
    }
  }, []);

  useEffect(() => {
    initIndex();
  }, [initIndex]);

  // Función para generar respuesta inteligente basada en contexto
  function generateResponse(
    query: string,
    results: Array<{ text: string; id: string }>
  ): string {
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
    const sources = results.map((r) => r.id).join(", ");

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

    response += `\n\nFuentes: ${sources}`;
    return response;
  }

  async function ask(input: string) {
    setLoading(true);
    setError(null);

    try {
      // Asegurar que el índice esté listo
      if (!ready) {
        await initIndex();
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
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Híbrido - CV Christian</h1>

      {error && (
        <div className="mb-4 rounded bg-red-100 border border-red-400 text-red-700 px-4 py-3">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!ready && !error && (
        <div className="mb-4 rounded bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3">
          <p>Inicializando sistema de búsqueda inteligente…</p>
          <p className="text-sm mt-1">Esto debería ser muy rápido.</p>
        </div>
      )}

      <ul className="space-y-3">
        {messages.map((m, i) => (
          <li key={i} className="whitespace-pre-wrap">
            <strong>{m.role === "user" ? "Tú" : "Asistente"}:</strong>{" "}
            {m.content}
          </li>
        ))}
        {loading && (
          <li className="text-gray-500 italic">
            <strong>Asistente:</strong> Analizando información...
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
          placeholder="Pregúntame sobre Christian, sus proyectos, experiencia, etc."
          aria-label="Entrada para preguntas"
        />
        <button
          disabled={loading}
          className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ring-offset-2 disabled:opacity-50"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Chat Híbrido:</strong> Sistema de búsqueda inteligente que
          analiza el tipo de pregunta y genera respuestas contextuales.
        </p>
        <p>
          <strong>Preguntas sugeridas:</strong> &ldquo;¿Quién es
          Christian?&rdquo;, &ldquo;¿Qué tecnologías usa?&rdquo;, &ldquo;¿Cómo
          trabaja?&rdquo;, &ldquo;¿Dónde está ubicado?&rdquo;
        </p>
      </div>
    </div>
  );
}
