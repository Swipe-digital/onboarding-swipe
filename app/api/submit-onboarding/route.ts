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

    // 1. Preparamos la descripción para ClickUp (con emojis)
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

    // 2. Ejecutamos el envío a ClickUp
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

    // 3. Enviamos el correo (Formato JSON igual a tu captura de pantalla)
    // Se ejecuta independientemente de si ClickUp falló o no
    try {
      await resend.emails.send({
        from: 'Onboarding <onboarding@resend.dev>',
        to: ['control.swipe@gmail.com'],
        subject: `Nuevo formulario de onboarding: ${data.nombreMarca}`,
        text: JSON.stringify(data, null, 2), // El formato exacto de tu captura
      });
    } catch (mailError) {
      console.error("Error enviando email:", mailError);
      // No bloqueamos la respuesta si solo falla el correo
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