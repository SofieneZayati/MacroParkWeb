import { normalizeConfiguration } from "./experienceConfiguration";
import { getEnvironment } from "./experienceContent";
import type { EnvironmentConfiguration, EnvironmentId } from "./experienceDomain";

export type ScaleOption = "private" | "small" | "medium" | "large";
export type TimingOption = "exploring" | "planning" | "soon" | "upgrade";

export const SCALE_LABELS: Record<ScaleOption, string> = {
  private: "1–5 spaces",
  small: "6–30 spaces",
  medium: "31–100 spaces",
  large: "101+ spaces",
};

export const TIMING_LABELS: Record<TimingOption, string> = {
  exploring: "Exploring possibilities",
  planning: "Planning a project",
  soon: "Ready to move soon",
  upgrade: "Upgrading existing parking",
};

export type ProjectDetails = {
  location: string;
  scale: ScaleOption;
  timing: TimingOption;
  contactName: string;
  contactEmail: string;
};

/** Plain text is shared unchanged by the preview, clipboard, download, and email draft. */
export function buildProjectBrief(
  environmentId: EnvironmentId | null,
  configuration: EnvironmentConfiguration,
  details: ProjectDetails,
) {
  const environment = getEnvironment(environmentId);
  if (!environment) return "";

  const validConfiguration = normalizeConfiguration(environment.id, configuration);
  const selected = environment.problems.filter((problem) => validConfiguration.selectedProblems.includes(problem.id));

  return [
    "MACROPARK PROJECT BRIEF",
    "",
    `Project type: ${environment.name}`,
    `Location: ${details.location.trim() || "To be confirmed"}`,
    `Parking scale: ${SCALE_LABELS[details.scale]}`,
    `Project timing: ${TIMING_LABELS[details.timing]}`,
    "",
    "Selected solutions:",
    ...selected.map((problem) => `- ${problem.label}\n  ${problem.resultBody}`),
    ...(validConfiguration.solarEnabled ? ["- Solar canopy above parking and charging spaces"] : []),
    "",
    `Contact: ${details.contactName.trim() || "Not provided"}`,
    `Email: ${details.contactEmail.trim() || "Not provided"}`,
    "",
    "A starting point for consultation. Final design and scope to be confirmed.",
    "Created with the MacroPark interactive experience.",
  ].join("\n");
}
