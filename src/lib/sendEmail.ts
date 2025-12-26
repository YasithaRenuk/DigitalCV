"use server";

import nodemailer from "nodemailer";

type SendEmailParams = {
  to: string;
  username: string;
  password: string;
  processName?: string;
};

export async function sendProcessCompletedEmail({
  to,
  username,
  processName,
  password,
}: SendEmailParams) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const subject = `Process completed${processName ? `: ${processName}` : ""}`;

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <p>Hi <strong>${username}</strong>,</p>
      <p>Your process has been completed successfully.</p>
      ${processName ? `<p><b>Process:</b> ${processName}</p>` : ""}
      <p>youer password is <strong>${password}</strong> </p>
      <p>Regards,<br/>DigitalCV Support</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"DigitalCV Support" <support@digitalcv.lk>`,
    to,
    subject,
    html,
    replyTo: "support@digitalcv.lk",
  });
}
