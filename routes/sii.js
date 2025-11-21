import express from "express";
import { addRCVJob, siiQueue } from "../utils/queue.js";
import saveRCV from "../bot/sii/saveRCV.js";
const router = express.Router();

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

export default router;
