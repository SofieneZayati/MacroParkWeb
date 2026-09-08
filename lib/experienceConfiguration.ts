import { getProblem } from "./experienceContent";
import type { EnvironmentConfiguration, EnvironmentId, ProblemId } from "./experienceDomain";

export const EMPTY_CONFIGURATION: EnvironmentConfiguration = Object.freeze({
  selectedProblems: Object.freeze([]),
  solarEnabled: false,
});

export function isProblemAvailable(environment: EnvironmentId | null, problem: ProblemId) {
  return getProblem(environment, problem) !== null;
}

/** The same rules apply to stored setups and exported briefs. */
export function normalizeConfiguration(
  environment: EnvironmentId,
  configuration: EnvironmentConfiguration,
): EnvironmentConfiguration {
  const selectedProblems = [...new Set(configuration.selectedProblems)]
    .filter((problem) => isProblemAvailable(environment, problem));

  return Object.freeze({
    selectedProblems: Object.freeze(selectedProblems),
    solarEnabled: configuration.solarEnabled && selectedProblems.includes("ev-charging"),
  });
}
