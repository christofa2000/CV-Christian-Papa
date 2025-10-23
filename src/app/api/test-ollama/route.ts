import { NextResponse } from "next/server";
import { Ollama } from "ollama";

export async function GET(): Promise<NextResponse> {
  try {
    console.log("🤖 Probando conexión a Ollama...");
    const ollama = new Ollama();

    // Verificar si el modelo está disponible
    const models = await ollama.list();
    console.log(
      "📋 Modelos disponibles:",
      models.models?.map((m) => m.name) || []
    );

    const hasLlama =
      models.models?.some((m) => m.name.includes("llama3.1:8b")) || false;
    const hasEmbed =
      models.models?.some((m) => m.name.includes("nomic-embed-text")) || false;

    if (!hasLlama || !hasEmbed) {
      return NextResponse.json({
        status: "warning",
        message: "Modelos no encontrados",
        details: {
          llama3_1_8b: hasLlama,
          nomic_embed_text: hasEmbed,
          availableModels: models.models?.map((m) => m.name) || [],
        },
      });
    }

    // Probar una consulta simple
    const chat = await ollama.chat({
      model: "llama3.1:8b",
      messages: [
        { role: "user", content: "Hola, responde solo 'OK' en español" },
      ],
      options: {
        temperature: 0.1,
        num_ctx: 1000,
      },
    });

    console.log("✅ Consulta a Ollama exitosa");
    return NextResponse.json({
      status: "success",
      message: "Ollama conectado correctamente",
      response: chat.message?.content || "Sin respuesta",
      availableModels: models.models?.map((m) => m.name) || [],
    });
  } catch (error) {
    console.error("❌ Error conectando a Ollama:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error conectando a Ollama",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}





