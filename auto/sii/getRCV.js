import * as XLSX from "xlsx/xlsx.mjs";
import dotenv from "dotenv";

import * as fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import loginSII from "./login.js";
import saveRCV from "./saveRCV.js";

// Solución para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

XLSX.set_fs(fs);

dotenv.config();
var alldata = [];

function formatSiiDate(value) {
  if (typeof value === "number" && value > 1) {
    if (value % 1 !== 0) {
      return XLSX.SSF.format("dd/mm/yyyy hh:mm:ss", value);
    }
    return XLSX.SSF.format("dd/mm/yyyy", value);
  }
  return value;
}

async function datatoDB(xlsxFilePath, tipoMov) {
  const workbook = XLSX.readFile(xlsxFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

  const registros = data.map((row) => {
    const base = {
      tipoMov, // 1 = compra, 2 = venta
      tipoDoc: row["Tipo Doc"] || null,
      rut:
        tipoMov === 1
          ? row["RUT Proveedor"] || null
          : row["Rut cliente"] || null,
      razonSocial: row["Razon Social"] || null,
      folio: row["Folio"] || null,
      fechaDoc: formatSiiDate(row["Fecha Docto"]) || null,
      fechaRecepcion: formatSiiDate(row["Fecha Recepcion"]) || null,
      fechaAcuse:
        tipoMov === 1
          ? formatSiiDate(row["Fecha Acuse"]) || null
          : formatSiiDate(row["Fecha Acuse Recibo"]) || null,
      fechaReclamo:
        tipoMov === 2 ? formatSiiDate(row["Fecha Reclamo"]) || null : null,
      montoExento: row["Monto Exento"] || 0,
      montoNeto: row["Monto Neto"] || 0,
      montoIVA:
        tipoMov === 1
          ? row["Monto IVA Recuperable"] || 0
          : row["Monto IVA"] || 0,
      montoTotal: row["Monto Total"] || row["Monto total"] || 0,
      otroImpuestoCod:
        tipoMov === 1 ? row["Codigo Otro Impuesto"] || null : null,
      otroImpuestoValor:
        tipoMov === 1 ? row["Valor Otro Impuesto"] || null : null,
      otroImpuestoTasa:
        tipoMov === 1 ? row["Tasa Otro Impuesto"] || null : null,
    };
    return base;
  });
  return registros;
}

async function Compra_venta(page, mes, anio, rut) {
  await page.goto("https://www4.sii.cl/consdcvinternetui/#/index");
  await page
    .locator('select[name="rut"]')
    .selectOption(rut.replaceAll(".", ""));

  await page.locator("#periodoMes").selectOption(mes);
  await page.getByRole("combobox").nth(2).selectOption(anio);
  await page.getByRole("button", { name: "Consultar" }).click();
  await page.waitForLoadState("networkidle");

  //DESCARGA COMPRA
  await page.getByRole("link", { name: "COMPRA" }).click();
  const downloadPromise1 = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Descargar Detalles", exact: true })
    .click();
  const download1 = await downloadPromise1;
  const downloadFolder = path.join(__dirname, "downloads");
  if (!fs.existsSync(downloadFolder)) {
    fs.mkdirSync(downloadFolder, { recursive: true });
  }
  const downloadFilePath1 = path.join(
    downloadFolder,
    download1.suggestedFilename()
  );
  await download1.saveAs(downloadFilePath1);

  await page.waitForTimeout(500);

  //DESCARGA VENTA
  await page.getByRole("link", { name: "VENTA" }).click();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
  const downloadPromise2 = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Descargar Detalles", exact: true })
    .click();
  const download2 = await downloadPromise2;
  const downloadFilePath2 = path.join(
    downloadFolder,
    download2.suggestedFilename()
  );
  await download2.saveAs(downloadFilePath2);

  await page.waitForTimeout(500);

  // Procesar los archivos de compra y venta PARA TRANSFORMAR EN AUDISOFT
  /*
    const periodo = `${anio}${mes}`;
    const compraPaths = await procesarArchivo(downloadFilePath1,"1",rut,periodo);
    const ventaPaths = await procesarArchivo(downloadFilePath2,"2",rut,periodo);
  */

  // pide a sistema procesar ambos archivos para transformarlos a 1 solo arreglo
  const compraData = await datatoDB(downloadFilePath1, 1);
  const ventaData = await datatoDB(downloadFilePath2, 2);

  alldata = alldata.concat(compraData, ventaData);

  // Eliminar los archivos CSV originales
  fs.unlinkSync(downloadFilePath1);
  fs.unlinkSync(downloadFilePath2);

  return {
    status: "OK",
    data: alldata,
    //compras: compraPaths,
    //ventas: ventaPaths,
  };
}

async function getRCV(page, data = {}) {
  if (!data.rut || !data.pass || !data.idEmpresa) {
    throw new Error("RUT, contraseña e ID de empresa son requeridos");
  }

  const rut = data.rut;
  const password = data.pass;

  // si no existe periodo, por defecto es el mes actual
  const thisAnio = new Date().getFullYear();
  const thisMes = new Date().getMonth() + 1;
  const periodo = data.periodo || [`${thisAnio}:[${thisMes}]`];

  const timeInicio = new Date();

  try {
    console.log("CONSULTANDO RUT:", rut, "PERIODOS:", periodo);

    await loginSII(page, rut, password);

    for (const [anio, meses] of Object.entries(periodo)) {
      for (const mes of meses) {
        if (mes) {
          // Llamamos a Compra_venta para cada mes y año
          console.log(`[RCV] ${rut} Procesando período: ${anio}/${mes}`);
          const result = await Compra_venta(page, mes, anio, rut);
        } else {
          console.warn(`[RCV] ${rut} El mes '${mes}' no es válido.`);
        }
      }
    }

    const downloadFolder = path.join(__dirname, "downloads");
    if (!fs.existsSync(downloadFolder)) {
      fs.mkdirSync(downloadFolder, { recursive: true });
    }

    // Guardar el resultado final en un archivo JSON
    const random = Math.floor(Math.random() * 1000000);
    const finalJsonPath = path.join(
      downloadFolder,
      `RCV_${rut.replaceAll(".", "")}_${random}.json`
    );
    fs.writeFileSync(finalJsonPath, JSON.stringify(alldata, null, 2), "utf-8");

    // Guardar en la base de datos
    await saveRCV(alldata, data.idEmpresa);
    console.log(`[RCV] ${rut} data: ${finalJsonPath}`);

    const timeFin = new Date();
    const tiempoTotal = (timeFin - timeInicio) / 1000;
    console.log(
      `[RCV] ${rut} Tiempo total de ejecución: ${tiempoTotal} segundos\n`
    );

    return alldata;
  } catch (error) {
    console.error("Error in getRCV:", error);
    throw error;
  }
}

export default getRCV;
