// BOT BOLETA ELECTRÓNICA v0.1 para c0re
import dotenv from "dotenv";
dotenv.config();

import setupBrowser from "../browser.js";
import loginSII from "./login.js";

const SIIrut = process.env.SII_USUARIO;
const SIIclave = process.env.SII_USUARIO_PASS;

const input = {
  rut: SIIrut,
  clave: SIIclave,
};

async function main() {
  // Verificar que los datos necesarios estén presentes
  if (!input.rut || !input.clave) {
    throw new Error("Datos de origen incompletos. Se requiere rut y clave.");
  }

  const { browser, context, page } = await setupBrowser();
  try {
    // Login al SII
    const resultado = await loginSII(page, input.rut, input.clave);

    if (resultado.status === "ERROR") {
      // llamo a la funcion para actualizar la base de datos de ctrl
    }

    if (resultado.status === "OK") {
      // lo almaceno para enviar el total de las empresas por email.
    }

    return resultado;
  } finally {
    await context.close();
    await browser.close();
  }
}

main()
  .then((r) => console.log("Proceso completado:", r))
  .catch((e) => console.error("Error en el proceso:", e));
