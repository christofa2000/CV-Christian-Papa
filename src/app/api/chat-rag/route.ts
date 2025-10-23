import { getKnowledgeCollection } from "@/lib/chroma";
import { NextRequest, NextResponse } from "next/server";
import { Ollama } from "ollama";

const SYSTEM_PROMPT = `
Sos **ChrisBot**, el asistente de Christian Oscar Papa.
- RespondÃ© SIEMPRE en castellano, tono profesional y cercano.
- No muestres "Fuentes" ni IDs internos.
- SÃ© conciso. UsÃ¡ el contexto sÃ³lo si es relevante.
`;

interface ChatPayload {
  message: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { message } = (await req.json()) as ChatPayload;
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Falta 'message'." }, { status: 400 });
    }

    console.log("ðŸ” Consultando ChromaDB...");
    const collection = await getKnowledgeCollection();
    const results = await collection.query({
      nResults: 5,
      queryTexts: [message],
    });

    const docs = results.documents?.[0] ?? [];
    const bullets = docs.map((d) => `- ${d}`).join("\n");
    const context =
      bullets.trim().length > 0
        ? `Contexto relevante:\n${bullets}\n\nResponde usando solo lo necesario del contexto.`
        : `No hay contexto relevante. RespondÃ© solo con tu conocimiento base.`;

    console.log("ðŸ¤– Consultando Ollama...");
    const ollama = new Ollama();
    const chat = await ollama.chat({
      model: "llama3.1:8b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Pregunta: ${message}\n\n${context}` },
      ],
      options: {
        temperature: 0.4,
        num_ctx: 8192,
      },
    });

    const answer = chat.message?.content ?? "No pude generar una respuesta.";
    console.log("âœ… Respuesta generada exitosamente");
    return NextResponse.json({ answer });
  } catch (error) {
    console.error("âŒ Error en API chat-rag:", error);
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}
