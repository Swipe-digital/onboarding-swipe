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

    const mailOptions = {
      from: `"Onboarding Swipe" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: "🧾 Nuevo formulario de onboarding",
      text: JSON.stringify(data, null, 2),
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Error enviando email:", error);
    return NextResponse.json(
      { success: false, error: "Error enviando formulario" },
      { status: 500 }
    );
  }
}
