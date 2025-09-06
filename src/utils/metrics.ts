// src/utils/metrics.ts
import client from "prom-client";

const register = new client.Registry();

// --- Define counters with proper label typing ---

const alertsReceived = new client.Counter<string>({
  name: "alerts_received_total",
  help: "Total number of alerts received by Watcher Agent",
  labelNames: ["severity"],
});

const incidentsCreated = new client.Counter({
  name: "incidents_created_total",
  help: "Total number of incidents created",
});

const alertsFailed = new client.Counter({
  name: "alerts_failed_total",
  help: "Total number of alerts failed to process",
});

const snSyncFailed = new client.Counter({
  name: "sn_sync_failed_total",
  help: "Total number of ServiceNow sync failures",
});

const snSyncSuccess = new client.Counter({
  name: "sn_sync_success_total",
  help: "Total number of successful ServiceNow syncs",
});

const governorDecisions = new client.Counter<string>({
  name: "governor_decisions_total",
  help: "Total number of decisions made by Governor Agent",
  labelNames: ["action"],
});

const executorFailed = new client.Counter({
  name: "executor_failed_total",
  help: "Total number of failed executor actions",
});

const executorSuccess = new client.Counter<string>({
  name: "executor_success_total",
  help: "Total number of successful executor actions",
  labelNames: ["action", "incidentId"],
});

// --- Register metrics ---
[
  alertsReceived,
  incidentsCreated,
  alertsFailed,
  snSyncFailed,
  snSyncSuccess,
  governorDecisions,
  executorFailed,
  executorSuccess,
].forEach((metric) => register.registerMetric(metric));

// --- Export increment function ---
export const metrics = {
  increment: (
    metric:
      | "alerts.received"
      | "incidents.created"
      | "alerts.failed"
      | "sn.sync.failed"
      | "sn.sync.success"
      | "governor.decisions"
      | "executor.failed"
      | "executor.success",
    labels?: Record<string, string>
  ) => {
    switch (metric) {
      case "alerts.received":
        alertsReceived.inc(labels as { severity: string } ?? { severity: "unknown" }, 1);
        break;
      case "incidents.created":
        incidentsCreated.inc(1);
        break;
      case "alerts.failed":
        alertsFailed.inc(1);
        break;
      case "sn.sync.failed":
        snSyncFailed.inc(1);
        break;
      case "sn.sync.success":
        snSyncSuccess.inc(1);
        break;
      case "governor.decisions":
        governorDecisions.inc(labels as { action: string } ?? { action: "unknown" }, 1);
        break;
      case "executor.failed":
        executorFailed.inc(1);
        break;
      case "executor.success":
        executorSuccess.inc(
          labels as { action: string; incidentId: string } ?? { action: "unknown", incidentId: "unknown" },
          1
        );
        break;
    }
  },
  register,
};
