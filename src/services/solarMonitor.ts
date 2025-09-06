import { setIntervalAsync } from "set-interval-async";
import { watcherAgent } from "../agents/watcherAgent";

export function startSolarMonitor() {
  setIntervalAsync(async () => {
    // TODO: Replace with real solar inverter API call
    const fakeAlert = { id: "solar-1", type: "temperature", severity: "warning" };
    watcherAgent.handleAlert(fakeAlert);
  }, 120000); // every 2 minutes
}