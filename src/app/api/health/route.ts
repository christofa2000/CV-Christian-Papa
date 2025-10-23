import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  try {
    console.log("🏥 Health check endpoint");

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      message: "API funcionando correctamente",
    });
  } catch (error) {
    console.error("❌ Error en health check:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error en health check",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

export async function POST(): Promise<NextResponse> {
  try {
    console.log("🏥 Health check POST endpoint");

    return NextResponse.json({
      status: "healthy",
      method: "POST",
      timestamp: new Date().toISOString(),
      message: "POST endpoint funcionando correctamente",
    });
  } catch (error) {
    console.error("❌ Error en health check POST:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error en health check POST",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}



