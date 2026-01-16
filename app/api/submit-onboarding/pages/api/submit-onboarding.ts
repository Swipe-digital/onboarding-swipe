import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body;

    console.log("📩 Nueva info recibida (ClickUp):", data);

    const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;
    const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;

    if (!CLICKUP_API_KEY || !CLICKUP_LIST_ID) {
      throw new Error("Faltan variables de entorno de ClickUp");
    }

    const response = await fetch(
      `https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`,
      {
        method: "POST",
        headers: {
          Authorization: CLICKUP_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `🧾 Onboarding - ${data.nombreMarca || "Sin nombre"}`,
          description:
            "```json\n" + JSON.stringify(data, null, 2) + "\n```",
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Error ClickUp:", errorText);
      return res.status(500).json({ error: "Error creando tarea en ClickUp" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error general:", error);
    return res.status(500).json({ error: "Error enviando a ClickUp" });
  }
}

