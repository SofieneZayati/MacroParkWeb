"use client";

import { create } from "zustand";
import { isEnvironmentId } from "@/lib/experienceContent";
import { EMPTY_CONFIGURATION, isProblemAvailable, normalizeConfiguration } from "@/lib/experienceConfiguration";
import type {
  Configurations,
  EnvironmentConfiguration,
  EnvironmentId,
  ExperiencePhase,
  GuestAccessPreview,
  ProblemId,
} from "@/lib/experienceDomain";

// Compatibility for scene components; domain modules import from lib/experienceDomain directly.
export type { EnvironmentId, ExperiencePhase, GuestAccessPreview, ProblemId } from "@/lib/experienceDomain";

type ExperienceState = {
  phase: ExperiencePhase;
  selectedEnvironment: EnvironmentId | null;
  selectedProblem: ProblemId | null;
  /** Read-only projections of the active entry in configurations. */
  selectedProblems: readonly ProblemId[];
  solarEnabled: boolean;
  configurations: Configurations;
  summaryOpen: boolean;
  introComplete: boolean;
  guestAccessPreview: GuestAccessPreview;
  residenceAccessAuthorized: boolean;
  hoveredEnvironment: EnvironmentId | null;
  demoRevision: number;
  setHoveredEnvironment: (environment: EnvironmentId | null) => void;
  replayDemo: () => void;
  setPhase: (phase: ExperiencePhase) => void;
  chooseEnvironment: (environment: EnvironmentId) => void;
  /** Preview and include together; retained for deterministic scene QA links. */
  chooseProblem: (problem: ProblemId) => void;
  previewProblem: (problem: ProblemId) => void;
  addProblem: (problem: ProblemId) => void;
  clearProblem: () => void;
  removeProblem: (problem: ProblemId) => void;
  toggleSolar: () => void;
  openSummary: () => void;
  closeSummary: () => void;
  backToChooser: () => void;
  completeIntro: () => void;
  setGuestAccessPreview: (preview: GuestAccessPreview) => void;
  setResidenceAccessAuthorized: (authorized: boolean) => void;
  reset: () => void;
};

const idlePreview = {
  selectedProblem: null,
  guestAccessPreview: "active" as const,
  residenceAccessAuthorized: false,
};

function activeConfiguration(configurations: Configurations, environment: EnvironmentId | null) {
  const active = (environment && configurations[environment]) || EMPTY_CONFIGURATION;
  return {
    configurations,
    selectedProblems: active.selectedProblems,
    solarEnabled: active.solarEnabled,
  };
}

/** All setup writes pass through one boundary; the active projection never goes stale. */
function updateConfiguration(
  state: ExperienceState,
  update: (configuration: EnvironmentConfiguration) => EnvironmentConfiguration,
) {
  const environment = state.selectedEnvironment;
  if (!environment) return state;
  const current = state.configurations[environment] ?? EMPTY_CONFIGURATION;
  const next = update(current);
  if (next === current) return state;
  const configurations = {
    ...state.configurations,
    [environment]: normalizeConfiguration(environment, next),
  };
  return activeConfiguration(configurations, environment);
}

function preview(state: ExperienceState, selectedProblem: ProblemId) {
  return {
    ...idlePreview,
    selectedProblem,
    demoRevision: state.demoRevision + 1,
    summaryOpen: false,
  };
}

function initialState() {
  return {
    ...idlePreview,
    ...activeConfiguration({}, null),
    phase: "arrival" as const,
    selectedEnvironment: null,
    summaryOpen: false,
    introComplete: false,
    hoveredEnvironment: null,
    demoRevision: 0,
  };
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  ...initialState(),
  setHoveredEnvironment: (hoveredEnvironment) => set({ hoveredEnvironment }),
  replayDemo: () =>
    set((state) => state.selectedProblem ? preview(state, state.selectedProblem) : state),
  setPhase: (phase) => set({ phase }),
  chooseEnvironment: (selectedEnvironment) =>
    set((state) => isEnvironmentId(selectedEnvironment) ? {
      ...idlePreview,
      ...activeConfiguration(state.configurations, selectedEnvironment),
      selectedEnvironment,
      summaryOpen: false,
      hoveredEnvironment: null,
      phase: selectedEnvironment,
    } : state),
  chooseProblem: (problem) =>
    set((state) => {
      if (!isProblemAvailable(state.selectedEnvironment, problem)) return state;
      return {
        ...updateConfiguration(state, (configuration) => configuration.selectedProblems.includes(problem)
          ? configuration
          : { ...configuration, selectedProblems: [...configuration.selectedProblems, problem] }),
        ...preview(state, problem),
      };
    }),
  previewProblem: (problem) =>
    set((state) => isProblemAvailable(state.selectedEnvironment, problem) ? preview(state, problem) : state),
  addProblem: (problem) =>
    set((state) => isProblemAvailable(state.selectedEnvironment, problem)
      ? updateConfiguration(state, (configuration) => configuration.selectedProblems.includes(problem)
        ? configuration
        : { ...configuration, selectedProblems: [...configuration.selectedProblems, problem] })
      : state),
  clearProblem: () => set(idlePreview),
  removeProblem: (problem) =>
    set((state) => updateConfiguration(state, (configuration) => configuration.selectedProblems.includes(problem)
      ? { ...configuration, selectedProblems: configuration.selectedProblems.filter((item) => item !== problem) }
      : configuration)),
  toggleSolar: () =>
    set((state) => updateConfiguration(state, (configuration) => configuration.selectedProblems.includes("ev-charging")
      ? { ...configuration, solarEnabled: !configuration.solarEnabled }
      : configuration)),
  // The native modal leaves the active preview mounted and resumes it on dismissal.
  openSummary: () => set((state) => state.selectedEnvironment ? { summaryOpen: true } : state),
  closeSummary: () => set({ summaryOpen: false }),
  backToChooser: () =>
    set((state) => ({
      ...idlePreview,
      ...activeConfiguration(state.configurations, null),
      selectedEnvironment: null,
      summaryOpen: false,
      phase: "choose",
      hoveredEnvironment: null,
    })),
  completeIntro: () => set({ introComplete: true, phase: "choose" }),
  setGuestAccessPreview: (guestAccessPreview) => set({ guestAccessPreview }),
  setResidenceAccessAuthorized: (residenceAccessAuthorized) => set({ residenceAccessAuthorized }),
  reset: () => set(initialState()),
}));
