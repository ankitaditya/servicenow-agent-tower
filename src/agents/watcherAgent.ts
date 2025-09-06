import { Incident } from "../db/incidentRepo";
import { incidentRepo } from "../db/incidentRepo";
import { investigatorAgent } from "./investigatorAgent";

export const watcherAgent = {
  async handleAlert(alert: any) {
    console.log("[Watcher] New alert received:", alert);

    // Persist as a new incident
    const incident = await incidentRepo.create({
      title: `Alert ${alert.id}`,
      description: `${alert.type} at ${new Date()}`,
      status: "open",
    });

    // Pass to investigator for root‑cause
    investigatorAgent.investigate(incident);
  },
};