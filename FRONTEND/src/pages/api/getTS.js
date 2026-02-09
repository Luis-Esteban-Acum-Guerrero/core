import { data } from "../TOP-SECRET/js/data.js";

export const GET = ({ url }) => {
  const uid = url.searchParams.get("uid");

  // Simulación de búsqueda en DB
  if (!uid) {
    return new Response(JSON.stringify({ error: "UID requerido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Simular delay de DB
  // await new Promise(r => setTimeout(r, 100));

  // Clonar data y modificar según UID (simulación)
  const responseData = {
    ...data,
    uid: uid,
    titulo: `INFORME TOP SECRET (ID: ${uid})`,
    subtitulo: "Datos recuperados desde la API (Simulación DB)",
    fechaDoc: new Date().toISOString().split('T')[0]
  };

  return new Response(JSON.stringify(responseData), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
