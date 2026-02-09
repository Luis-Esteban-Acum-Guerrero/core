import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Emite una boleta electrónica en el sistema del SII
 * @param {Object} page - Instancia de página de Playwright
 * @param {Object} input - Datos para la emisión de la boleta
 * @param {boolean} confirmar - Si es true, confirma la emisión. Por defecto es false
 * @returns {Promise<Object>} - Resultado de la operación
 */
async function emitirBoleta(page, input, confirmar = false) {
  try {
    // esperar la carga de la página
    await page.waitForLoadState("networkidle");

    // Navegar a la página principal después del login
    await page.goto("https://www.sii.cl/servicios_online/1040-.html");
    console.log("[Boleta de Honorarios] Navegación a página principal");

    // Manejar posible popup
    const closeButton = page.getByRole("button", { name: "Cerrar" });
    if ((await closeButton.count()) > 0) {
      await closeButton.click();
      console.log("✅ popup cerrado");
    }

    //pausa la ejecución de playwright
    //await page.pause();

    // Ir a emitir boleta
    await page
      .locator("p")
      .filter({ hasText: "Emisor de boleta de honorarios" })
      .getByRole("link")
      .click();
    await page
      .getByRole("button", { name: "Emitir boleta de honorarios" })
      .click();
    await page
      .getByRole("link", { name: "> Por contribuyente", exact: true })
      .click();
    await page.getByRole("button", { name: "Continuar" }).click();

    // Llenar formulario - Fecha
    await page
      .locator('select[name="cbo_dia_boleta"]')
      .selectOption(input.origen.diaEmision);
    await page.locator("#cbo_mes_boleta").selectOption(input.origen.mesEmision);
    await page
      .locator("#cbo_anio_boleta")
      .selectOption(input.origen.anioEmision);

    // Datos del destinatario
    await page.locator('input[name="txt_rut_destinatario"]').click();
    await page
      .locator('input[name="txt_rut_destinatario"]')
      .fill(input.destino.rutDestinatario);
    await page.locator('input[name="txt_dv_destinatario"]').click();
    await page
      .locator('input[name="txt_dv_destinatario"]')
      .fill(input.destino.dvDestinatario);
    await page.locator('input[name="txt_nombres_destinatario"]').click();
    await page
      .locator('input[name="txt_nombres_destinatario"]')
      .fill(input.destino.nombreDesrinatario);

    await page.locator('input[name="txt_domicilio_destinatario"]').click();
    await page
      .locator('input[name="txt_domicilio_destinatario"]')
      .fill(input.destino.domicilioDestinatario);

    // Región y comuna
    await page
      .locator('select[name="cod_region"]')
      .selectOption(input.destino.regionDestinatario);
    await page
      .locator("#cbo_comuna")
      .selectOption(input.destino.comunaDestinatario);

    // Prestación 1 (siempre debe existir)
    await page.locator("#desc_prestacion_1").click();
    await page
      .locator("#desc_prestacion_1")
      .fill(input.detalle.detalleServicio1);
    await page.locator("#valor_prestacion_1").click();
    await page
      .locator("#valor_prestacion_1")
      .fill(input.detalle.valorServicio1);

    // Prestaciones adicionales (opcionales)
    if (input.detalle.detalleServicio2 && input.detalle.valorServicio2) {
      await page.locator("#desc_prestacion_2").click();
      await page
        .locator("#desc_prestacion_2")
        .fill(input.detalle.detalleServicio2);
      await page.locator("#valor_prestacion_2").click();
      await page
        .locator("#valor_prestacion_2")
        .fill(input.detalle.valorServicio2);
    }

    if (input.detalle.detalleServicio3 && input.detalle.valorServicio3) {
      await page.locator("#desc_prestacion_3").click();
      await page
        .locator("#desc_prestacion_3")
        .fill(input.detalle.detalleServicio3);
      await page.locator("#valor_prestacion_3").click();
      await page
        .locator("#valor_prestacion_3")
        .fill(input.detalle.valorServicio3);
    }

    if (input.detalle.detalleServicio4 && input.detalle.valorServicio4) {
      await page.locator("#desc_prestacion_4").click();
      await page
        .locator("#desc_prestacion_4")
        .fill(input.detalle.detalleServicio4);
      await page.locator("#valor_prestacion_4").click();
      await page
        .locator("#valor_prestacion_4")
        .fill(input.detalle.valorServicio4);
    }

    // Confirmar emisión si se solicita
    if (confirmar) {
      await page.getByRole("button", { name: "Confirmar Emisión" }).click();
      await page.waitForLoadState("networkidle");
      await page
        .getByRole("button", { name: "Emitir Boleta de Honorarios" })
        .click();

      await page.waitForLoadState("networkidle");

      const urliframe = await page.locator("iframe").getAttribute("src");
      // Extraer el número de boleta de la URL
      const boletaNumero = urliframe.split("/").pop().replace(".html", "");
      const boletaNum = boletaNumero.split("-")[1];
      //console.log("boleta Numero:", boletaNum);
      //src="/IMT/pdf/bhe_15896409-613.html"

      await page.getByRole("button", { name: "Ver Boleta" }).click();

      const actualUrl = page.url();

      // Aquí se podría agregar código para capturar el número de boleta o descargar el PDF
      const boletaInfo = {
        success: true,
        url: actualUrl,
        boletaNum: boletaNum,
      };

      return boletaInfo;
    }

    return {
      success: true,
      message: "Formulario completado correctamente, pendiente de confirmar",
    };
  } catch (error) {
    console.error("Error al emitir boleta:", error);
    return {
      success: false,
      message: "Error al emitir boleta",
      error: error.message,
    };
  }
}

export default emitirBoleta;
