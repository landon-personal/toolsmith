import type { EvalRun } from "../types.js";

export function formatProviderMetadata(run: EvalRun): string {
  const provider = run.provider ?? { name: run.agent.name, model: run.agent.model };
  return provider.model ? `${provider.name} (${provider.model})` : provider.name;
}
