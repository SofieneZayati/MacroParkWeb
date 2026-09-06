"use client";

import { create } from "zustand";

export type ExperiencePhase =
  | "arrival"
  | "scan"
  | "reveal"
  | "choose"
  | "home"
  | "residence"
  | "retail";

export type EnvironmentId = "home" | "residence" | "retail";

export type ProblemId =
  | "automatic-access"
  | "guest-access"
  | "protect-space"
  | "reservations"
  | "parking-guidance"
  | "reduce-queues"
  | "ev-charging";

export type GuestAccessPreview = "active" | "expired";

type EnvironmentConfiguration = {
  selectedProblems: ProblemId[];
  solarEnabled: boolean;
};

type ExperienceState = {
  phase: ExperiencePhase;
  selectedEnvironment: EnvironmentId | null;
  selectedProblem: ProblemId | null;
  selectedProblems: ProblemId[];
  solarEnabled: boolean;
  summaryOpen: boolean;
  introComplete: boolean;
  guestAccessPreview: GuestAccessPreview;
  residenceAccessAuthorized: boolean;
  hoveredEnvironment: EnvironmentId | null;
  configurations: Partial<Record<EnvironmentId, EnvironmentConfiguration>>;
  demoRevision: number;
  setHoveredEnvironment: (environment: EnvironmentId | null) => void;
  replayDemo: () => void;
  setPhase: (phase: ExperiencePhase) => void;
  chooseEnvironment: (environment: EnvironmentId) => void;
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

export const useExperienceStore = create<ExperienceState>((set) => ({
  phase: "arrival",
  selectedEnvironment: null,
  selectedProblem: null,
  selectedProblems: [],
  solarEnabled: false,
  summaryOpen: false,
  introComplete: false,
  guestAccessPreview: "active",
  residenceAccessAuthorized: false,
  hoveredEnvironment: null,
  configurations: {},
  demoRevision: 0,
  setHoveredEnvironment: (hoveredEnvironment) => set({ hoveredEnvironment }),
  replayDemo: () =>
    set((state) => ({
      demoRevision: state.demoRevision + 1,
      guestAccessPreview: "active",
      residenceAccessAuthorized: false,
    })),
  setPhase: (phase) => set({ phase }),
  chooseEnvironment: (selectedEnvironment) =>
    set((state) => {
      const configurations = state.selectedEnvironment
        ? {
            ...state.configurations,
            [state.selectedEnvironment]: {
              selectedProblems: state.selectedProblems,
              solarEnabled: state.solarEnabled,
            },
          }
        : state.configurations;
      const saved = configurations[selectedEnvironment];

      return {
        configurations,
        selectedEnvironment,
        selectedProblem: null,
        selectedProblems: saved?.selectedProblems ?? [],
        solarEnabled: saved?.solarEnabled ?? false,
        summaryOpen: false,
        hoveredEnvironment: null,
        guestAccessPreview: "active",
        residenceAccessAuthorized: false,
        phase: selectedEnvironment,
      };
    }),
  chooseProblem: (selectedProblem) =>
    set((state) => ({
      selectedProblem,
      demoRevision: state.demoRevision + 1,
      selectedProblems: state.selectedProblems.includes(selectedProblem)
        ? state.selectedProblems
        : [...state.selectedProblems, selectedProblem],
      summaryOpen: false,
      guestAccessPreview: "active",
      residenceAccessAuthorized: false,
    })),
  previewProblem: (selectedProblem) =>
    set((state) => ({
      selectedProblem,
      demoRevision: state.demoRevision + 1,
      summaryOpen: false,
      guestAccessPreview: "active",
      residenceAccessAuthorized: false,
    })),
  addProblem: (problem) =>
    set((state) => state.selectedProblems.includes(problem)
      ? state
      : { selectedProblems: [...state.selectedProblems, problem] }),
  clearProblem: () =>
    set({
      selectedProblem: null,
      guestAccessPreview: "active",
      residenceAccessAuthorized: false,
    }),
  removeProblem: (problem) =>
    set((state) => {
      const selectedProblems = state.selectedProblems.filter((item) => item !== problem);
      const evStillSelected = selectedProblems.includes("ev-charging");

      return {
        selectedProblems,
        selectedProblem: state.selectedProblem === problem ? null : state.selectedProblem,
        solarEnabled: evStillSelected ? state.solarEnabled : false,
        guestAccessPreview: "active",
        residenceAccessAuthorized: false,
      };
    }),
  toggleSolar: () =>
    set((state) => ({
      solarEnabled: state.selectedProblems.includes("ev-charging") ? !state.solarEnabled : false,
    })),
  // Keep the preview and its opener mounted while the native modal pauses it.
  openSummary: () => set({ summaryOpen: true }),
  closeSummary: () => set({ summaryOpen: false }),
  backToChooser: () =>
    set((state) => ({
      configurations: state.selectedEnvironment
        ? {
            ...state.configurations,
            [state.selectedEnvironment]: {
              selectedProblems: state.selectedProblems,
              solarEnabled: state.solarEnabled,
            },
          }
        : state.configurations,
      selectedEnvironment: null,
      selectedProblem: null,
      selectedProblems: [],
      solarEnabled: false,
      summaryOpen: false,
      guestAccessPreview: "active",
      residenceAccessAuthorized: false,
      phase: "choose",
      hoveredEnvironment: null,
    })),
  completeIntro: () => set({ introComplete: true, phase: "choose" }),
  setGuestAccessPreview: (guestAccessPreview) => set({ guestAccessPreview }),
  setResidenceAccessAuthorized: (residenceAccessAuthorized) => set({ residenceAccessAuthorized }),
  reset: () =>
    set({
      phase: "arrival",
      selectedEnvironment: null,
      selectedProblem: null,
      selectedProblems: [],
      solarEnabled: false,
      summaryOpen: false,
      introComplete: false,
      guestAccessPreview: "active",
      residenceAccessAuthorized: false,
      hoveredEnvironment: null,
      configurations: {},
      demoRevision: 0,
    }),
}));
