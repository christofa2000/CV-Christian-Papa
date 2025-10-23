"use client";
import { useState } from "react";

export default function DebugPage(): React.JSX.Element {
  const [chromaStatus, setChromaStatus] = useState<string>("");
  const [ollamaStatus, setOllamaStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testChroma = async () => {
    setLoading(true);
    setChromaStatus("Probando ChromaDB...");
    try {
      const res = await fetch("/api/test-chroma");
      const data = await res.json();
      setChromaStatus(JSON.stringify(data, null, 2));
    } catch (error) {
      setChromaStatus(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testOllama = async () => {
    setLoading(true);
    setOllamaStatus("Probando Ollama...");
    try {
      const res = await fetch("/api/test-ollama");
      const data = await res.json();
      setOllamaStatus(JSON.stringify(data, null, 2));
    } catch (error) {
      setOllamaStatus(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">🔧 Debug - Sistema RAG</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">ChromaDB</h2>
          <button
            onClick={testChroma}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Probar ChromaDB
          </button>
          <pre className="mt-4 text-sm bg-gray-100 p-3 rounded overflow-auto">
            {chromaStatus || "Haz clic en 'Probar ChromaDB'"}
          </pre>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Ollama</h2>
          <button
            onClick={testOllama}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Probar Ollama
          </button>
          <pre className="mt-4 text-sm bg-gray-100 p-3 rounded overflow-auto">
            {ollamaStatus || "Haz clic en 'Probar Ollama'"}
          </pre>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Instrucciones</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li>Primero prueba ChromaDB - debe estar corriendo en puerto 8000</li>
          <li>Luego prueba Ollama - debe estar corriendo en puerto 11434</li>
          <li>
            Si ChromaDB falla: <code>npm run chroma:run</code>
          </li>
          <li>
            Si Ollama falla: <code>ollama serve</code>
          </li>
          <li>
            Si faltan modelos: <code>npm run rag:pull</code>
          </li>
        </ol>
      </div>
    </main>
  );
}





