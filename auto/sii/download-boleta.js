import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadFile(page, URLfile) {
  try {
    // Si se entrega una URL inicial, navegar a ella

    /*
    if (URLfile) {
      await page.goto(URLfile, { waitUntil: "domcontentloaded" });
    }
    */

    await page.waitForLoadState("networkidle");

    // En este punto, ya deberías estar visualizando la boleta en formato PDF en el navegador.
    // No se puede automatizar el diálogo del sistema operativo (Cmd+S/Ctrl+S).
    // En su lugar, descargamos el PDF desde la URL activa usando fetch dentro del contexto de la página.

    let currentUrl = page.url();
    //console.log("URL actual:", currentUrl);

    // Si aún estamos en informe mensual, buscar enlace al PDF y navegar
    if (/TMBCOC_InformeMensualBhe\.cgi/.test(currentUrl)) {
      const pdfUrl = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll("a"));
        const found = anchors
          .map((a) => a.href)
          .find(
            (href) => href && href.includes("TMBCOT_ConsultaBoletaPdf.cgi")
          );
        return found || null;
      });

      if (!pdfUrl) {
        throw new Error(
          "No se encontró enlace al PDF en la página del informe mensual."
        );
      }

      await page.goto(pdfUrl, { waitUntil: "domcontentloaded" });
      currentUrl = page.url();
      //console.log("URL PDF:", currentUrl);
    }

    // Confirmar que estamos en la URL del PDF del SII
    const isPdfUrl = /TMBCOT_ConsultaBoletaPdf\.cgi/.test(currentUrl);
    if (!isPdfUrl) {
      throw new Error(
        "No se detectó la URL del PDF de boleta. Navega hasta la boleta antes de descargar."
      );
    }

    // Descargar bytes del PDF con las cookies de sesión del navegador
    const pdfBytes = await page.evaluate(async (pdfUrl) => {
      const res = await fetch(pdfUrl, { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      return Array.from(new Uint8Array(buf));
    }, currentUrl);

    // GENERO EL NOMBRE BHE_[TIME] ... cambiar a -> BHE_[RUT]_NUM
    // Asegurar carpeta de descargas
    const downloadsDir = path.join(__dirname, "./downloads");
    fs.mkdirSync(downloadsDir, { recursive: true });

    // Construir nombre y ruta del archivo a guardar
    const fileName = `BHE_${Date.now()}.pdf`;
    const filePath = path.join(downloadsDir, fileName);

    fs.writeFileSync(filePath, Buffer.from(pdfBytes));
    //console.log("PDF guardado en:", filePath);

    return {
      status: "OK",
      message: "Download OK",
      url: filePath,
      fileName: fileName,
    };
  } catch (error) {
    console.error("[DOWNLOAD] Error en la descarga:", error.message);
    throw error; // Re-lanzar el error para que se maneje en el nivel superior
  }
}

export default downloadFile;
