import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

const inputDir = "../2025-07"; // carpeta con PDFs
const outputFile = "documentos_electronicos.json";

// Función para limpiar texto (quitar saltos múltiples, espacios raros)
function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

async function extractTextFromPDF(filePath) {
  const pdfBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(pdfBuffer);
  console.log(`Procesando: ${filePath}`);
  return { text: pdfData.text };
}

function parseBoleta(text) {
  const valorHonorarios =
    parseInt(
      text
        .match(/Total Honorarios:\s*\$:\s*([\d\.]+)/)?.[1]
        ?.replace(/\./g, ""),
    ) || 0;

  const impuestoRetenido =
    parseInt(
      text
        .match(/(\d+\.?\d*)\s*%\s*Impto\.\s*Retenido:\s*([\d\.]+)/)?.[2]
        ?.replace(/\./g, ""),
    ) || 0;

  const totalFinal =
    parseInt(
      text.match(/Total:\s*([\d\.]+)(?:\s|$)/)?.[1]?.replace(/\./g, ""),
    ) || valorHonorarios - impuestoRetenido;

  // Debug inicial - mostrar el texto completo para analizar
  console.log(`=== DEBUG BOLETA ===`);
  console.log(`Texto completo de la boleta:`, text);
  console.log(`====================`);

  // Múltiples patrones para extraer datos del cliente (RECEPTOR)
  let razonSocial = "";
  let rutCliente = "";
  let direccion = "";
  let ciudad = "";
  let comuna = "";

  // CORRECCIÓN: Buscar después de "Señor(es):" hasta antes de "Domicilio:"
  // Patrón 1: Capturar el bloque completo del cliente
  const clienteBloque = text.match(/Señor\(es\):\s*(.+?)\s*Domicilio:/is);

  if (clienteBloque) {
    const bloqueTexto = clienteBloque[1];

    // Extraer razón social (primera línea)
    const lineas = bloqueTexto.split(/[\n\r]+/).filter((l) => l.trim());
    if (lineas.length > 0) {
      // La primera línea debería ser la razón social
      let primeraLinea = lineas[0].trim();

      // Si tiene "Rut:" en la misma línea, separar
      const rutEnMismaLinea = primeraLinea.match(
        /(.+?)\s+Rut:\s*([\d\.\-−\s]*[Kk\d])/i,
      );
      if (rutEnMismaLinea) {
        razonSocial = cleanText(rutEnMismaLinea[1]);
        rutCliente = rutEnMismaLinea[2].replace(/\s+/g, "").replace(/−/g, "-");
      } else {
        razonSocial = cleanText(primeraLinea);

        // Buscar RUT en las siguientes líneas
        for (let i = 1; i < lineas.length; i++) {
          const rutMatch = lineas[i].match(/Rut:\s*([\d\.\-−\s]*[Kk\d])/i);
          if (rutMatch) {
            rutCliente = rutMatch[1].replace(/\s+/g, "").replace(/−/g, "-");
            break;
          }
        }
      }
    }
  }

  // Fallback si no encontró con el método anterior
  if (!razonSocial || !rutCliente) {
    // Patrón 2: Formato con "Señor(es):" y "Rut:" en líneas separadas
    const razonMatch = text.match(/Señor\(es\):\s*([^\n\r]+)/i);
    if (razonMatch) {
      razonSocial = cleanText(razonMatch[1]);
    }

    const rutMatch = text.match(/Rut:\s*([\d\.\-−\s]*[Kk\d])/i);
    if (rutMatch) {
      rutCliente = rutMatch[1].replace(/\s+/g, "").replace(/−/g, "-");
    }
  }

  // Extraer domicilio
  let domicilioCompleto = "";
  const domicilioPatterns = [
    /Domicilio:\s*(.+?)(?=\n.*Por atención|\n.*Fecha|$)/is,
    /Domicilio:\s*(.+?)(?=Por atención|Fecha|$)/is,
    /Domicilio:\s*(.+)/i,
  ];

  for (const pattern of domicilioPatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim()) {
      domicilioCompleto = cleanText(match[1]);
      break;
    }
  }

  if (domicilioCompleto) {
    // Separar dirección y ciudad
    const ultimaComa = domicilioCompleto.lastIndexOf(",");
    if (ultimaComa > -1) {
      direccion = domicilioCompleto.substring(0, ultimaComa).trim();
      ciudad = domicilioCompleto
        .substring(ultimaComa + 1)
        .trim()
        .toLowerCase();
      comuna = ciudad;
    } else {
      // Buscar ciudad al final
      const ciudadMatch = domicilioCompleto.match(
        /(.+)\s+(OSORNO|SANTIAGO|VALDIVIA|TEMUCO|PUERTO MONTT|LA UNION|VALPARAISO|CONCEPCION)$/i,
      );
      if (ciudadMatch) {
        direccion = ciudadMatch[1].trim();
        ciudad = ciudadMatch[2].toLowerCase();
        comuna = ciudad;
      } else {
        direccion = domicilioCompleto;
        ciudad = "";
        comuna = "";
      }
    }
  }

  // Extraer detalle del servicio
  const servicioMatch = text.match(
    /Por atención profesional:\s*(.+?)(?=\d|$)/is,
  );
  let detalleServicio = "Servicio profesional";
  if (servicioMatch) {
    detalleServicio = cleanText(servicioMatch[1]);
  }

  // Debug para boletas
  console.log(
    `Cliente bloque:`,
    clienteBloque ? clienteBloque[1] : "No encontrado",
  );
  console.log(`Razón Social: "${razonSocial}"`);
  console.log(`RUT: "${rutCliente}"`);
  console.log(`Domicilio completo: "${domicilioCompleto}"`);
  console.log(`Dirección: "${direccion}"`);
  console.log(`Ciudad: "${ciudad}"`);
  console.log(`Valor Honorarios: ${valorHonorarios}`);
  console.log(`Impuesto Retenido: ${impuestoRetenido}`);
  console.log(`Total Final: ${totalFinal}`);
  console.log(`====================`);

  return {
    rut: rutCliente,
    razonSocial: razonSocial,
    direccion: direccion,
    ciudad: ciudad,
    comuna: comuna,
    prestacion: [
      {
        detalle: detalleServicio,
        cantidad: 1,
        valor: valorHonorarios,
      },
    ],
    generado: {
      folio: text.match(/N °\s*(\d+)/)?.[1] || "",
      rutaPDF: "",
      neto: valorHonorarios,
      impuesto: impuestoRetenido,
      total: totalFinal,
    },
  };
}

function parseFactura(text) {
  // CORRECCIÓN: Extraer montos correctamente
  const montoNeto =
    parseInt(
      text.match(/MONTO\s+NETO\s+\$\s*([\d\.]+)/)?.[1]?.replace(/\./g, ""),
    ) || 0;

  const impuesto =
    parseInt(
      text
        .match(/I\.V\.A\.\s*(?:\d+%)?\s*\$\s*([\d\.]+)/)?.[1]
        ?.replace(/\./g, ""),
    ) || Math.round(montoNeto * 0.19);

  const total =
    parseInt(text.match(/TOTAL\s+\$\s*([\d\.]+)/)?.[1]?.replace(/\./g, "")) ||
    montoNeto + impuesto;

  // Extraer RUT con dígito verificador
  const rutMatch =
    text.match(/R\.U\.T\.\s*:\s*([\d\.\-−]+[\s\-−]*[Kk\d])/)?.[1] || "";
  const rutClean = rutMatch.replace(/\s+/g, "").replace(/−/g, "-");

  // Extraer razón social
  let razonSocial = "";
  const razonPatterns = [
    /SEÑOR\(ES\)\s*:\s*(.+?)\s+R\.U\.T\./is,
    /SEÑOR\(ES\):\s*(.+?)(?=\s+R\.U\.T\.|$)/is,
  ];

  for (const pattern of razonPatterns) {
    const match = text.match(pattern);
    if (match && match[1].trim()) {
      razonSocial = cleanText(match[1]);
      break;
    }
  }

  // Extraer dirección
  const direccionMatch =
    text.match(/DIRECCION\s*:\s*(.+?)(?=\s+COMUNA|\s+CIUDAD|$)/i)?.[1] || "";

  // Extraer ciudad
  let ciudad = "";
  const ciudadPatterns = [
    /CIUDAD:\s*(.+?)(?=\s+CONTACTO|\s+TIPO|$)/i,
    /COMUNA\s+(.+?)\s+CIUDAD:\s*(.+?)(?=\s+CONTACTO|\s+TIPO|$)/i,
  ];

  for (const pattern of ciudadPatterns) {
    const match = text.match(pattern);
    if (match) {
      ciudad = cleanText(match[match.length - 1]).toLowerCase();
      if (ciudad) break;
    }
  }

  // CORRECCIÓN: Extraer detalle de productos/servicios desde la tabla
  let prestaciones = [];

  // Buscar todas las líneas de productos que empiecen con "-"
  const lineasProductos = text.match(
    /^[\s]*-[\s]*(.+?)[\s]+([\d]+)[\s]+([\d\.]+)/gm,
  );

  if (lineasProductos && lineasProductos.length > 0) {
    lineasProductos.forEach((linea) => {
      // Extraer datos de cada línea: - Descripción Cantidad Precio
      const match = linea.match(/^[\s]*-[\s]*(.+?)[\s]+([\d]+)[\s]+([\d\.]+)/);
      if (match) {
        const descripcion = cleanText(match[1]);
        const cantidad = parseInt(match[2]);
        const precio = parseInt(match[3].replace(/\./g, ""));
        const valor = cantidad * precio;

        prestaciones.push({
          detalle: descripcion,
          cantidad: cantidad,
          valor: valor,
        });
      }
    });
  }

  // Si no encontró productos, buscar con patrón alternativo
  if (prestaciones.length === 0) {
    // Patrón más amplio para capturar la tabla completa
    const tablaCompleta = text.match(
      /Codigo[\s\S]*?(?=Forma de Pago|Timbre|$)/i,
    );

    if (tablaCompleta) {
      const tablaTexto = tablaCompleta[0];
      // Buscar líneas que contengan información de productos
      const lineasTabla = tablaTexto.split(/[\n\r]+/);

      for (const linea of lineasTabla) {
        // Buscar líneas con formato: - descripción números
        const match = linea.match(
          /^[\s]*-[\s]*([^0-9]+)[\s]+([\d]+)[\s]+([\d\.]+)(?:[\s]+([\d\.]+))?/,
        );
        if (match) {
          const descripcion = cleanText(match[1]);
          const cantidad = parseInt(match[2]);
          const precio = parseInt(match[3].replace(/\./g, ""));
          const valor = match[4]
            ? parseInt(match[4].replace(/\./g, ""))
            : cantidad * precio;

          prestaciones.push({
            detalle: descripcion,
            cantidad: cantidad,
            valor: valor,
          });
        }
      }
    }
  }

  // Si aún no hay prestaciones, crear una por defecto
  if (prestaciones.length === 0) {
    prestaciones.push({
      detalle: "Servicios Informáticos",
      cantidad: 1,
      valor: montoNeto,
    });
  }

  // Debug para facturas
  console.log(`=== DEBUG FACTURA ===`);
  console.log(`Texto completo:`, text.substring(0, 500) + "...");
  console.log(`Líneas productos encontradas:`, lineasProductos);
  console.log(`Monto Neto: ${montoNeto}`);
  console.log(`IVA: ${impuesto}`);
  console.log(`Total: ${total}`);
  console.log(`RUT: "${rutClean}"`);
  console.log(`Razón Social: "${razonSocial}"`);
  console.log(`Prestaciones:`, prestaciones);
  console.log(`====================`);

  return {
    rut: rutClean,
    razonSocial: razonSocial,
    direccion: cleanText(direccionMatch),
    ciudad: ciudad,
    comuna: ciudad,
    prestacion: prestaciones,
    generado: {
      folio: text.match(/FACTURA ELECTRONICA\s*Nº\s*(\d+)/i)?.[1] || "",
      rutaPDF: "",
      neto: montoNeto,
      impuesto: impuesto,
      total: total,
    },
  };
}

async function main() {
  const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".pdf"));
  const resultados = { boletas: [], facturas: [] };

  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const pdfData = await extractTextFromPDF(filePath);
    const text = pdfData.text;

    console.log(`Texto extraído de ${file}:`, text.substring(0, 200) + "..."); // Debug

    if (/BOLETA DE HONORARIOS/i.test(text)) {
      const datos = parseBoleta(text);
      datos.generado.rutaPDF = `/documentos/boletas/${file}`;
      resultados.boletas.push(datos);
      console.log(`✅ Boleta procesada: ${file}`);
      console.log(`   RUT: ${datos.rut}, Razón Social: ${datos.razonSocial}`);
      console.log(`   Dirección: ${datos.direccion}, Ciudad: ${datos.ciudad}`);
    } else if (/FACTURA ELECTRONICA/i.test(text)) {
      const datos = parseFactura(text);
      datos.generado.rutaPDF = `/documentos/facturas/${file}`;
      resultados.facturas.push(datos);
      console.log(`✅ Factura procesada: ${file}`);
      console.log(`   RUT: ${datos.rut}, Razón Social: ${datos.razonSocial}`);
      console.log(`   Ciudad/Comuna: ${datos.ciudad}`);
      console.log(`   Prestaciones: ${datos.prestacion.length} items`);
    } else {
      console.log(`⚠️  No se reconoció el tipo de documento: ${file}`);
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(resultados, null, 2), "utf-8");
  console.log(`✅ JSON generado en ${outputFile}`);
  console.log(
    `📊 Procesados: ${resultados.boletas.length} boletas, ${resultados.facturas.length} facturas`,
  );
}

main();
