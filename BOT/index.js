// +56 9 4650 4484
import {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
} from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";
import { MemoryDB } from "@builderbot/bot";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const BOT_PORT = process.env.PORT || 3003;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// Use gemini-flash-latest as verified by test script
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// Global State for Wait Mode and Blacklist
const globalUserStatus = new Map();

// --- API Helpers ---

const validateClient = async (phone) => {
  try {
    const res = await fetch(`${BACKEND_URL}/bot/cliente/${phone}`);
    if (res.status === 404) return { ok: false, status: 404 };
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, status: 200 };
  } catch (e) {
    console.error("Error validating client:", e);
    return { ok: false, error: true };
  }
};

const createTicket = async (ticketData) => {
  try {
    const res = await fetch(`${BACKEND_URL}/bot/ticket`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketData),
    });
    return res.ok;
  } catch (e) {
    console.error("Error creating ticket:", e);
    return false;
  }
};

// --- Helper: Call Gemini AI (With Retry) ---
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callAI = async (history, retries = 2) => {
  try {
    const systemPrompt = `
    Eres un asistente de soporte técnico TI.
    Tu objetivo principal es recopilar la información básica necesaria para la creación de un ticket de soporte en nuestro sistema interno.
    TODAS tus respuestas deben ser en español.

    Restricciones estrictas:
    •	No entregues explicaciones teóricas, opiniones, recomendaciones generales ni información fuera del contexto de soporte TI.
    •	No incluyas información externa, educativa o no solicitada.
    •	No resuelvas el problema directamente; solo recopila información.
    •	No hagas más de una pregunta a la vez.
    •	Sé breve, claro y concreto.
    •	Limítate exclusivamente a sistemas, software, hardware o servicios TI.

    Debes recopilar la siguiente información básica para la creación del ticket:
    1.	Título del problema (debes elaborarlo con la información entregada por el usuario)
    2.	Descripción del problema (debes elaborarlo con la información entregada por el usuario)
    3.	Datos técnicos (debes elaborarlo con la información entregada por el usuario)
    •	Programa o sistema afectado
    •	Sistema operativo
    •	Versión del sistema operativo
    •	Otros datos técnicos relevantes

    Prioridad:
    Asignarla según el análisis al problema que el usuario indique:
    •	Alta: Problemas graves que afectan la disponibilidad del servicio.
    •	Media: Problemas que no afectan la disponibilidad del servicio.
    •	Baja: Problemas que no son urgentes.

    Realiza las preguntas necesarias para profundizar el problema, tratando de entenderlo hasta completar toda la información necesaria.
    Cuando tengas toda la información, responde exclusivamente con un objeto JSON, sin texto adicional, usando exactamente este formato:

    {
      "titulo": "...",
      "problemaDescrito": "...",
      "resumenEjecutivo": "...",
      "posibleSolucion": "...",
      "requiereConexion": true,
      "prioridad": "...",
      "data": {
        "programa": "...",
        "sistemaOperativo": "...",
        "versionSO": "...",
        "otros": "..."
      }
    }

    Reglas adicionales:
    •	requiereConexion debe ser un valor booleano (true o false).
    •	Si aún no tienes suficiente información, responde solo con texto, haciendo la siguiente pregunta necesaria.
    •	No devuelvas el JSON hasta que toda la información esté completa.
  `;

    // Convert history to Gemini format
    const chatHistory = history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: systemPrompt }] },
        {
          role: "model",
          parts: [{ text: "Entendido. Actuaré como el asistente de soporte." }],
        },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(
      "Por favor, contesta al último mensaje."
    );
    return result.response.text();
  } catch (e) {
    if (e.status === 429 && retries > 0) {
      console.warn(
        `[429 Quota Exceeded] Waiting 10s before retry... (${retries} left)`
      );
      await delay(10000);
      return callAI(history, retries - 1);
    }
    console.error("Gemini Error:", e);
    return "Lo siento, tengo problemas de conexión o cuota. Intenta más tarde.";
  }
};

// --- Helper: Determine Intent (With Retry) ---
const determineIntent = async (message, retries = 2) => {
  try {
    const prompt = `
        Analiza el mensaje del usuario: "${message}"
        Decide si el usuario desea:
        1. "SUPPORT": Crear un ticket, reportar un problema, pedir ayuda, error, bug, falla o saludo general que implique necesidad de asistencia.
        2. "INFO": Información general, horas, dirección, servicios o solo un "hola" sin contexto inmediato de problema.
        Devuelve solo una palabra: "SUPPORT" o "INFO".
        `;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().toUpperCase();
    return text.includes("SUPPORT") ? "SUPPORT" : "INFO";
  } catch (e) {
    if (e.status === 429 && retries > 0) {
      console.warn(
        `[429 Quota Exceeded] Waiting 10s before retry for Intent... (${retries} left)`
      );
      await delay(10000);
      return determineIntent(message, retries - 1);
    }
    console.error("Intent Error:", e);
    return "INFO"; // Fallback
  }
};

// --- Flows ---

// 1. Support Flow (Ticket Creation)
const flowTicket = addKeyword(EVENTS.ACTION).addAnswer(
  "📝  Por favor, describe el problema que estás experimentando.",
  { capture: true },
  async (ctx, { flowDynamic, state, endFlow, fallBack }) => {
    const history = state.get("history") || [];
    history.push({ role: "user", content: ctx.body });

    const aiResponse = await callAI(history);

    // Check for JSON
    let ticketJson = null;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) ticketJson = JSON.parse(jsonMatch[0]);
    } catch (e) {}

    if (ticketJson) {
      const ticketData = {
        fechaInicioContacto: state.get("startTime"),
        fechaInicioTicket: new Date().toISOString(),
        origen: ctx.from,
        ...ticketJson,
      };
      const ok = await createTicket(ticketData);
      if (ok) {
        await flowDynamic(
          "Ticket creado exitosamente. Un agente humano te atenderá pronto."
        );
        globalUserStatus.set(ctx.from, { status: "waiting_human" });
        return endFlow();
      } else {
        await flowDynamic("Hubo un error al crear el ticket.");
        return endFlow();
      }
    }

    history.push({ role: "assistant", content: aiResponse });
    await state.update({ history });
    await flowDynamic(aiResponse);
    return fallBack();
  }
);

// 2. Info Flow
const flowInfo = addKeyword(EVENTS.ACTION).addAnswer(
  "Hola! Soy el asistente de Jelp.\n\n¿Necesitas crear un ticket de soporte?",
  { capture: true },
  async (ctx, { gotoFlow, flowDynamic, state }) => {
    const text = ctx.body.toLowerCase();
    if (
      text.includes("jelp") ||
      text.includes("ticket") ||
      text.includes("ayuda")
    ) {
      await state.update({ startTime: new Date().toISOString(), history: [] });
      return gotoFlow(flowTicket);
    } else {
      await flowDynamic("Entendido. Si necesitas algo más, solo escribe.");
    }
  }
);

// Main Router (Replaces EmployeesClass for Free Tier)
const flowMain = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, { flowDynamic, state, endFlow, gotoFlow }) => {
    console.log(
      `\n--- [New Message] From: ${ctx.from} Body: "${ctx.body}" ---`
    );

    const userStatus = globalUserStatus.get(ctx.from);
    console.log(
      `Step 1: Checking User Status... Current: ${JSON.stringify(userStatus)}`
    );

    // Checks
    if (userStatus?.status === "waiting_human") {
      console.log("-> User is in 'waiting_human' mode. Ignoring message.");
      return endFlow();
    }
    if (userStatus?.status === "blacklisted") {
      if (Date.now() < userStatus.blacklistUntil) {
        console.log("-> User is blacklisted. Ignoring message.");
        return endFlow();
      }
      console.log("-> Blacklist expired. Clearing status.");
      globalUserStatus.delete(ctx.from);
    }

    // Validate
    console.log("Step 2: Validating Client with Backend...");
    const validRes = await validateClient(ctx.from);
    console.log(`-> Validation Result: ${JSON.stringify(validRes)}`);

    if (!validRes.ok) {
      if (validRes.status === 404) {
        console.log(
          "-> Client not found (404). Sending rejection message and blacklisting."
        );
        await flowDynamic("Tu número no está registrado. Visita jelp.cl");
        globalUserStatus.set(ctx.from, {
          status: "blacklisted",
          blacklistUntil: Date.now() + 7200000,
        });
      } else {
        console.log(`-> Validation Error (Status: ${validRes.status}).`);
      }
      return endFlow();
    }

    // Check existing flow state
    const currentHistory = state.get("history");
    console.log(
      `Step 3: Checking Flow State... Existing History: ${
        currentHistory ? currentHistory.length + " messages" : "None"
      }`
    );

    // --- Intelligent Routing with Gemini ---
    console.log("Step 4: Determining Intent with Gemini...");
    const intent = await determineIntent(ctx.body);
    console.log(`-> Determined Intent: "${intent}"`);

    if (intent === "SUPPORT") {
      console.log("-> Routing to SUPPORT flow.");
      await state.update({ startTime: new Date().toISOString(), history: [] });
      return gotoFlow(flowTicket);
    } else {
      console.log("-> Routing to INFO flow.");
      return gotoFlow(flowInfo);
    }
  }
);

const main = async () => {
  const adapterDB = new MemoryDB();
  const adapterFlow = createFlow([flowMain, flowTicket, flowInfo]);

  const adapterProvider = createProvider(BaileysProvider, {
    name: "bot_session_v5",
    version: [2, 3000, 1027934701],
  });

  const configBot = {
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  };

  const { httpServer } = await createBot(configBot);
  const server = httpServer(BOT_PORT);

  // --- External Endpoints ---
  adapterProvider.server.post("/v1/messages", async (req, res) => {
    const { number, message, media } = req.body;
    await adapterProvider.sendMessage(number, message, { media });
    res.end("sent");
  });

  adapterProvider.server.post("/v1/ticket-close", async (req, res) => {
    const { number, agentName } = req.body;
    globalUserStatus.delete(number);
    await adapterProvider.sendMessage(
      number,
      `Ticket cerrado por ${agentName}.`,
      {}
    );
    res.end("closed");
  });

  adapterProvider.server.get("/v1/waiting-users", (req, res) => {
    const waitingUsers = [];
    for (const [phone, data] of globalUserStatus.entries()) {
      if (data.status === "waiting_human") {
        waitingUsers.push(phone);
      }
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ count: waitingUsers.length, users: waitingUsers })
    );
  });

  console.log(`Bot running on port ${BOT_PORT}`);
};

main();
