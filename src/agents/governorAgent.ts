// src/agents/governorAgent.ts
import { Incident } from "../db/incidentRepo";
import { executorAgent } from "./executorAgent";
import { metrics } from "../utils/metrics";
import { Logger } from "../utils/logger";

export const governorAgent = {
  /**
   * Decide the next action based on incident root cause
   * @param incident The incident to act on
   * @param rootCause Root cause determined by Investigator
   */
  async decide(incident: Incident, rootCause: string) {
    Logger.info(`[Governor] Evaluating incident ${incident.id}`, {
      incidentId: incident.id,
      rootCause,
    });

    // Define mapping of root cause to action
    const actionMap: Record<string, string> = {
      "Infrastructure Failure": "AUTO_REPAIR",
      "User Error": "ESCALATE",
      "Security Breach": "IMMEDIATE_ALERT",
    };

    const action = actionMap[rootCause] ?? "ESCALATE";

    Logger.info(`[Governor] Decided action for incident ${incident.id}: ${action}`, {
      action,
      rootCause,
      incidentId: incident.id,
    });

    // Increment a metric for governor decisions
    metrics.increment("governor.decisions", { action, rootCause });

    try {
      await executorAgent.execute(incident, action);
      Logger.info(`[Governor] Action executed successfully for incident ${incident.id}`, {
        incidentId: incident.id,
        action,
      });
    } catch (err) {
      Logger.error(`[Governor] Failed to execute action for incident ${incident.id}`, {
        incidentId: incident.id,
        action,
        error: err,
      });
      metrics.increment("executor.failed");
    }
  },
};
