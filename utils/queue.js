import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import setupBrowser from "../bot/browser.js";
import getRCV from "../bot/sii/getRCV.js";
import { randomUUID } from "crypto";

const connection = new IORedis({
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const siiQueue = new Queue("siiQueue", { connection });

export const addRCVJob = async (data) => {
  const id = randomUUID();
  const job = await siiQueue.add("getRCV", data, {
    jobId: id,
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });
  return job;
};

new Worker(
  "siiQueue",
  async (job) => {
    const { rut, pass, periodo, idEmpresa } = job.data || {};
    const { browser, context, page } = await setupBrowser();
    try {
      const result = await getRCV(page, { rut, pass, periodo, idEmpresa });
      return result;
    } finally {
      await context.close();
      await browser.close();
    }
  },
  { connection, concurrency: 6 }
);
