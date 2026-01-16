const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const message = `
🆕 NUEVO ONBOARDING – SWIPE

👤 DATOS DE CONTACTO
Nombre: ${data.nombreCompleto}
Cargo: ${data.cargo}
Email: ${data.email}
Teléfono: ${data.telefono}

🏢 MARCA
Nombre de la marca: ${data.nombreMarca}
Descripción: ${data.descripcion}
Misión / Visión / Valores:
${data.misionVisionValores}

Diferenciador: ${data.elementoDiferenciador}
Personalidad: ${data.personalidad}
Competidores: ${data.competidores}

🎯 OBJETIVOS
Objetivos: ${data.objetivos?.join(", ")}
Otro objetivo: ${data.otroObjetivo || "N/A"}
Cliente ideal:
${data.clienteIdeal}

Presupuesto Ads: ${data.presupuestoAds}
Material gráfico: ${data.materialGrafico || "N/A"}

🌐 REDES
Redes creadas: ${data.redesCreadas}
Plataformas: ${data.socialMediaPlatforms?.join(", ")}

Instagram: ${data.instagramUser || "N/A"}
Facebook: ${data.facebookEmail || "N/A"}
LinkedIn: ${data.linkedinEmail || "N/A"}

⏰ OPERACIÓN
Horario: ${data.horarioAtencion}
Dirección: ${data.direccion || "N/A"}
WhatsApp clientes: ${data.whatsappClientes || "N/A"}

✅ CIERRE
Contacto aprobación: ${data.contactoAprobacion}
Comentarios:
${data.comentarios || "N/A"}
    `;
console.log("🧪 EMAIL ENV CHECK:", {
  host: !!process.env.EMAIL_HOST,
  user: !!process.env.EMAIL_USER,
  pass: !!process.env.EMAIL_PASS,
});

    await transporter.sendMail({
      from: `"Formulario Swipe" <${process.env.EMAIL_USER}>`,
      to: "a.t.901709753163.u-95276765.fd8ccd51-bc77-490b-8edc-0f0d4c357fe1@tasks.clickup.com",
      subject: `🆕 Nuevo Onboarding – ${data.nombreMarca}`,
      text: message,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("ERROR:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error enviando onboarding" }),
    };
  }
};
