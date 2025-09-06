import { ServiceNowClient } from "../services/serviceNowAPI";
import { incidentRepo } from "../db/incidentRepo";

const snClient = new ServiceNowClient();

export const incidentAgent = {
  async syncWithServiceNow(incidentId: string, resolution: string) {
    const incident = await incidentRepo.findById(incidentId);
    if (!incident) return;

    const payload = {
      short_description: incident.title,
      description: incident.description + "\n\nResolution:\n" + resolution,
      urgency: "1",
      impact: "2",
    };

    // Create ServiceNow incident
    const snInc = await snClient.createIncident(payload);
    console.log("[IncidentAgent] Created ServiceNow ticket:", snInc.number);
  },
};