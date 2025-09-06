// src/agents/incidentAgent.ts
import { ServiceNowClient } from "../services/serviceNowAPI";
import { incidentRepo, Incident } from "../db/incidentRepo";
import { Logger } from "../utils/logger";
import { metrics } from "../utils/metrics";

const snClient = new ServiceNowClient();

export const incidentAgent = {
  /**
   * Sync local incident with ServiceNow and log metrics
   * @param incidentId ID of the incident to sync
   * @param resolution Resolution details to include in ticket
   */
  async syncWithServiceNow(incidentId: string, resolution: string) {
    try {
      const incident: Incident | null = await incidentRepo.findById(incidentId);
      if (!incident) {
        Logger.warn("[IncidentAgent] Incident not found", { incidentId });
        metrics.increment("sn.sync.failed");
        return;
      }

      const payload = {
        short_description: incident.title,
        description: `${incident.description}\n\nResolution:\n${resolution}`,
        urgency: "1",
        impact: "2",
      };

      Logger.info("[IncidentAgent] Sending incident to ServiceNow", { incidentId, payload });
      const snInc = await snClient.createIncident(payload);

      Logger.info("[IncidentAgent] ServiceNow ticket created successfully", {
        incidentId,
        ticketNumber: snInc.number,
      });
      metrics.increment("sn.sync.success");

      // Optionally update local incident with ServiceNow ticket info
      await incidentRepo.update(incidentId, { serviceNowTicket: snInc.number, status: "synced" });
    } catch (err: any) {
      Logger.error("[IncidentAgent] Failed to sync incident with ServiceNow", {
        incidentId,
        error: err.stack,
      });
      metrics.increment("sn.sync.failed");
    }
  },
};
