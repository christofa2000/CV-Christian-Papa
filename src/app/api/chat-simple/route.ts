import {
  hybridSearch,
  MIN_SEMANTIC_SCORE,
  type HybridHit,
} from "@/lib/server/rag-search";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

interface ChatPayload {
  message: string;
}

function buildPrompt(query: string, docs: HybridHit[]): string {
  const context = docs.map((doc) => `- [${doc.kid}] ${doc.text}`).join("\n");
  return `Eres ChrisBot. Responde en castellano, con precisi\u00f3n y brevedad.
Usa solo el contexto. Si la informaci\u00f3n no aparece all\u00ed, di que no est\u00e1 y suger\u00ed reformular.
Contexto:
${context}

Pregunta: ${query}
Respuesta:`;
}

async function askLLM(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return "No tengo acceso a un modelo configurado ahora mismo. Revisa los datos mostrados o reformula la pregunta.";
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_CHAT_MODEL ?? "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Eres ChrisBot: profesional, emp\u00e1tico y aut\u00e9ntico.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Fallo al consultar OpenAI (${response.status}): ${details}`
    );
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = (await req.json()) as ChatPayload;
    const message = body?.message?.trim();

    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Falta 'message' v\u00e1lido." },
        { status: 400 }
      );
    }

    const { hits, hasStrongEvidence } = await hybridSearch(message, 6, 0.65);

    if (!hasStrongEvidence || hits.length === 0) {
      return NextResponse.json(
        {
          ok: true,
          answer:
            "No encontr\u00e9 informaci\u00f3n suficiente en mi base. Proba reformular o pedime otro detalle.",
          hits,
          threshold: MIN_SEMANTIC_SCORE,
        },
        { status: 200 }
      );
    }

    const prompt = buildPrompt(message, hits);
    const answer = await askLLM(prompt);

    return NextResponse.json(
      {
        ok: true,
        answer: answer.trim(),
        hits,
        threshold: MIN_SEMANTIC_SCORE,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("chat-simple error:", error);
    const message =
      error instanceof Error ? error.message : "Error interno del servidor";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
