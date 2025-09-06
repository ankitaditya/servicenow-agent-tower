import { setIntervalAsync } from "set-interval-async";
import { watcherAgent } from "../agents/watcherAgent";

export function startHRMSMonitor() {
  setIntervalAsync(async () => {
    // TODO: Replace with real HRMS API call
    const fakeAlert = { id: "hrms-1", type: "user_login", severity: "info" };
    watcherAgent.handleAlert(fakeAlert);
  }, 60000); // every minute
}