import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("📩 Nueva información recibida:", data);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Onboarding Swipe" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL || process.env.EMAIL_USER,
      subject: "🧾 Nuevo formulario de onboarding",
      html: `
        <h2>Nuevo onboarding recibido</h2>
        <pre style="font-family: monospace; background:#f4f4f4; padding:16px; border-radius:8px;">
${JSON.stringify(data, null, 2)}
        </pre>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    return NextResponse.json(
      { success: false, error: "Error enviando formulario" },
      { status: 500 }
    );
  }
}
