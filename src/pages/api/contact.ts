import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL, // Укажи свою почту
        pass: process.env.SMTP_PASSWORD, // И пароль от почты
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.SMTP_EMAIL,
      subject: `New message from ${name}`,
      text: message,
      html: `<p><strong>from:</strong> ${name} (${email})</p><p>${message}</p>`,
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending message" });
  }
  
}
