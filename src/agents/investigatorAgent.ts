// src/agents/investigatorAgent.ts
import { incidentRepo, Incident } from "../db/incidentRepo";
import { governorAgent } from "./governorAgent";
import { Logger } from "../utils/logger";
import { metrics } from "../utils/metrics";

export const investigatorAgent = {
  /**
   * Analyze the incident and identify root cause
   * @param incident Incident object from DB
   */
  async investigate(incident: Incident) {
    try {
      Logger.info("[Investigator] Starting investigation", { incidentId: incident.id });
      metrics.increment("alerts.received"); // counting received incidents for monitoring

      // ===== ROOT-CAUSE LOGIC (replace with ML/rule engine later) =====
      let rootCause: string;
      if (incident.title.toLowerCase().includes("critical")) {
        rootCause = "Infrastructure Failure";
      } else if (incident.title.toLowerCase().includes("warning")) {
        rootCause = "Configuration Issue";
      } else {
        rootCause = "User Error";
      }
      Logger.debug("[Investigator] Root cause identified", { incidentId: incident.id, rootCause });

      // ===== UPDATE INCIDENT =====
      await incidentRepo.update(incident.id, {
        description: `${incident.description}\nRoot cause: ${rootCause}`,
        status: "investigated",
        rootCause,
      });
      metrics.increment("incidents.created"); // metric for incidents updated/processed

      // ===== PASS TO GOVERNOR FOR DECISION =====
      await governorAgent.decide(incident, rootCause);
      Logger.info("[Investigator] Incident passed to Governor", { incidentId: incident.id });
    } catch (err: any) {
      Logger.error("[Investigator] Failed to investigate incident", { incidentId: incident.id, error: err.stack });
      metrics.increment("alerts.failed");
    }
  },
};
