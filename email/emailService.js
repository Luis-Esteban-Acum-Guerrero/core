import { Resend } from "resend";

import { createReceiptEmail } from "./templates/ReceiptEmail.js";
import { createOtpEmail } from "./templates/OtpEmail.js";
import { createNotificationEmail } from "./templates/NotificationEmail.js";
import { createReceiptAlreadyPaidEmail } from "./templates/ReceiptAlreadyPaidEmail.js";
import { createAlertEmail } from "./templates/AlertEmail.js";

let resend;

const emailTemplates = {
  receipt: createReceiptEmail,
  otp: createOtpEmail,
  notification: createNotificationEmail,
  receiptAlreadyPaid: createReceiptAlreadyPaidEmail,
  alert: createAlertEmail,
};

export const sendTransactionalEmail = async ({
  to,
  subject,
  templateName,
  props,
  attachments,
}) => {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      console.error(
        "❌ RESEND_API_KEY no está definido en las variables de entorno."
      );
    } else {
      console.log(
        `✅ RESEND_API_KEY cargada (${process.env.RESEND_API_KEY.slice(0, 5)}...)`
      );
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  const createEmailHtml = emailTemplates[templateName];
  if (!createEmailHtml) {
    throw new Error(
      `La plantilla de correo electrónico '${templateName}' no existe.`
    );
  }

  const html = createEmailHtml(props);

  try {
    const recipients = Array.isArray(to) ? to : [to];
    // console.log("Enviando correo a:", recipients);

    const { data, error } = await resend.emails.send({
      from: "Servicio de notificaciones JELP! <no-responder@jelp.cl>",
      to: recipients,
      subject: subject,
      html: html,
      attachments: attachments,
    });

    if (error) {
      console.error("Error al enviar el correo electrónico:", error);
      throw new Error("Error al enviar el correo electrónico.");
    }

    console.log("Correo electrónico enviado con éxito:", data);
    return data;
  } catch (error) {
    console.error("Error en sendTransactionalEmail:", error);
    throw error;
  }
};
