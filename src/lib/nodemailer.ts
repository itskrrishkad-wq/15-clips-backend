import nodemailer from "nodemailer";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: process.env.NODE_ENV === "production",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mail = await transporter.sendMail({
      from: options.from || `${process.env.SMTP_USER}`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    console.log("Email sent:", mail.messageId);
    return { success: true, id: mail.messageId };
  } catch (err) {
    console.error("Email sending failed:", err);
    return { success: false, error: err };
  }
}










export const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: process.env.NODE_ENV === "production",
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASS, // your password / app password / API key
  },
});
