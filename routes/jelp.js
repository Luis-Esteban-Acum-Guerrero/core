import express from "express";
import fs from "fs";
const router = express.Router();
import crypto from "crypto";

import dotenv from "dotenv";
dotenv.config();

// Endpoint para obtener el script de huella
router.post("/fingerprint/", async (req, res) => {
  res.setHeader("Content-Type", "text/plain"); // evita forzar descargas
  const script = fs.readFileSync("../scripts/fingerprint.ps1", "utf8");
  res.send(script);
});

// Endpoint para registrar la huella
router.post("/fingerprint/register/", async (req, res) => {
  const payload = JSON.stringify(req.body);

  const sessionToken = req.headers["x-session-token"];
  const receivedSignature = req.headers["x-signature"];

  if (!sessionToken) {
    return res.status(401).json({ error: "Sesión requerida" });
  }

  // validar sesión (TTL + existencia)
  const session = global.sessions?.get(sessionToken);
  if (!session) {
    return res.status(403).json({ error: "Sesión inválida o expirada" });
  }

  // validar HMAC (usando token de sesión)
  const expectedSignature = crypto
    .createHmac("sha256", sessionToken)
    .update(payload)
    .digest("base64");

  if (receivedSignature !== expectedSignature) {
    return res.status(403).json({ error: "Firma inválida" });
  }

  // Anti-replay
  const now = Date.now();
  const sent = new Date(req.body.timestamp).getTime();

  if (Math.abs(now - sent) > 5 * 60 * 1000) {
    return res.status(400).json({ error: "Timestamp fuera de rango" });
  }

  // (aquí luego guardas en MySQL)
  res.status(200).json({ message: "Huella registrada correctamente" });
});

export default router;
