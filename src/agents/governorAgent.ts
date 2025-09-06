import { Incident } from "../db/incidentRepo";
import { executorAgent } from "./executorAgent";

export const governorAgent = {
  decide(incident: Incident, rootCause: string) {
    console.log("[Governor] Decision for:", incident.id, "Root cause:", rootCause);

    const action =
      rootCause === "Infrastructure Failure" ? "AUTO_REPAIR" : "ESCALATE";

    executorAgent.execute(incident, action);
  },
};