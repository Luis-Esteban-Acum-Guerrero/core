import dotenv from "dotenv";
dotenv.config();

const startTime = new Date();
import setupBrowser from "./browser.js";

// Importar modulos
import getRCV from "./sii/getRCV.js";
import sendDataToEndpoint from "./sii/saveRCV.js";

const input = {
  rut: process.env.SII_EMPRESA,
  pass: process.env.SII_EMPRESA_PASS,
  periodo: { 2025: ["01", "02"], 2024: ["11", "12"] },
};

const { browser, context, page } = await setupBrowser();

(async () => {
  try {
    console.log("Iniciando ejecución BOT...");

    const results = await getRCV(page, input);

    // acá debo enviar los datos de RCV a la DB
    /*
    if (results.length > 0) {
      const empresa_id = 1;
      await sendDataToEndpoint(results["rcv"], empresa_id);
    }
    */
  } catch (error) {
    console.error("Error en la ejecución:", error.message);
  }
  await context.close();
  await browser.close();

  const endTime = new Date(); // Finalizar el temporizador
  const executionTime = (endTime - startTime) / 1000; // Calcular el tiempo en segundos
  console.log(`Tiempo de ejecución TOTAL: ${executionTime} segundos.`);
})();
