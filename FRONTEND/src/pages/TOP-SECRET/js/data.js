import dotenv from "dotenv";
dotenv.config();

import { randomUUID } from "crypto";
const uid = randomUUID();

// Formatear fecha en formato "YYYY-MM-DD HH:mm:ss"
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const data = {
  header: {
    uid: uid,
    tipoDoc: "Cotización",
    numDoc: "2026-001",
    fechaDoc: "2026-01-02",
    titulo: "INFORME SITUACIÓN DICIEMBRE 2025",
    subtitulo: "Estado y avances de proyectos",
    qr: `${process.env.BASE_URL}TOP-SECRET/${uid}`,
    createdAt: formatDate(new Date().toISOString()),
    createdBy: "owis",
    editedAt: "",
    editedBy: "",
  },
  emisor: {
    logo: "logoCI.png",
    firma: "firma.png",
    nombre: "Boris cabezas",
    cargo: "Jefe de proyectos",
    email: "boris@creceideas.cl",
    telefono: "+56 9 9999 9999",
  },
  cliente: {
    nombre: "Cliente de Prueba",
    email: "cliente@email.com",
    id: "1234567890",
  },
  paginas: [
    {
      titulo: "Descripción del problema",
      contenido: [
        {
          tipo: "texto",
          valor:
            'El cliente requiere una <a href="#">solución escalable</a> para automatizar procesos.',
        },
        {
          tipo: "columnas",
          columnas: 2,
          valor: [
            "Actualmente los procesos son manuales y poco trazables, texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba",
            ' texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba texto de prueba<img src="../assets/logoCI.png" alt="Proceso manual" />',
          ],
        },
        {
          tipo: "destacado",
          valor:
            "Nuestra solución reduce costos y mejora la eficiencia operacional.Nuestra solución reduce costos y mejora la eficiencia operacional.Nuestra solución reduce costos y mejora la eficiencia operacional.Nuestra solución reduce costos y mejora la eficiencia operacional.Nuestra solución reduce costos y mejora la eficiencia operacional.Nuestra solución reduce costos y mejora la eficiencia operacional.Nuestra solución reduce costos y mejora la eficiencia operacional.Nuestra solución reduce costos y mejora la eficiencia operacional.Nuestra solución reduce costos y mejora la eficiencia operacional.Nuestra solución reduce costos y mejora la eficiencia operacional.",
        },
      ],
    },
    {
      titulo: "Propuesta tecnológica",
      contenido: [
        {
          tipo: "texto",
          valor:
            "Nuestra propuesta tecnológica incluye la automatización de procesos mediante la implementación de una solución basada en la nube.",
        },
        {
          tipo: "texto",
          valor:
            "Esta solución permitirá a la empresa optimizar sus procesos, reducir costos y mejorar la eficiencia operacional.",
        },
        {
          tipo: "texto",
          valor:
            "La solución incluirá la automatización de procesos críticos, como la generación de cotizaciones, la gestión de pedidos y la facturación.",
        },
        {
          tipo: "imagen",
          valor: "../assets/logoCI.png",
        },
      ],
    },
    {
      titulo: "Descripción de la propuesta",
      contenido: [
        {
          tipo: "texto",
          valor:
            "La propuesta tecnológica se basará en la implementación de una solución basada en la nube, que permitirá a la empresa automatizar procesos críticos y optimizar sus operaciones.",
        },
        {
          tipo: "texto",
          valor:
            "La solución incluirá la automatización de procesos críticos, como la generación de cotizaciones, la gestión de pedidos y la facturación.",
        },
        {
          tipo: "columnas",
          columnas: 2,
          valor: [
            "La solución incluirá la automatización de procesos críticos, como la generación de cotizaciones, la gestión de pedidos y la facturación.",
            "La solución incluirá la automatización de procesos críticos, como la generación de cotizaciones, la gestión de pedidos y la facturación.",
          ],
        },
      ],
    },
  ],
  detalle: {
    titulo: "Propuesta Económica",
    items: [
      {
        descripcion: "Levantamiento y análisis",
        cantidad: 1,
        precioUnitario: 500000,
        subtotal: 500000,
      },
      {
        descripcion: "Desarrollo solución",
        cantidad: 1,
        precioUnitario: 1500000,
        subtotal: 1500000,
      },
    ],
    total: 2000000,
    observaciones:
      "Observaciones para la realización de la cotización y el pago",
  },
  pagos: {
    condiciones: {
      nombre: "Condiciones de pago",
      texto:
        "Las condiciones de pago son las siguientes:<br><ol><li>El pago inicial debe ser realizado en un plazo de 15 días hábiles a partir de la fecha de emisión de la cotización.</li><li>El pago debe ser realizado con transferencia bancaria, o se habilitará un enlace de pago para tarjetas de crédito.</li><li>En caso de no cumplir con las condiciones de pago, se considerará como no pagado y se aplicarán las sanciones correspondientes.</li></ol><ul><li>El pago inicial de ${data.detalle.items[0].subtotal} será realizado en un plazo de 15 días hábiles a partir de la fecha de emisión de la cotización.</li><li>El pago total de ${data.detalle.total} será realizado en un plazo de 30 días hábiles a partir de la fecha de emisión de la cotización.</li></ul>",
    },
    banco: {
      nombre: "Banco XYZ",
      tipoCuenta: "Cuenta Corriente",
      numeroCuenta: "1234567890",
      titular: "Nombre del Titular",
      rut: "xx.xxx.xxx-x",
      email: "email@example.com",
    },
  },
  firma: {
    fecha: null,
    fingerPrint: null,
    firmaData: null,
  },
};
