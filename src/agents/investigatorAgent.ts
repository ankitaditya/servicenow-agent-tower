import { Incident } from "../db/incidentRepo";
import { governorAgent } from "./governorAgent";
import { executorAgent } from "./executorAgent";

export const investigatorAgent = {
  async investigate(incident: Incident) {
    console.log("[Investigator] Analyzing incident:", incident.id);

    // Dummy root‑cause logic – replace with ML / rule engine
    const rootCause = incident.title.includes("critical")
      ? "Infrastructure Failure"
      : "User Error";

    // Update incident with root cause
    await incidentRepo.update(incident.id, { description: `${incident.description}\nRoot cause: ${rootCause}` });

    // Pass to governor for decision
    governorAgent.decide(incident, rootCause);
  },
};