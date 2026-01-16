import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // 1. Limpieza y Debugging
    const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY?.trim();
    const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID?.trim();

    console.log("DEBUG - Key presente:", !!CLICKUP_API_KEY);
    console.log("DEBUG - List ID:", CLICKUP_LIST_ID);

    if (!CLICKUP_API_KEY || !CLICKUP_LIST_ID) {
      return NextResponse.json(
        { success: false, error: "Faltan variables de entorno en Vercel" },
        { status: 500 }
      );
    }

    // 2. Llamada a ClickUp
    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
      {
        method: "POST",
        headers: {
          "Authorization": CLICKUP_API_KEY, // Ya probamos que 'pk_...' funciona así en curl
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `🧾 Onboarding - ${data.nombreMarca || "Sin Nombre"}`,
          description: "```json\n" + JSON.stringify(data, null, 2) + "\n```",
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
    console.error("❌ Error Crítico:", error);
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}