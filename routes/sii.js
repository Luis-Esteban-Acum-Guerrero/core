import express from "express";
import { addRCVJob, siiQueue } from "../utils/queue.js";
import saveRCV from "../_auto/sii/saveRCV.js";
import setupBrowser from "../_auto/browser.js";
import getInfoTributaria from "../_auto/sii/getInfoTributaria.js";
import getF22 from "../_auto/sii/getF22.js";
import getF29 from "../_auto/sii/getF29.js";
const router = express.Router();

router.get("/jobs/:id", async (req, res) => {
  try {
    const job = await siiQueue.getJob(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    const state = await job.getState();
    const result = job.returnvalue ?? null;
    res.json({
      id: job.id,
      state,
      attemptsMade: job.attemptsMade,
      progress: job.progress,
      failedReason: job.failedReason ?? null,
      result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/queues/status", async (_req, res) => {
  try {
    const counts = await siiQueue.getJobCounts();
    res.json(counts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/getInfoTributaria", async (req, res) => {
  try {
    const items = Array.isArray(req.body)
      ? req.body
      : Array.isArray(req.body.items)
        ? req.body.items
        : [req.body];

    const results = [];
    for (const item of items) {
      const rut = item.rut || req.body.rut;
      const pass = item.pass || item.clave_sii || req.body.pass;
      const idEmpresa = item.idEmpresa || req.body.idEmpresa || null;
      if (!rut || !pass) {
        results.push({
          rut: rut || null,
          idEmpresa,
          error: "rut y pass son requeridos",
        });
        continue;
      }

      const { browser, context, page } = await setupBrowser();
      try {
        const data = await getInfoTributaria(page, { rut, pass });
        results.push({ rut, idEmpresa, data });
      } catch (err) {
        results.push({ rut, idEmpresa, error: err.message });
      } finally {
        await context.close();
        await browser.close();
      }
    }

    const isSingle = !Array.isArray(req.body) && !Array.isArray(req.body.items);
    res.json(isSingle ? results[0] : { status: "completed", results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/getRCV", async (req, res) => {
  try {
    const items = Array.isArray(req.body)
      ? req.body
      : Array.isArray(req.body.items)
        ? req.body.items
        : [req.body];

    const jobs = [];
    for (const item of items) {
      const jobData = {
        rut: item.rut,
        pass: item.pass,
        periodo: item.periodo || req.body.periodo,
        idEmpresa: item.idEmpresa || req.body.idEmpresa,
      };

      const job = await addRCVJob(jobData);
      jobs.push({ jobId: job.id });
    }

    res.json({ status: "queued", jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/saveRCV/:idEmpresa", async (req, res) => {
  try {
    const idEmpresa = req.params.idEmpresa;
    if (!idEmpresa) {
      return res.status(400).json({ error: "idEmpresa is required" });
    }

    const data = Array.isArray(req.body)
      ? req.body
      : Array.isArray(req.body.items)
        ? req.body.items
        : req.body;

    const result = await saveRCV(data, idEmpresa);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/getF22", async (req, res) => {
  try {
    const items = Array.isArray(req.body)
      ? req.body
      : Array.isArray(req.body.items)
        ? req.body.items
        : [req.body];

    const results = [];
    for (const item of items) {
      const rut = item.rut || req.body.rut;
      const pass = item.pass || item.clave_sii || req.body.pass;
      const periodoRaw = item.periodo || req.body.periodo;
      const years = Array.isArray(periodoRaw)
        ? periodoRaw
        : periodoRaw && typeof periodoRaw === "object"
          ? Object.keys(periodoRaw)
          : [];
      if (!rut || !pass) {
        results.push({ rut: rut || null, error: "rut y pass son requeridos" });
        continue;
      }
      if (!years.length) {
        results.push({ rut, error: "periodo (años) es requerido" });
        continue;
      }

      const { browser, context, page } = await setupBrowser();
      try {
        const data = await getF22(page, { rut, pass, periodo: years });
        results.push({ rut, periodo: years, data });
      } catch (err) {
        results.push({ rut, periodo: years, error: err.message });
      } finally {
        await context.close();
        await browser.close();
      }
    }

    const isSingle = !Array.isArray(req.body) && !Array.isArray(req.body.items);
    res.json(isSingle ? results[0] : { status: "completed", results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/getF29", async (req, res) => {
  try {
    const items = Array.isArray(req.body)
      ? req.body
      : Array.isArray(req.body.items)
        ? req.body.items
        : [req.body];

    const results = [];
    for (const item of items) {
      const rut = item.rut || req.body.rut;
      const pass = item.pass || item.clave_sii || req.body.pass;
      const idEmpresa = item.idEmpresa || req.body.idEmpresa || null;
      const periodoRaw = item.periodo || req.body.periodo;
      const isPeriodoObject = periodoRaw && typeof periodoRaw === "object";
      if (!rut || !pass) {
        results.push({
          rut: rut || null,
          idEmpresa,
          error: "rut y pass son requeridos",
        });
        continue;
      }
      if (!isPeriodoObject) {
        results.push({
          rut,
          idEmpresa,
          error: "periodo (años->meses) es requerido",
        });
        continue;
      }

      const { browser, context, page } = await setupBrowser();
      try {
        const data = await getF29(page, { rut, pass, periodo: periodoRaw });
        results.push({ rut, idEmpresa, periodo: periodoRaw, data });
      } catch (err) {
        results.push({
          rut,
          idEmpresa,
          periodo: periodoRaw,
          error: err.message,
        });
      } finally {
        await context.close();
        await browser.close();
      }
    }

    const isSingle = !Array.isArray(req.body) && !Array.isArray(req.body.items);
    res.json(isSingle ? results[0] : { status: "completed", results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
