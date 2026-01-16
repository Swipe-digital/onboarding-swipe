import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY?.trim();
    const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID?.trim();

    if (!CLICKUP_API_KEY || !CLICKUP_LIST_ID) {
      return NextResponse.json({ success: false, error: "Configuración incompleta" }, { status: 500 });
    }

    // Formato limpio con Emojis y sin símbolos de Markdown
    const formattedDescription = `
📝 NUEVO ONBOARDING: ${data.nombreMarca?.toUpperCase()}

👤 INFORMACIÓN DE CONTACTO
Nombre: ${data.nombreCompleto}
Cargo: ${data.cargo}
Email: ${data.email}
Teléfono: ${data.telefono}

🚀 DETALLES DE LA MARCA
Descripción: ${data.descripcion}
Misión, Visión y Valores: ${data.misionVisionValores}
Diferenciador: ${data.elementoDiferenciador}
Personalidad: ${data.personalidad}
Competidores: ${data.competidores}

🎯 OBJETIVOS Y CLIENTE
Objetivos: ${data.objetivos?.join(", ") || "No especificados"} ${data.otroObjetivo ? `(${data.otroObjetivo})` : ""}
Cliente Ideal: ${data.clienteIdeal}
Presupuesto Ads: ${data.presupuestoAds}

🔐 ACCESOS Y REDES SOCIALES
Redes creadas: ${data.redesCreadas}
Plataformas: ${data.socialMediaPlatforms?.join(", ") || "Ninguna"}
${data.instagramUser ? `📸 Instagram: User: ${data.instagramUser} / Pass: ${data.instagramPassword}` : ""}
${data.facebookEmail ? `🔵 Facebook: Email: ${data.facebookEmail} / Pass: ${data.facebookPassword}` : ""}
${data.linkedinEmail ? `💼 LinkedIn: Email: ${data.linkedinEmail} / Pass: ${data.linkedinPassword}` : ""}

📍 INFORMACIÓN OPERATIVA
Horario: ${data.horarioAtencion}
Dirección: ${data.direccion}
WhatsApp Clientes: ${data.whatsappClientes}
Contacto Aprobación: ${data.contactoAprobacion}

💬 COMENTARIOS ADICIONALES
${data.comentarios || "Sin comentarios adicionales"}
    `.trim();

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
          description: formattedDescription,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: result.err }, { status: response.status });
    }

    return NextResponse.json({ success: true, taskId: result.id });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}