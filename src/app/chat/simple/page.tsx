"use client";

import knowledge from "@/data/knowledge.json";
import { expand } from "@/lib/chunker";
import { buildIndex, guardAnswer, retrieve } from "@/lib/rag.simple";
import { useCallback, useEffect, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function SimpleChat() {
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [indexReady, setIndexReady] = useState(false);

  const initIndex = useCallback(async () => {
    try {
      console.log("Building knowledge index...");
      await buildIndex(expand(knowledge as any)); // eslint-disable-line @typescript-eslint/no-explicit-any
      setIndexReady(true);
      setReady(true);
      console.log("Index ready!");
    } catch (err) {
      console.error("Error initializing index:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  }, []);

  useEffect(() => {
    initIndex();
  }, [initIndex]);

  async function ask(input: string) {
    if (!indexReady) {
      await initIndex();
      if (!indexReady) return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await retrieve(input, 3);

      if (results.length === 0) {
        setMessages((m) => [
          ...m,
          { role: "user", content: input },
          {
            role: "assistant",
            content:
              "No encontré información relevante en mis fuentes locales.",
          },
        ]);
        return;
      }

      // Crear respuesta basada en los documentos encontrados
      const context = results.map((r, i) => `${i + 1}. ${r.text}`).join("\n\n");
      const response = `Basándome en mi información local:\n\n${context}\n\nFuentes: ${results
        .map((r) => r.id)
        .join(", ")}`;

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
      <h1 className="text-2xl font-bold mb-4">Chat Simple - CV Christian</h1>

      {error && (
        <div className="mb-4 rounded bg-red-100 border border-red-400 text-red-700 px-4 py-3">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!ready && !error && (
        <div className="mb-4 rounded bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3">
          <p>Inicializando índice de conocimiento…</p>
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
            <strong>Asistente:</strong> Buscando información...
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
          disabled={loading || !ready}
          className="flex-1 rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ring-offset-2 disabled:opacity-50"
          placeholder="Pregúntame sobre Christian o sus proyectos"
          aria-label="Entrada para preguntas"
        />
        <button
          disabled={loading || !ready}
          className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 ring-offset-2 disabled:opacity-50"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </form>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Nota:</strong> Este es un chat simple que busca información
          por palabras clave en lugar de usar IA.
        </p>
        <p>
          Pregunta sobre: React, Next.js, TypeScript, proyectos, experiencia,
          etc.
        </p>
      </div>
    </div>
  );
}

