import { Incident } from "../db/incidentRepo";
import { incidentRepo } from "../db/incidentRepo";
import { incidentAgent } from "./incidentAgent";

export const executorAgent = {
  async execute(incident: Incident, action: string) {
    console.log("[Executor] Executing action:", action, "for", incident.id);

    // Simulate runbook logic
    const resolution = action === "AUTO_REPAIR"
      ? "Rebooted server, restored connectivity"
      : "Escalated to on‑call team";

    // Update incident status
    await incidentRepo.update(incident.id, { status: "resolved" });

    // Notify ServiceNow
    incidentAgent.syncWithServiceNow(incident.id, resolution);
  },
};