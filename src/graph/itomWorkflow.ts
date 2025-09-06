import { StateGraph, StateGraphArgs } from "@langchain/langgraph";
import { watcherAgent } from "../agents/watcherAgent";
import { investigatorAgent } from "../agents/investigatorAgent";
import { governorAgent } from "../agents/governorAgent";
import { executorAgent } from "../agents/executorAgent";

/** Channels */
type MyChannels = {
  incident: string;
  action: "AUTO_REPAIR" | "ESCALATE";
};

/** Channels definition */
const channels: StateGraphArgs<MyChannels>["channels"] = {
  incident: { value: null, default: () => "" },
  action: { value: null, default: () => "AUTO_REPAIR" },
};

/** Workflow */
export const itomWorkflow = new StateGraph<MyChannels>({ channels });

/** Nodes */
itomWorkflow
  .addNode("watcher", async (state) => {
    const fakeAlert = { id: "evt-42", type: "cpu", severity: "low", source: "watcher", payload: state, receivedAt: new Date() };
    watcherAgent.handleAlert(fakeAlert);
    return { ...state, incident: fakeAlert.id };
  })
  itomWorkflow.addNode("investigator", async (state) => {
    investigatorAgent.investigate(state.incident);
    return state;
  })
  itomWorkflow.addNode("governor", async (state) => {
    governorAgent.decide(state.incident, state.rootCause!);
    return state;
  })
  itomWorkflow.addNode("executor", async (state) => {
    executorAgent.execute(state.incident, state.action!);
    return state;
  })
  itomWorkflow.setEntryPoint("watcher")
  itomWorkflow.setFinishPoint("executor");

/** Run workflow */
export async function runWorkflow() {
  await itomWorkflow.compile().invoke("Check the work")
}