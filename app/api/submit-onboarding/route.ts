import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // 1. Inyectamos el Token directamente para saltar errores de Vercel
    const CLICKUP_API_KEY = "pk_95276765_BUA3MJU1U5861NMGCPKK2UZR8PTZ0ZL7"; 
    const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID?.trim() || "9017676681";

    console.log("🚀 Intentando enviar a ClickUp con Token Directo...");
    console.log("📍 List ID utilizado:", CLICKUP_LIST_ID);

    if (!CLICKUP_API_KEY || !CLICKUP_LIST_ID) {
      return NextResponse.json(
        { success: false, error: "Configuración incompleta" },
        { status: 500 }
      );
    }

    // 2. Llamada a ClickUp
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
      {
        method: "POST",
        headers: {
          "Authorization": CLICKUP_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `🧾 Onboarding - ${data.nombreMarca || "Sin Nombre"}`,
          description: "Datos del formulario:\n\n```json\n" + JSON.stringify(data, null, 2) + "\n```",
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ ClickUp Error detallado:", result);
      return NextResponse.json(
        { success: false, error: result.err || "Error en ClickUp", status: response.status },
        { status: response.status }
      );
    }

    console.log("✅ Tarea creada con éxito ID:", result.id);
    return NextResponse.json({ success: true, taskId: result.id });

  } catch (error) {
    console.error("❌ Error Crítico en el Servidor:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Error interno" 
    }, { status: 500 });
  }
}