import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("📩 Nueva info recibida (ClickUp):", data);

    const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;
    const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;

    if (!CLICKUP_API_KEY || !CLICKUP_LIST_ID) {
      console.error("❌ Error: Variables de entorno no configuradas");
      throw new Error("Configuración de ClickUp incompleta");
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
          name: `🧾 Onboarding - ${data.nombreMarca}`,
          description: "```json\n" + JSON.stringify(data, null, 2) + "\n```",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error ClickUp:", errorText);
      throw new Error(`Error creando tarea en ClickUp: ${response.status}`);
    }

    const clickupResponse = await response.json();
    console.log("✅ Tarea creada en ClickUp:", clickupResponse.id);

    return NextResponse.json({ success: true, taskId: clickupResponse.id });
  } catch (error) {
    console.error("❌ Error general:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Error enviando a ClickUp" 
      },
      { status: 500 }
    );
  }
}
