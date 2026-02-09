import express from "express";
const router = express.Router();

async function getClienteByTelefono(telefono) {
  //const data = await fetch(`${BACKEND_URL}/cliente/${telefono}`);
  const data = {
    ok: true,
    data: {
      telefono,
      nombre: "Cliente Test",
      email: "cliente@test.cl",
    },
    status: "active",
  };
  return data;
}

router.post("/ticket/", async (req, res) => {
  res.status(200).json({ message: "Ticket creado correctamente" });
});

router.get("/cliente/:telefono", async (req, res) => {
  const { telefono } = req.params;

  const data = await getClienteByTelefono(telefono);
  if (!data.ok) {
    return res.status(400).json({ message: "Error al obtener cliente" });
  }

  if (data.status !== "active") {
    return res.status(400).json({ message: "Cliente no activo" });
  }

  res
    .status(200)
    .json({ message: "Cliente obtenido correctamente", data: data.data });
});

router.post("/ticket/", async (req, res) => {
  res
    .status(200)
    .json({ message: "Ticket creado correctamente", data: req.body });
});

export default router;
