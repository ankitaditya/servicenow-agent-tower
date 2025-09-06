import { setIntervalAsync } from "set-interval-async";
import { watcherAgent } from "../agents/watcherAgent";

export function startSaaSMonitor() {
  setIntervalAsync(async () => {
    // TODO: Replace with real SaaS metrics call
    const fakeAlert = { id: "saas-1", type: "service_outage", severity: "critical" };
    watcherAgent.handleAlert(fakeAlert);
  }, 90000); // every 1.5 minutes
}