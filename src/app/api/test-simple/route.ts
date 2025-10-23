import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  try {
    console.log("🧪 Probando API simple...");

    return NextResponse.json({
      status: "success",
      message: "API simple funcionando correctamente",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error en API test-simple:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error en API test-simple",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}

export async function POST(): Promise<NextResponse> {
  try {
    console.log("🧪 Probando POST en API simple...");

    return NextResponse.json({
      status: "success",
      message: "POST en API simple funcionando correctamente",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error en POST API test-simple:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Error en POST API test-simple",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}



