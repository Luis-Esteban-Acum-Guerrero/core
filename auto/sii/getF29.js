import loginSII from "./login.js";

async function getF29(page, { rut, pass, periodo }) {
  if (!rut || !pass || !periodo) {
    throw new Error("RUT, contraseña y periodo son requeridos");
  }
  await loginSII(page, rut, pass);

  const data = [];
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  for (const [anio, meses] of Object.entries(periodo)) {
    for (const mes of meses) {
      if (mes) {
        console.log(`[F29] ${rut} Procesando período: ${anio}/${mes}`);

        await page.goto(
          "https://www4.sii.cl/sifmConsultaInternet/index.html?dest=cifxx&form=29"
        );
        await page.getByRole("link", { name: "F29 (+)" }).click();

        //localizar la tabla con class gw-tabla-integral_boostrap
        const tablaF29 = await page
          .locator(".gw-tabla-integral_boostrap")
          .nth(1);
        await tablaF29.waitFor({ state: "attached" });

        // Click en la celda correspondiente al mes y año
        const clicked = await clickCell(page, tablaF29, anio, mes);
        if (!clicked) {
          console.log(
            `[F29] No se pudo hacer click en ${anio}/${mes} (posiblemente vacío o no disponible)`
          );
        }

        //console.log(`[F29] Click realizado en ${anio}/${mes}`);
        await page.waitForTimeout(500);

        const page1Promise = page.waitForEvent("popup");

        await page.getByRole("button", { name: "Formulario Compacto" }).click();
        const page1 = await page1Promise;

        const urlObj = new URL(page1.url());
        const folio = urlObj.searchParams.get("folio");
        const codigo = urlObj.searchParams.get("codInt");

        page1.close();

        await page.goto(
          `https://www4.sii.cl/rfiInternet/?opcionPagina=formCompleto&folio=${folio}&codigo=${codigo}&form=29#rfiDetalle`
        );

        const detalle = await extractDetalleF29(page);
        console.log(JSON.stringify(detalle, null, 2));

        // Almacenar el resultado en data para el retorno final
        data.push({
          periodo: `${anio}/${mes}`,
          detalle: detalle,
        });

        await page.waitForTimeout(1000);
      }
    }
  }

  return data;
}

async function clickCell(page, tableLocator, targetYear, targetMonth) {
  // Mapeo de meses numéricos a texto
  const monthMap = {
    "01": "Enero",
    "02": "Febrero",
    "03": "Marzo",
    "04": "Abril",
    "05": "Mayo",
    "06": "Junio",
    "07": "Julio",
    "08": "Agosto",
    "09": "Septiembre",
    10: "Octubre",
    11: "Noviembre",
    12: "Diciembre",
  };

  const targetMonthName = (monthMap[targetMonth] || targetMonth).toLowerCase();
  const targetYearNum = Number(targetYear);

  // 1. Obtener Año Base
  // Selector provisto por el usuario para el año más reciente (segunda columna de datos)
  const baseYearLocator = page
    .locator(
      "td > table > tbody > tr > td > table > tbody > tr:nth-child(2) > td"
    )
    .nth(1);

  const baseYearText = await baseYearLocator.innerText().catch(() => "");
  const baseYear = Number(baseYearText.trim());

  if (!baseYear || isNaN(baseYear)) {
    console.warn("No se pudo detectar el año base de la tabla.");
    return false;
  }

  const yearDiff = baseYear - targetYearNum;
  if (yearDiff < 0) {
    console.warn(
      `El año objetivo ${targetYearNum} es mayor que el año base ${baseYear}.`
    );
    return false;
  }

  // Fórmula corregida: 1 (offset meses) + diferencia de años
  const colIndex = 1 + yearDiff;

  // 2. Buscar la fila del mes
  const rows = tableLocator.locator("xpath=./tbody/tr");
  const count = await rows.count();
  let rowIndex = -1;

  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    // El primer TD contiene el nombre del mes
    const firstCell = row.locator("td").first();
    const text = await firstCell.innerText();
    if (text.trim().toLowerCase() === targetMonthName) {
      rowIndex = i;
      break;
    }
  }

  if (rowIndex === -1) {
    console.warn(`Mes ${targetMonthName} no encontrado.`);
    return false;
  }

  // 3. Click en la celda
  const targetRow = rows.nth(rowIndex);
  const targetCell = targetRow.locator("xpath=./td").nth(colIndex);

  // Esperar a que exista la celda
  if ((await targetCell.count()) === 0) {
    console.warn(`Celda para ${targetYear}/${targetMonthName} no existe.`);
    return false;
  }

  // Intentamos clickear elemento interactivo interno o la celda misma
  const clickableElement = targetCell.locator("table, img").first();

  if ((await clickableElement.count()) > 0) {
    await clickableElement.click();
    return true;
  } else {
    await targetCell.click();
    return true;
  }
}

async function extractDetalleF29(page) {
  return await page.evaluate(() => {
    const data = [];
    // Seleccionar todas las filas que podrían contener datos
    const rows = Array.from(document.querySelectorAll("tr"));

    rows.forEach((tr) => {
      // Intentar obtener el número de línea si existe
      const lineaCell = tr.querySelector(".celda-linea");
      const linea = lineaCell ? lineaCell.textContent.trim() : "";

      // Obtener todas las celdas de la fila
      const cells = Array.from(tr.children);

      let currentGlosa = "";
      let lastEntry = null;

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const text = cell.textContent.trim();
        const classList = cell.classList;

        if (classList.contains("celda-glosa")) {
          currentGlosa = text;
        } else if (classList.contains("celda-codigo")) {
          const codigo = text;
          // El valor suele estar en la celda siguiente
          let valor = "";
          if (i + 1 < cells.length) {
            // Asumimos que la celda siguiente es el valor
            // A veces tiene clase 'tabla_td_fixed_b_right', a veces no explícita
            valor = cells[i + 1].textContent.trim();
            // Avanzamos el índice para no procesar la celda de valor como otra cosa
            // (a menos que esa celda tenga clases que indiquen lo contrario, pero
            //  generalmente es solo dato)
            // Sin embargo, hay que tener cuidado si la celda de valor es también celda-codigo
            // (poco probable en este diseño).
          }

          lastEntry = {
            linea,
            codigo,
            glosa: currentGlosa,
            valor,
            signo: "",
          };
          data.push(lastEntry);

          // Saltamos la celda de valor en la próxima iteración si se consumió
          // Verificamos si la celda siguiente NO es glosa ni codigo ni signo para saltarla con seguridad
          // O simplemente asumimos estructura estricta TD CODIGO -> TD VALOR
          if (
            i + 1 < cells.length &&
            !cells[i + 1].classList.contains("celda-codigo") &&
            !cells[i + 1].classList.contains("celda-glosa") &&
            !cells[i + 1].classList.contains("celda-signo")
          ) {
            i++;
          }
        } else if (classList.contains("celda-signo")) {
          // Asigna signo al último código procesado
          if (lastEntry) {
            lastEntry.signo = text;
          }
        }
      }
    });

    // Filtrar entradas vacías o inválidas si es necesario
    return data.filter((d) => d.codigo && d.codigo.length > 0);
  });
}

export default getF29;
