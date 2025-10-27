import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  query: string;
  context: string;
  history?: ChatMessage[];
}

export async function POST(request: NextRequest) {
  try {
    // Verificar que la API key esté configurada
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Groq API key no configurada. Por favor, configura GROQ_API_KEY en .env.local",
        },
        { status: 500 }
      );
    }

    const body: ChatRequest = await request.json();
    const { query, context, history = [] } = body;

    // Validar entrada
    if (!query || !context) {
      return NextResponse.json(
        { error: "query y context son requeridos" },
        { status: 400 }
      );
    }

    // Construir mensajes para Groq
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `Eres ChrisBot, el asistente del CV de Christian Oscar Papa.

Contexto sobre Christian: ${context}

Instrucciones:
- Responde de forma profesional, concisa y amigable en español
- Usa SOLO la información del contexto proporcionado
- Si no tienes información en el contexto, dilo claramente
- No inventes información que no esté en el contexto
- Mantén las respuestas breves (1-3 párrafos máximo)
- Responde como Christian hablando de sí mismo`,
      },
      ...history,
      {
        role: "user",
        content: query,
      },
    ];

    // Llamar a Groq
    const completion = await groq.chat.completions.create({
      messages: messages as ChatCompletionMessageParam[],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 512,
      stream: false,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json(
        { error: "No se recibió respuesta de Groq" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      response: response.trim(),
    });
  } catch (error) {
    console.error("Error en API de chat:", error);

    // Manejo de errores específicos
    if (error instanceof Error) {
      if (error.message.includes("rate limit")) {
        return NextResponse.json(
          {
            error:
              "Límite de velocidad alcanzado. Por favor, espera unos momentos e inténtalo de nuevo.",
          },
          { status: 429 }
        );
      }

      if (error.message.includes("API key")) {
        return NextResponse.json(
          {
            error: "Error de autenticación con Groq. Verifica tu API key.",
          },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: "Error al generar respuesta de IA" },
      { status: 500 }
    );
  }
}
