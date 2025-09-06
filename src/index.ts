import express from "express";
import { config } from "./config";
import { startHRMSMonitor } from "./services/hrmsMonitor";
import { startSolarMonitor } from "./services/solarMonitor";
import { startSaaSMonitor } from "./services/saasMonitor";
import { runWorkflow } from "./graph/itomWorkflow";

const app = express();
app.use(express.json());

// Simple health‑check
app.get("/health", (_req, res) => res.send("OK"));

// Endpoint to manually trigger an alert (for demo)
app.post("/alert", async (req, res) => {
  const alert = req.body;
  await watcherAgent.handleAlert(alert);
  res.status(201).send({ status: "received" });
});

app.listen(config.port, () => {
  console.log(`🚀 ITOM Agent listening on http://localhost:${config.port}`);

  // Start monitors
  startHRMSMonitor();
  startSolarMonitor();
  startSaaSMonitor();

  // Kick‑off a one‑time workflow demo
  runWorkflow().catch(console.error);
});