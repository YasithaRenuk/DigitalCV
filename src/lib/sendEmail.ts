"use server";

import nodemailer from "nodemailer";

type SendEmailParams = {
  to: string;
  username: string;
  password: string;
};

export async function sendProcessCompletedEmail({
  to,
  username,
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

  const subject = "";

  const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>DigitalCV - CV Ready</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 15px;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="padding:25px; background:#0f172a;">
                <img 
                  src="https://your-domain.com/DigitalCVlogoThatICrop.png"
                  alt="DigitalCV Logo"
                  style="max-width:160px;"
                />
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px; font-family:Arial, sans-serif; color:#333;">
                <h2 style="margin-top:0; color:#0f172a;">
                  Your DigitalCV is Ready 🎉
                </h2>

                <p>Hi <strong>${username}</strong>,</p>

                <p>
                  Thank you for completing your payment. Your <strong>DigitalCV</strong> has been successfully created and securely stored in our system.
                </p>

                <p>
                  You can now access your DigitalCV using the credentials below:
                </p>

                <table cellpadding="10" cellspacing="0" style="background:#f1f5f9; border-radius:6px; margin:15px 0;">
                  <tr>
                    <td style="font-weight:bold;">Username</td>
                    <td>${username}</td>
                  </tr>
                  <tr>
                    <td style="font-weight:bold;">Password</td>
                    <td>${password}</td>
                  </tr>
                </table>

                <p>
                  For security reasons, we strongly recommend changing your password after your first login.
                </p>

                <p>
                  If you have any questions or need support, feel free to reply to this email.
                </p>

                <p style="margin-top:30px;">
                  Best regards,<br/>
                  <strong>DigitalCV Support Team</strong>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="padding:15px; background:#f8fafc; font-family:Arial, sans-serif; font-size:12px; color:#64748b;">
                © ${new Date().getFullYear()} DigitalCV. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  await transporter.sendMail({
    from: `"DigitalCV Support" <support@digitalcv.lk>`,
    to,
    subject,
    html,
    replyTo: "support@digitalcv.lk",
  });
}
