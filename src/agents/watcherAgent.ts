// src/agents/watcherAgent.ts
import { incidentRepo } from "../db/incidentRepo";
import { investigatorAgent } from "./investigatorAgent";
import { Logger } from "../utils/logger";
import { metrics } from "../utils/metrics";

export interface Alert {
  id: string;
  type: string;
  severity: string;
  source: string;
  payload: Record<string, unknown>;
  receivedAt: Date;
}

export const watcherAgent = {
  /**
   * Handle incoming alert events and persist them as incidents.
   * @param alert - Structured alert payload
   */
  async handleAlert(alert: Alert) {
    Logger.info("[Watcher] New alert received", { alertId: alert.id, type: alert.type });

    try {
      // Basic validation
      if (!alert.id || !alert.type) {
        throw new Error("Invalid alert: missing id or type");
      }

      // Persist as a new incident
      const incident = await incidentRepo.create({
        title: `Alert ${alert.id} - ${alert.type}`,
        description: `Source: ${alert.source}\nSeverity: ${alert.severity}\nPayload: ${JSON.stringify(
          alert.payload
        )}\nReceived: ${alert.receivedAt.toISOString()}`,
        status: "open",
      });

      Logger.info("[Watcher] Incident created", { incidentId: incident.id });

      // Metrics tracking
      metrics.increment("alerts.received", { severity: alert.severity });
      metrics.increment("incidents.created");

      // Pass to investigator for root-cause
      await investigatorAgent.investigate(incident);

      return incident;
    } catch (error) {
      Logger.error("[Watcher] Failed to handle alert", {
        error: (error as Error).message,
        stack: (error as Error).stack,
        alertId: alert?.id,
      });

      metrics.increment("alerts.failed");

      throw error; // bubble up for retry / DLQ
    }
  },
};
