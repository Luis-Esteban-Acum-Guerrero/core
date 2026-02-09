import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Emite una factura electrónica en el sistema del SII
 * @param {Object} page - Instancia de página de Playwright
 * @param {Object} input - Datos para la emisión de la factura
 * @param {boolean} confirmar - Si es true, confirma la emisión. Por defecto es false
 * @returns {Promise<Object>} - Resultado de la operación
 */
async function emitirFactura(page, input, confirmar = false) {
  try {
    // Acceder a facturación electrónica

    await page.goto("https://www.sii.cl/servicios_online/1039-.html", {
      waitUntil: "networkidle",
    });
    console.log("[Factura Electronica] Inicio");
    console.log("Emitiendo a:", input.destinatario);

    await page
      .locator("p")
      .filter({ hasText: "Sistema de facturación gratuito del SII" })
      .getByRole("link")
      .waitFor({ state: "visible", timeout: 10000 });

    await page
      .locator("p")
      .filter({ hasText: "Sistema de facturación gratuito del SII" })
      .getByRole("link")
      .click();
    //console.log("✅ Click en Sistema de facturación gratuito");

    await page.waitForLoadState("networkidle");

    const emisionButton = page.getByRole("button", {
      name: "Emisión de documentos",
    });
    await emisionButton.waitFor({ state: "visible", timeout: 10000 });
    await emisionButton.click();
    //console.log("✅ Click en Emisión de documentos");

    await page.waitForLoadState("networkidle");

    const facturaLink = page.getByRole("link", {
      name: "> Factura electrónica",
      exact: true,
    });
    await facturaLink.waitFor({ state: "visible", timeout: 10000 });
    await facturaLink.click();
    //console.log("✅ Click en Factura electrónica");

    /**
     * SI EXISTE LA OPCION DE SELECCION DE EMPRESA, DEBE SELECCIONAR LA CORRESPONDIENTE A EMISION
     * Se verifica que exista el combobox Y el botón 'Enviar' para asegurar que estamos en la pantalla de selección
     */
    await page.waitForLoadState("networkidle");
    const combo = page.getByRole("combobox");
    const enviarBtn = page.getByRole("button", { name: "Enviar" });

    // Verificamos ambos elementos para evitar falsos positivos con otros combobox del formulario
    if ((await combo.count()) > 0 && (await enviarBtn.count()) > 0) {
      const rutEmisor = input.origen.rutEmisor.replace(/\./g, ""); // xxxxxxxx-x
      console.log(
        "[Factura Electronica] Seleccionando rutEmisor (multirut)",
        rutEmisor
      );
      
      try {
        await combo.first().selectOption(rutEmisor); // selección rut emisor
        await enviarBtn.click();
      } catch (e) {
         console.log("[Factura Electronica] Error al seleccionar empresa:", e.message);
      }
    } else {
      console.log(
        "[Factura Electronica] Multirut no solicitado o ya seleccionado; continuando."
      );
    }

    /**
     *
     */

    await page.waitForLoadState("networkidle");

    // Fecha emisión
    await page
      .getByPlaceholder("AAAA-MM-DD")
      .fill(
        `${input.origen.anioEmision}-${input.origen.mesEmision}-${input.origen.diaEmision}`,
      );
    //console.log("✅ Fecha de emisión completada");

    // Receptor
    await page.getByLabel("Rut", { exact: true }).click();
    await page
      .getByLabel("Rut", { exact: true })
      .fill(input.destino.rutDestinatario);
    await page.locator("#EFXP_DV_RECEP").click();
    await page.locator("#EFXP_DV_RECEP").fill(input.destino.dvDestinatario);
    await page.locator("#EFXP_DV_RECEP").press("Tab");

    //console.log("✅ Rut del receptor completado");

    //Agregar un validador de COMUNAS, en algunos casos el SII no rescata la COMUNA desde su DB
    await page.waitForTimeout(500); // Espera 1/2 segundo (00 ms)
    const ciudad = await page
      .locator('input[name="EFXP_CIUDAD_RECEP"]')
      .inputValue();

    if (!ciudad || ciudad.trim() === "") {
      await page.locator('input[name="EFXP_CIUDAD_RECEP"]').click();
      await page
        .locator('input[name="EFXP_CIUDAD_RECEP"]')
        .fill(input.destino.ciudad);
      console.log("🚨 Receptor con problemas de ciudad");
    }

    // Procesar servicios desde el array de detalle
    if (input.detalle && input.detalle.length > 0) {
      // Función para agregar servicios dinámicamente
      const agregarServicio = async (servicio, index) => {
        const num = index + 1;
        const numStr = num.toString().padStart(2, "0");

        // Si no es el primer servicio, agregar una nueva línea
        if (num > 1) {
          await page
            .getByRole("button", { name: "Agrega linea de Detalle" })
            .click();
        }

        // Nombre del servicio
        await page.locator(`input[name="EFXP_NMB_${numStr}"]`).click();
        await page
          .locator(`input[name="EFXP_NMB_${numStr}"]`)
          .fill(servicio.nombreServicio || "");

        // Descripción del servicio
        if (servicio.detalleServicio) {
          await page.locator(`input[name="DESCRIP_${numStr}"]`).check();

          await page.getByText("Ingrese sólo si requiere").click();
          await page
            .getByText("Ingrese sólo si requiere")
            .fill(servicio.detalleServicio);
        }

        // Precio
        await page.locator(`input[name="EFXP_PRC_${numStr}"]`).click();
        await page
          .locator(`input[name="EFXP_PRC_${numStr}"]`)
          .fill(servicio.valorServicio || "1");

        // Cantidad
        await page.locator(`input[name="EFXP_QTY_${numStr}"]`).click();
        await page
          .locator(`input[name="EFXP_QTY_${numStr}"]`)
          .fill(servicio.cantidadServicio || "1");

        await page.locator(`input[name="EFXP_QTY_${numStr}"]`).press("Tab");

        // Descuento
        if (servicio.descuentoServicio) {
          await page.locator(`input[name="EFXP_PCTD_${numStr}"]`).click();
          await page
            .locator(`input[name="EFXP_PCTD_${numStr}"] `)
            .fill(servicio.descuentoServicio);
        }
        console.log(`[Factura Electronica] Datos del servicio ${num} OK`);
      };

      // Procesar todos los servicios (máximo 10)
      const serviciosAProcesar = input.detalle.slice(0, 10);
      for (let i = 0; i < serviciosAProcesar.length; i++) {
        await agregarServicio(serviciosAProcesar[i], i);
      }
    }

    const facturaInfo = {
      success: true,
      message: "",
      factura: {},
    };
    //console.log("✅ Listo para validar");
    // Confirmar emisión si se solicita
    if (confirmar) {
      await page.getByRole("button", { name: "Validar y visualizar" }).click();
      console.log("[Factura Electronica] Validar y visualizar");

      await page.waitForLoadState("networkidle");

      await page.getByRole("button", { name: "Firmar" }).click();
      console.log("[Factura Electronica] Firmar");

      await page.getByLabel("Ingrese la clave de su").click();
      await page
        .getByLabel("Ingrese la clave de su")
        .fill(input.origen.claveFirma);
      await page.getByRole("button", { name: "Firmar" }).click();
      console.log("[Factura Electronica] Firma completada");

      /**
       * ! HASTA ACÁ TODO OK
       * es necesario verificar la descarga del documento recién emitido como asi tambien el folio del mismo
       *  */

      await page.waitForSelector("text=Fecha Emisión");
      const bodyText = await page.textContent("body");

      // --- 1. Fecha de Emisión ---
      const fechaEmision =
        bodyText.match(/Fecha Emisión:\s*([0-9]{2}-[0-9]{2}-[0-9]{4})/)?.[1] ??
        null;

      // --- 2. Tipo de Documento ---
      const tipoDocumento =
        bodyText.match(
          /(FACTURA ELECTRÓNICA|BOLETA ELECTRÓNICA|NOTA DE CRÉDITO ELECTRÓNICA)/i,
        )?.[1] ?? null;

      // --- 3. Número de Documento ---
      const numeroDocumento = bodyText.match(/N°\s*([0-9]+)/)?.[1] ?? null;

      // --- 4. Receptor ---
      const receptor =
        bodyText.match(/Receptor\s+([\s\S]*?)\s+Rut Receptor/)?.[1]?.trim() ??
        null;

      // --- 5. Rut Receptor ---
      const rutReceptor =
        bodyText.match(/Rut Receptor\s+([0-9.\-]+)/)?.[1] ?? null;

      // --- 6. Total ---
      const total = bodyText.match(/TOTAL\s+\$([0-9.]+)/)?.[1] ?? null;
      //
      //

      //VER DOCUMENTO
      /*
      await page.waitForLoadState("networkidle");
      await page.getByRole("link", { name: "Ver Documento" }).click();

      const pdfPage = await page.waitForEvent("popup");
      console.log("[Factura Electronica] Ventana de visor PDF abierta");

      const pdfUrl = pdfPage.url();
      console.log("[Factura Electronica] URL visor:", pdfUrl);
      */

      /*
      // 👉 Es un PDF directo, no hay toolbar ni DOM
      const downloadPromise = pdfPage.waitForEvent("download");
      // Forzar descarga
      await pdfPage.evaluate(() => {
        window.location.href;
      });
      const download = await downloadPromise;
      // Guardar como antes...

      //const download = await pdfPage.waitForEvent("download", {
      //  timeout: 15000,
      //});

      const filePath = await download.path();
      console.log(`[Factura Electronica] Archivo descargado en: ${filePath}`);

      const downloadFilePath = path.join(
        __dirname,
        "../downloads",
        download.suggestedFilename()
      );

      await download.saveAs(downloadFilePath);
      //fs.unlinkSync(downloadFilePath);
      */

      const downloadResult = {
        url: "fake URL",
        fileName: "fake filename",
      };

      facturaInfo.success = true;
      facturaInfo.message = "Factura emitida correctamente";
      facturaInfo.factura = {
        fechaEmision,
        tipoDocumento,
        numeroDocumento,
        receptor,
        rutReceptor,
        total,
        downloadPath: downloadResult.url,
        fileName: downloadResult.fileName,
      };
    }

    return facturaInfo;
  } catch (error) {
    console.error("Error al emitir factura:", error);

    // Tomar screenshot en caso de error
    try {
      await page.screenshot({
        path: `/Users/owis/dev/ctrl-get/downloads/error_factura_screenshot${input.destino.rutDestinatario}.png`,
      });
      console.log("📸 Screenshot de error guardado");
    } catch (e) {
      console.error("No se pudo guardar screenshot de error:", e);
    }

    return {
      success: false,
      message: "Error al emitir factura",
      error: error.message,
    };
  }
}

export default emitirFactura;
