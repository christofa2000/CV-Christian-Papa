"use client";
import { useState } from "react";

export default function TestSimplePage(): React.JSX.Element {
  const [q, setQ] = useState("");
  const [a, setA] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function ask(): Promise<void> {
    if (!q.trim()) return;
    setLoading(true);
    setA("");

    try {
      const res = await fetch("/api/chat-simple", {
        method: "POST",
        body: JSON.stringify({ message: q }),
        headers: { "Content-Type": "application/json" },
      });

      const data = (await res.json()) as { answer?: string; error?: string };
      setA(data.answer ?? data.error ?? "Sin respuesta.");
    } catch (error) {
      console.error("Error:", error);
      setA(
        "Error: " + (error instanceof Error ? error.message : "Desconocido")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">🧪 Test - Sistema Simplificado</h1>
      <p className="text-sm opacity-80">
        Prueba el sistema RAG simplificado sin dependencias externas.
      </p>

      <div className="space-y-2">
        <h2 className="font-semibold">Preguntas de prueba:</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "¿Cuál es tu stack?",
            "¿Dónde trabajas?",
            "¿Qué experiencia tienes?",
            "¿Cómo contactarte?",
            "¿Qué tecnologías usas?",
          ].map((question) => (
            <button
              key={question}
              onClick={() => setQ(question)}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          placeholder="Preguntá algo..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          onClick={ask}
          disabled={loading || !q.trim()}
          className="rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Pensando..." : "Preguntar"}
        </button>
      </div>

      {a && (
        <div className="rounded border p-4 bg-gray-50">
          <div className="text-xs uppercase opacity-60 mb-1">ChrisBot</div>
          <div className="whitespace-pre-wrap">{a}</div>
        </div>
      )}
    </main>
  );
}



