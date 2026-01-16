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

    // 1. Formato para ClickUp (Texto enriquecido con emojis)
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

    // 3. Enviar el Correo (Formato HTML Profesional)
    try {
      await resend.emails.send({
        from: 'Onboarding <onboarding@resend.dev>',
        to: ['control.swipe@gmail.com'],
        subject: `🚀 Nuevo Onboarding: ${data.nombreMarca}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px;">🧾 Nuevo Onboarding Recibido</h2>
            <p style="font-size: 16px;">Se ha registrado una nueva entrada para la marca: <strong>${data.nombreMarca}</strong></p>
            
            <h3 style="background: #f4f4f4; padding: 5px 10px;">👤 Contacto</h3>
            <p><strong>Nombre:</strong> ${data.nombreCompleto}<br>
               <strong>Email:</strong> ${data.email}<br>
               <strong>Teléfono:</strong> ${data.telefono}</p>

            <h3 style="background: #f4f4f4; padding: 5px 10px;">🚀 Marca y Estrategia</h3>
            <p><strong>Descripción:</strong> ${data.descripcion}<br>
               <strong>Diferenciador:</strong> ${data.elementoDiferenciador}<br>
               <strong>Objetivos:</strong> ${data.objetivos?.join(", ") || "No definidos"}</p>

            <h3 style="background: #f4f4f4; padding: 5px 10px;">🔐 Accesos</h3>
            <p>${data.instagramUser ? `📸 <strong>Instagram:</strong> ${data.instagramUser} / ${data.instagramPassword}<br>` : ""}
               ${data.facebookEmail ? `🔵 <strong>Facebook:</strong> ${data.facebookEmail} / ${data.facebookPassword}<br>` : ""}</p>

            <div style="margin-top: 20px; padding: 10px; border-left: 4px solid #333; font-style: italic;">
              <strong>Comentarios:</strong> ${data.comentarios || "Sin comentarios."}
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