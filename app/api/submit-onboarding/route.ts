import { NextResponse } from "next/server";
import { Resend } from 'resend';

// Inicializamos Resend con la variable de entorno
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY?.trim();
    const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID?.trim();

    if (!CLICKUP_API_KEY || !CLICKUP_LIST_ID) {
      return NextResponse.json({ success: false, error: "Configuración incompleta" }, { status: 500 });
    }

    // 1. Formato para ClickUp (Texto plano con emojis)
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

    // 2. Ejecutar envío a ClickUp
    const clickupResponse = await fetch(
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

    const clickupResult = await clickupResponse.json();

    // 3. Enviar el Correo (Reflejo exacto de ClickUp en HTML)
    try {
      await resend.emails.send({
        from: 'Onboarding <onboarding@resend.dev>',
        to: ['control.swipe@gmail.com'],
        subject: `🚀 Nuevo Onboarding: ${data.nombreMarca}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px; background-color: #ffffff;">
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px; margin-top: 0;">🧾 Onboarding: ${data.nombreMarca?.toUpperCase()}</h2>
            
            <h3 style="background: #f4f4f4; padding: 8px 12px; margin-top: 20px; border-radius: 4px;">👤 Información de Contacto</h3>
            <p style="padding: 0 10px;">
              <b>Nombre:</b> ${data.nombreCompleto}<br>
              <b>Cargo:</b> ${data.cargo}<br>
              <b>Email:</b> ${data.email}<br>
              <b>Teléfono:</b> ${data.telefono}
            </p>

            <h3 style="background: #f4f4f4; padding: 8px 12px; margin-top: 20px; border-radius: 4px;">🚀 Detalles de la Marca</h3>
            <p style="padding: 0 10px;">
              <b>Descripción:</b> ${data.descripcion}<br>
              <b>Misión/Visión/Valores:</b> ${data.misionVisionValores || "N/A"}<br>
              <b>Diferenciador:</b> ${data.elementoDiferenciador}<br>
              <b>Personalidad:</b> ${data.personalidad || "N/A"}<br>
              <b>Competidores:</b> ${data.competidores}
            </p>

            <h3 style="background: #f4f4f4; padding: 8px 12px; margin-top: 20px; border-radius: 4px;">🎯 Objetivos y Cliente</h3>
            <p style="padding: 0 10px;">
              <b>Objetivos:</b> ${data.objetivos?.join(", ") || "No especificados"} ${data.otroObjetivo ? `(${data.otroObjetivo})` : ""}<br>
              <b>Cliente Ideal:</b> ${data.clienteIdeal}<br>
              <b>Presupuesto Ads:</b> ${data.presupuestoAds}
            </p>

            <h3 style="background: #f4f4f4; padding: 8px 12px; margin-top: 20px; border-radius: 4px;">🔐 Accesos y Redes</h3>
            <p style="padding: 0 10px;">
              <b>Plataformas:</b> ${data.socialMediaPlatforms?.join(", ") || "Ninguna"}<br>
              ${data.instagramUser ? `<b>📸 Instagram:</b> User: ${data.instagramUser} / Pass: ${data.instagramPassword}<br>` : ""}
              ${data.facebookEmail ? `<b>🔵 Facebook:</b> Email: ${data.facebookEmail} / Pass: ${data.facebookPassword}<br>` : ""}
              ${data.linkedinEmail ? `<b>💼 LinkedIn:</b> Email: ${data.linkedinEmail} / Pass: ${data.linkedinPassword}<br>` : ""}
            </p>

            <h3 style="background: #f4f4f4; padding: 8px 12px; margin-top: 20px; border-radius: 4px;">📍 Información Operativa</h3>
            <p style="padding: 0 10px;">
              <b>Horario:</b> ${data.horarioAtencion}<br>
              <b>Dirección:</b> ${data.direccion}<br>
              <b>WhatsApp Clientes:</b> ${data.whatsappClientes}<br>
              <b>Contacto Aprobación:</b> ${data.contactoAprobacion}
            </p>

            <div style="margin-top: 25px; padding: 15px; background: #fffdf0; border-left: 5px solid #ffd700; border-radius: 4px;">
              <strong>💬 Comentarios Adicionales:</strong><br>
              ${data.comentarios || "Sin comentarios adicionales."}
            </div>
          </div>
        `,
      });
    } catch (mailError) {
      console.error("Error enviando email:", mailError);
    }

    if (!clickupResponse.ok) {
      return NextResponse.json({ success: false, error: clickupResult.err }, { status: clickupResponse.status });
    }

    return NextResponse.json({ success: true, taskId: clickupResult.id });

  } catch (error) {
    console.error("Error interno:", error);
    return NextResponse.json({ success: false, error: "Error interno" }, { status: 500 });
  }
}