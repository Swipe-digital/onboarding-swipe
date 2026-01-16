import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("📩 Nueva info recibida (ClickUp):", data);

    // Limpiamos los valores para evitar espacios en blanco accidentales
    const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY?.trim();
    const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID?.trim();

    if (!CLICKUP_API_KEY || !CLICKUP_LIST_ID) {
      console.error("❌ Error: Variables de entorno no configuradas en Vercel");
      return NextResponse.json(
        { success: false, error: "Configuración de ClickUp incompleta en el servidor" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
      {
        method: "POST",
        headers: {
          "Authorization": CLICKUP_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `🧾 Onboarding - ${data.nombreMarca || "Nueva Marca"}`,
          // La descripción incluye un bloque de código JSON para que sea legible en ClickUp
          description: "Datos recibidos del formulario:\n\n```json\n" + JSON.stringify(data, null, 2) + "\n```",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error detallado de ClickUp:", errorText);
      return NextResponse.json(
        { success: false, error: `ClickUp respondió con error ${response.status}: ${errorText}` },
        { status: response.status }
      );
    }

    const clickupResponse = await response.json();
    console.log("✅ Tarea creada exitosamente en ClickUp ID:", clickupResponse.id);

    return NextResponse.json({ 
      success: true, 
      taskId: clickupResponse.id 
    });

  } catch (error) {
    console.error("❌ Error crítico en la ruta API:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Error interno del servidor" 
      },
      { status: 500 }
    );
  }
}