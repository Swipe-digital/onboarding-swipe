import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Leemos las variables de forma segura desde el entorno
    const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY?.trim();
    const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID?.trim();

    if (!CLICKUP_API_KEY || !CLICKUP_LIST_ID) {
      console.error("❌ Error: Variables de entorno no configuradas en Vercel");
      return NextResponse.json(
        { success: false, error: "Configuración incompleta en el servidor" },
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
          description: "Datos del formulario:\n\n```json\n" + JSON.stringify(data, null, 2) + "\n```",
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ ClickUp Error:", result);
      return NextResponse.json(
        { success: false, error: result.err || "Error en ClickUp" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, taskId: result.id });

  } catch (error) {
    console.error("❌ Error crítico:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}