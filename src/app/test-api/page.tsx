"use client";
import { useState } from "react";

export default function TestApiPage(): React.JSX.Element {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testGet = async () => {
    setLoading(true);
    setResult("Probando GET...");

    try {
      const res = await fetch("/api/test-simple");
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(
        "Error GET: " + (error instanceof Error ? error.message : "Desconocido")
      );
    } finally {
      setLoading(false);
    }
  };

  const testPost = async () => {
    setLoading(true);
    setResult("Probando POST...");

    try {
      const res = await fetch("/api/test-simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(
        "Error POST: " +
          (error instanceof Error ? error.message : "Desconocido")
      );
    } finally {
      setLoading(false);
    }
  };

  const testChat = async () => {
    setLoading(true);
    setResult("Probando Chat API...");

    try {
      const res = await fetch("/api/chat-simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "¿Cuál es tu stack?" }),
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(
        "Error Chat: " +
          (error instanceof Error ? error.message : "Desconocido")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">🧪 Test API</h1>

      <div className="space-y-2">
        <button
          onClick={testGet}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test GET /api/test-simple
        </button>

        <button
          onClick={testPost}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test POST /api/test-simple
        </button>

        <button
          onClick={testChat}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Chat API
        </button>
      </div>

      {result && (
        <div className="rounded border p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Resultado:</h3>
          <pre className="text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </main>
  );
}



