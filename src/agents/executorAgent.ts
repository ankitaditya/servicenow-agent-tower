// src/agents/executorAgent.ts
import { Incident } from "../db/incidentRepo";
import { incidentRepo } from "../db/incidentRepo";
import { incidentAgent } from "./incidentAgent";
import { Logger } from "../utils/logger";
import { metrics } from "../utils/metrics";

export const executorAgent = {
  /**
   * Executes a defined action on an incident.
   * @param incident - Incident object
   * @param action - Action to execute (AUTO_REPAIR / ESCALATE)
   */
  async execute(incident: Incident, action: string) {
    Logger.info("[Executor] Starting execution", { incidentId: incident.id, action });

    try {
      // Determine resolution based on action
      const resolution =
        action === "AUTO_REPAIR"
          ? "Rebooted server, restored connectivity"
          : "Escalated to on‑call team";

      // Update incident status in DB
      await incidentRepo.update(incident.id, { status: "resolved" });
      Logger.info("[Executor] Incident status updated", { incidentId: incident.id, status: "resolved" });

      // Sync with ServiceNow
      await incidentAgent.syncWithServiceNow(incident.id, resolution);
      Logger.info("[Executor] ServiceNow sync requested", { incidentId: incident.id });

      // Increment success metrics
      metrics.increment("executor.success", { action, incidentId: incident.id });
    } catch (error: any) {
      // Log error with structured details
      Logger.error("[Executor] Execution failed", { incidentId: incident.id, action, error: error.message });

      // Increment failure metric
      metrics.increment("executor.failed");

      // Optionally: rethrow or handle the error further
      throw error;
    }
  },
};
