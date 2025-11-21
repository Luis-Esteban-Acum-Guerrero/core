// BOT BOLETA ELECTRÓNICA v0.1 para c0re
import dotenv from "dotenv";
dotenv.config();

import setupBrowser from "../../browser.js";
import loginSII from "../login.js";

import downloadFile from "./download.js";

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
    const loginResult = await loginSII(page, input.rut, input.clave);
    if (loginResult.status === "ERROR") {
      return loginResult;
    }

    const URLfile =
      "https://loa.sii.cl/cgi_IMT/TMBCOT_ConsultaBoletaPdf.cgi?txt_codigobarras=15896409006149712C0A&veroriginal=si&origen=PROPIOS&enviar=si";

    const downloadResult = await downloadFile(page, URLfile);
    if (downloadResult.status === "ERROR") {
      return downloadResult;
    }

    const resultado = {
      status: "OK",
      message: "Descarga exitosa",
      url: downloadResult.url,
    };

    return resultado;
  } finally {
    await context.close();
    await browser.close();
  }
}

main()
  .then((r) => console.log("Proceso completado:", r))
  .catch((e) => console.error("Error en el proceso:", e));
