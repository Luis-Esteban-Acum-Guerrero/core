import express from "express";

import rateLimit from "express-rate-limit";
import helmet from "helmet";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import crypto from "crypto";

import auth from "./middleware/auth.js";

import siiRoutes from "./routes/sii.js";
import botRoutes from "./routes/bot.js";
import jelpRoutes from "./routes/jelp.js";

dotenv.config();
const app = express();

app.use(helmet());
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
  }),
);

app.use(bodyParser.json());

// ============================
// Session store (in-memory)
// ============================
global.sessions = new Map();

// Limpieza automática de sesiones
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of global.sessions.entries()) {
    if (session.expires < now) {
      global.sessions.delete(token);
    }
  }
}, 60 * 1000);

// ### token required
app.use("/sii", auth, siiRoutes);

// ### no token required
app.use("/bot", botRoutes);
app.use("/jelp", jelpRoutes);

app.get("/ping", (req, res) => res.send("pong 🏓"));

app.post("/APIsession", (req, res) => {
  const token = crypto.randomBytes(32).toString("hex");

  global.sessions.set(token, {
    created: Date.now(),
    expires: Date.now() + 5 * 60 * 1000,
    ip: req.ip,
  });

  res.json({
    token,
    expires: 300,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));

/**
 * ! DEBUG
 * hacer debug con el RUT 76252332-9, tiene un alert, posterior al login
 */
