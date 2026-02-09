import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { sendTransactionalEmail } from "./emailService.js";

import fs from "fs"; // 1. Importar el módulo 'fs' para leer archivos
import path from "path"; // 2. Importar 'path' para manejar rutas de archivos

const LOGO = "https://jelp.cl/logos/ci-logo.png";
const FROM = "creceideas ltda";
const sampleProps = {
  receipt: {
    header: {
      from: FROM,
      logo: LOGO,
      backgroundColor: "null",
      email: "boris@creceideas.cl",
      razonSocial: "Empresa de Clientes ltda",
      contacto: "boris cabezas",

      fechaFacturacion: "2023-01-01",
      tipoDocumento: "Factura",
      numeroFactura: "35578",
      moneda: "CLP",
      pago: {
        metodo: "Transferencia",
        cuenta: "1234567890",
        tipoCuenta: "Corriente",
        banco: "XYZ Bank",
        email: "transferencias@creceideas.cl",
      },
    },
    recipient: {
      name: "Boris Cabezas",
      email: "bcabezasr@gmail.com",
      asunto: "Tu Recibo de Compra",
    },
    observation:
      "Observaciones del cliente, que se añaden al envío automatizado",
    items: [
      {
        name: "Producto 1",
        description: "Descripción breve del producto 1",
        price: "$190.990",
        img: "https://creceideas.cl/logo.png",
      },
      {
        name: "Servicio 1",
        description: "Descripción breve del servicio 1",
        price: "$29.990",
      },
    ],
    totals: {
      subtotal: "49.980",
      tax: "4.990",
      total: "54.970",
    },
    attachment: {
      url: "./FRONTEND/email/cotizacion.pdf",
    },
  },
  alert: {
    header: {
      from: FROM,
      logo: LOGO,
      backgroundColor: "null",
    },
    title: "Alerta de Seguridad",
    message:
      "Hemos detectado un inicio de sesión desde un dispositivo no reconocido. Si no has sido tú, por favor, asegura tu cuenta.",
  },
  otp: {
    header: {
      from: FROM,
      logo: LOGO,
      backgroundColor: "null",
    },
    otpCode: "123456",
  },
  notification: {
    header: {
      from: FROM,
      logo: LOGO,
      backgroundColor: "null",
    },
    title: "Error del Sistema",
    message:
      "Te informamos que realizaremos una actualización programada el próximo sábado.",
    notificationType: "error", // Puede ser 'info', 'alerta', o 'error'
  },
  receiptAlreadyPaid: {
    header: {
      from: FROM,
      logo: LOGO,
      backgroundColor: "null",
    },
    userName: "Jane Doe",
    receiptNumber: "2024-08-CD",
    paymentDate: "20 de Julio, 2024",
    amount: "$75.000",
    paymentMethod: "Tarjeta de Crédito",
  },
};

const data = {
  header: {
    from: "creceideas ltda",
    logo: "https://jelp.cl/logos/ci-logo.png",
    backgroundColor: "null",
    email: "boris@creceideas.cl",

    razonSocial: "MACA Servicios",
    contacto: "Beatriz",
    fechaFacturacion: "2026-01-31",
    tipoDocumento: "Factura",
    numeroFactura: "574",
    moneda: "CLP",
    pago: {
      metodo: "Transferencia",
      cuenta: "61085511",
      tipoCuenta: "Cuenta Corriente",
      banco: "Banco BCI",
      email: "hola@creceideas.cl",
    },
  },
  recipient: {
    name: "MACA Servicios",
    email: "bcabezasr@gmail.com",
    asunto: "Documento Tributario - MACA",
  },
  observation: "***posee facturas pendientes",
  items: [
    {
      name: "SERVICIOS INFORMATICOS",
      description: "Servicio mensual de asesoría informática y soporte técnico",
      price: "317.649",
      img: "https://jelp.cl/logos/jelp-logo.png",
    },
    {
      name: "REPUESTOS Y PIEZAS PARA PC",
      description: "Ventilador de procesador intel + pasta dicipadora",
      price: "24.990",
    },
    {
      name: "RENOVACION DOMINIO ANUAL",
      description: "Renovación de dominio anual macaservicios.cl",
      price: "9.990",
      img: "https://jelp.cl/logos/ci-logo.png",
    },
  ],
  totals: {
    subtotal: "352.629",
    tax: "67.000",
    total: "419.629",
  },
  attachment: {
    url: "./uploads/2026-01/2026-01_maca.pdf",
  },
};

// --- Prueba para el correo de Recibo (Receipt) ---
const testSendReceiptEmail = async (data) => {
  console.log("Enviando correo de prueba de recibo...");

  // lectura de archivo pdf
  const pdfPath = path.join(process.cwd(), data.attachment.url);
  const pdfBuffer = fs.readFileSync(pdfPath);

  try {
    await sendTransactionalEmail({
      to: data.recipient.email,
      subject: data.recipient.asunto,
      templateName: "receipt",
      props: data,
      attachments: [
        {
          filename:
            data.header.tipoDocumento.toLocaleLowerCase() +
            "-" +
            data.header.numeroFactura +
            ".pdf", // Nombre que verá el destinatario
          content: pdfBuffer,
        },
      ],
    });
    console.log("Prueba de correo de recibo enviada con éxito.");
  } catch (error) {
    console.error("Falló la prueba de correo de recibo:", error.message);
  }
};

// --- Prueba para el correo de Alerta (Alert) ---
const testSendAlertEmail = async () => {
  console.log("Enviando correo de prueba de alerta...");
  try {
    await sendTransactionalEmail({
      to: "bcabezasr@gmail.com", // Cambia esto a tu correo para la prueba
      subject: "⚠️ Alerta de Seguridad",
      templateName: "alert",
      props: sampleProps.alert,
    });
    console.log("Prueba de correo de alerta enviada con éxito.");
  } catch (error) {
    console.error("Falló la prueba de correo de alerta:", error.message);
  }
};

// --- Prueba para el correo de OTP ---
const testSendOtpEmail = async () => {
  console.log("Enviando correo de prueba de OTP...");
  try {
    await sendTransactionalEmail({
      to: "bcabezasr@gmail.com", // Cambia esto a tu correo para la prueba
      subject: "Tu código de verificación",
      templateName: "otp",
      props: sampleProps.otp,
    });
    console.log("Prueba de correo de OTP enviada con éxito.");
  } catch (error) {
    console.error("Falló la prueba de correo de OTP:", error.message);
  }
};

// --- Prueba para el correo de Notificación ---
const testSendNotificationEmail = async () => {
  console.log("Enviando correo de prueba de notificación...");
  try {
    // Puedes cambiar 'notificationType' a 'alerta' o 'error' para probar los otros diseños
    await sendTransactionalEmail({
      to: "bcabezasr@gmail.com", // Cambia esto a tu correo para la prueba
      subject: "Tienes una nueva notificación",
      templateName: "notification",
      props: sampleProps.notification,
    });
    console.log("Prueba de correo de notificación enviada con éxito.");
  } catch (error) {
    console.error("Falló la prueba de correo de notificación:", error.message);
  }
};

// --- Prueba para el correo de Recibo ya Pagado ---
const testSendReceiptAlreadyPaidEmail = async () => {
  console.log("Enviando correo de prueba de recibo ya pagado...");
  try {
    await sendTransactionalEmail({
      to: "bcabezasr@gmail.com", // Cambia esto a tu correo para la prueba
      subject: "Confirmación de Pago Recibido",
      templateName: "receiptAlreadyPaid",
      props: sampleProps.receiptAlreadyPaid,
    });
    console.log("Prueba de correo de recibo ya pagado enviada con éxito.");
  } catch (error) {
    console.error(
      "Falló la prueba de correo de recibo ya pagado:",
      error.message,
    );
  }
};

// --- Ejecutar Pruebas ---
(async () => {
  await testSendReceiptEmail(data);
  //await testSendAlertEmail(); // está imprimiendo la cabecera entre el cuerpo y el pie el email recepcionado
  //await testSendOtpEmail();
  //await testSendNotificationEmail();
  //await testSendReceiptAlreadyPaidEmail();
})();
