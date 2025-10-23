import { getKnowledgeCollection } from "@/lib/chroma";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    console.log("🔍 Probando conexión a ChromaDB...");
    const collection = await getKnowledgeCollection();
    console.log("✅ Conexión a ChromaDB exitosa");

    // Intentar una consulta simple
    const results = await collection.query({
      nResults: 1,
      queryTexts: ["test"],
    });

    console.log("✅ Consulta a ChromaDB exitosa");
    return NextResponse.json({
      status: "success",
      message: "ChromaDB conectado correctamente",
      collectionName: collection.name,
      resultsCount: results.documents?.[0]?.length || 0,
    });
  } catch (error) {
    console.error("❌ Error conectando a ChromaDB:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error conectando a ChromaDB",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}





