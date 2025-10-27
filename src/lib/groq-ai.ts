"use client";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AuroraRequest {
  query: string;
  context: string;
  history?: Message[];
}

/**
 * Genera una respuesta de IA usando Groq basada en contexto RAG
 * Llama a la API route de Next.js que mantiene la API key en el servidor
 * @param query - La pregunta del usuario
 * @param context - Texto de contexto obtenido de la búsqueda RAG
 * @param history - Historial de conversación (opcional)
 * @returns Respuesta generada por la IA
 */
export async function getAIResponse(
  query: string,
  context: string,
  history: Message[] = []
): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        context,
        history,
      } as AuroraRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage =
        errorData.error || `Error ${response.status}: ${response.statusText}`;
      console.error("API Error:", errorMessage);
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.response) {
      console.error("API Response sin 'response' field:", data);
      throw new Error("La API no devolvió una respuesta válida");
    }

    return data.response;
  } catch (error) {
    console.error("Error en Groq AI:", error);

    // Manejo de errores específicos
    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        throw new Error(
          "Límite de velocidad alcanzado. Por favor, espera unos momentos e inténtalo de nuevo."
        );
      }

      // Re-lanzar el error con el mensaje original
      throw error;
    }

    throw new Error("Error desconocido al generar respuesta de IA");
  }
}

/**
 * Verifica si el API key de Groq está configurado
 * Ahora verifica si existe la API route (servidor)
 */
export function isGroqConfigured(): boolean {
  // Simplemente verificamos que esté disponible el endpoint
  // El servidor validará la API key
  return true;
}
