import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import fs from "fs";
import path from "path";
import { sendTransactionalEmail } from "./emailService.js";

// Load the database
const DB_PATH = "./email/DB_2026-01.json";

const sendAllEmails = async () => {
  console.log("🚀 Iniciando envío masivo de correos...");

  try {
    const rawData = fs.readFileSync(
      path.resolve(process.cwd(), DB_PATH),
      "utf-8",
    );
    const clients = JSON.parse(rawData);

    console.log(`📂 Se encontraron ${clients.length} registros para procesar.`);

    for (const [index, client] of clients.entries()) {
      console.log(`\n--------------------------------------------------`);
      console.log(
        `Processing ${index + 1}/${clients.length}: ${client.recipient.name}`,
      );

      // Validar si existe el archivo adjunto
      const pdfRelativePath = client.attachment.url;
      const pdfPath = path.resolve(process.cwd(), pdfRelativePath);

      if (!fs.existsSync(pdfPath)) {
        console.error(`❌ Error: No se encontró el archivo PDF en: ${pdfPath}`);
        console.error(`   Saltando este envío...`);
        continue;
      }

      const pdfBuffer = fs.readFileSync(pdfPath);

      try {
        await sendTransactionalEmail({
          to: client.recipient.email, // Ya está normalizado como array en el JSON corregido
          subject: client.recipient.asunto,
          templateName: "receipt", // Usamos el template 'receipt' para facturas/boletas
          props: client, // Pasamos el objeto cliente completo como props
          attachments: [
            {
              filename: `${client.header.tipoDocumento} ${client.header.numeroFactura}.pdf`,
              content: pdfBuffer,
            },
          ],
        });
        console.log(
          `✅ Correo enviado a: ${client.recipient.name} (${client.recipient.email.join(", ")})`,
        );
      } catch (emailError) {
        console.error(
          `❌ Falló el envío a ${client.recipient.name} (${client.recipient.email.join(", ")}) :`,
          emailError.message,
        );
      }
    }

    console.log("\n🏁 Proceso de envío masivo finalizado.");
  } catch (error) {
    console.error(
      "❌ Error fatal al leer la base de datos o iniciar el proceso:",
      error,
    );
  }
};

// Execute
sendAllEmails();
