"use client";
import { useState } from "react";

type EndpointStatus = number | "ERROR";

interface EndpointResult {
  status: EndpointStatus;
  ok: boolean;
  duration: string;
  data?: unknown;
  error?: string;
  timestamp: string;
}

type EndpointResults = Record<string, EndpointResult>;

export default function DiagnosticoPage(): React.JSX.Element {
  const [results, setResults] = useState<EndpointResults>({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (
    name: string,
    url: string,
    method: "GET" | "POST" = "GET",
    body?: Record<string, unknown>
  ) => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
      };

      if (body && method === "POST") {
        options.body = JSON.stringify(body);
      }

      const res = await fetch(url, options);
      const duration = Date.now() - startTime;

      let responseData: unknown;
      try {
        responseData = await res.json();
      } catch {
        responseData = {
          error: "Response no es JSON vÃ¡lido",
          text: await res.text(),
        };
      }

      setResults((prev) => ({
        ...prev,
        [name]: {
          status: res.status,
          ok: res.ok,
          duration: `${duration}ms`,
          data: responseData,
          timestamp: new Date().toISOString(),
        },
      }));
    } catch (error) {
      const duration = Date.now() - startTime;
      setResults((prev) => ({
        ...prev,
        [name]: {
          status: "ERROR",
          ok: false,
          duration: `${duration}ms`,
          error: error instanceof Error ? error.message : "Error desconocido",
          timestamp: new Date().toISOString(),
        },
      }));
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setResults({});

    // Test 1: Health Check GET
    await testEndpoint("Health GET", "/api/health", "GET");

    // Test 2: Health Check POST
    await testEndpoint("Health POST", "/api/health", "POST");

    // Test 3: Test Simple GET
    await testEndpoint("Test Simple GET", "/api/test-simple", "GET");

    // Test 4: Test Simple POST
    await testEndpoint("Test Simple POST", "/api/test-simple", "POST");

    // Test 5: Chat Simple con pregunta simple
    await testEndpoint("Chat Simple", "/api/chat-simple", "POST", {
      message: "test",
    });

    // Test 6: Chat Simple con pregunta real
    await testEndpoint("Chat Real", "/api/chat-simple", "POST", {
      message: "Â¿CuÃ¡l es tu stack?",
    });
  };

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">ðŸ” DiagnÃ³stico Completo</h1>

      <div className="space-y-4">
        <button
          onClick={runAllTests}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Ejecutando tests..." : "Ejecutar Todos los Tests"}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(results).map(([name, result]) => (
            <div key={name} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">{name}</h3>
              <div className="space-y-2 text-sm">
                <div
                  className={`px-2 py-1 rounded text-xs ${
                    result.ok
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  Status: {result.status} ({result.duration})
                </div>
                <div className="text-xs text-gray-600">{result.timestamp}</div>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(result.data || result.error, null, 2)}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-800 mb-2">ðŸ“‹ Instrucciones</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
          <li>Haz clic en &quot;Ejecutar Todos los Tests&quot;</li>
          <li>Revisa los resultados de cada endpoint</li>
          <li>Si algÃºn test falla, revisa la consola del servidor</li>
          <li>Los tests verdes = funcionando, rojos = error</li>
        </ol>
      </div>
    </main>
  );
}


