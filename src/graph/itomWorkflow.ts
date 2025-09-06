import { AgentState, StateGraph, RunnableConfig } from "@langchain/langgraph";
import { watcherAgent } from "../agents/watcherAgent";
import { investigatorAgent } from "../agents/investigatorAgent";
import { governorAgent } from "../agents/governorAgent";
import { executorAgent } from "../agents/executorAgent";

/**
 * State schema
 */
interface ITOMState extends AgentState {
  alert?: any;
  incidentId?: string;
  rootCause?: string;
  action?: string;
}

/**
 * A super‑simple workflow that chains the four agents
 */
export const itomWorkflow = new StateGraph<ITOMState>();

itomWorkflow
  .addNode("watcher", async (state) => {
    // Normally triggered by an external event, here we fake it
    const fakeAlert = { id: "evt-42", type: "cpu", severity: "warning" };
    watcherAgent.handleAlert(fakeAlert);
    return { ...state, alert: fakeAlert };
  })
  .addNode("investigator", async (state) => {
    investigatorAgent.investigate(state.incidentId!);
    return state;
  })
  .addNode("governor", async (state) => {
    governorAgent.decide(state.incidentId!, state.rootCause!);
    return state;
  })
  .addNode("executor", async (state) => {
    executorAgent.execute(state.incidentId!, state.action!);
    return state;
  })
  .setEntryPoint("watcher")
  .setFinishPoint("executor");

export async function runWorkflow() {
  const cfg: RunnableConfig = { configurable: {} };
  await itomWorkflow.invoke({}, cfg);
}