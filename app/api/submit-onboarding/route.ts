import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${process.env.CLICKUP_LIST_ID}/task`,
      {
        method: "POST",
        headers: {
          "Authorization": process.env.CLICKUP_TOKEN!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `Onboarding – ${data.nombreMarca}`,
          description: `
📌 **DATOS DE CONTACTO**
Nombre: ${data.nombreCompleto}
Cargo: ${data.cargo}
Email: ${data.email}
Teléfono: ${data.telefono}

🏷 **MARCA**
Nombre: ${data.nombreMarca}
Descripción: ${data.descripcion}
Diferenciador: ${data.elementoDiferenciador}
Personalidad: ${data.personalidad}

🎯 **OBJETIVOS**
${data.objetivos?.join(", ")}
Otro objetivo: ${data.otroObjetivo}

👤 **CLIENTE IDEAL**
${data.clienteIdeal}

💰 **PRESUPUESTO ADS**
${data.presupuestoAds}

📱 **REDES**
Instagram: ${data.instagramUser}
Facebook: ${data.facebookEmail}
LinkedIn: ${data.linkedinEmail}

⏰ **OPERATIVO**
Horario: ${data.horarioAtencion}
Dirección: ${data.direccion}
WhatsApp: ${data.whatsappClientes}
Contacto aprobación: ${data.contactoAprobacion}

📝 **COMENTARIOS**
${data.comentarios}
          `,
          priority: 3,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("❌ ClickUp error:", error);
      throw new Error("Error creando tarea en ClickUp");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { success: false, error: "Error enviando a ClickUp" },
      { status: 500 }
    );
  }
}
