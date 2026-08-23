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
  | "parking-guidance"
  | "reduce-queues"
  | "ev-charging";

type ExperienceState = {
  phase: ExperiencePhase;
  selectedEnvironment: EnvironmentId | null;
  selectedProblem: ProblemId | null;
  selectedProblems: ProblemId[];
  solarEnabled: boolean;
  summaryOpen: boolean;
  introComplete: boolean;
  setPhase: (phase: ExperiencePhase) => void;
  chooseEnvironment: (environment: EnvironmentId) => void;
  chooseProblem: (problem: ProblemId) => void;
  clearProblem: () => void;
  removeProblem: (problem: ProblemId) => void;
  toggleSolar: () => void;
  openSummary: () => void;
  closeSummary: () => void;
  backToChooser: () => void;
  completeIntro: () => void;
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
  setPhase: (phase) => set({ phase }),
  chooseEnvironment: (selectedEnvironment) =>
    set({
      selectedEnvironment,
      selectedProblem: null,
      selectedProblems: [],
      solarEnabled: false,
      summaryOpen: false,
      phase: selectedEnvironment,
    }),
  chooseProblem: (selectedProblem) =>
    set((state) => ({
      selectedProblem,
      selectedProblems: state.selectedProblems.includes(selectedProblem)
        ? state.selectedProblems
        : [...state.selectedProblems, selectedProblem],
      summaryOpen: false,
    })),
  clearProblem: () => set({ selectedProblem: null }),
  removeProblem: (problem) =>
    set((state) => {
      const selectedProblems = state.selectedProblems.filter((item) => item !== problem);
      const evStillSelected = selectedProblems.includes("ev-charging");

      return {
        selectedProblems,
        selectedProblem: state.selectedProblem === problem ? null : state.selectedProblem,
        solarEnabled: evStillSelected ? state.solarEnabled : false,
      };
    }),
  toggleSolar: () =>
    set((state) => ({
      solarEnabled: state.selectedProblems.includes("ev-charging") ? !state.solarEnabled : false,
    })),
  openSummary: () => set({ summaryOpen: true, selectedProblem: null }),
  closeSummary: () => set({ summaryOpen: false }),
  backToChooser: () =>
    set({
      selectedEnvironment: null,
      selectedProblem: null,
      selectedProblems: [],
      solarEnabled: false,
      summaryOpen: false,
      phase: "choose",
    }),
  completeIntro: () => set({ introComplete: true, phase: "choose" }),
  reset: () =>
    set({
      phase: "arrival",
      selectedEnvironment: null,
      selectedProblem: null,
      selectedProblems: [],
      solarEnabled: false,
      summaryOpen: false,
      introComplete: false,
    }),
}));
