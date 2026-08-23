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
  introComplete: boolean;
  setPhase: (phase: ExperiencePhase) => void;
  chooseEnvironment: (environment: EnvironmentId) => void;
  chooseProblem: (problem: ProblemId) => void;
  clearProblem: () => void;
  backToChooser: () => void;
  completeIntro: () => void;
  reset: () => void;
};

export const useExperienceStore = create<ExperienceState>((set) => ({
  phase: "arrival",
  selectedEnvironment: null,
  selectedProblem: null,
  introComplete: false,
  setPhase: (phase) => set({ phase }),
  chooseEnvironment: (selectedEnvironment) =>
    set({ selectedEnvironment, selectedProblem: null, phase: selectedEnvironment }),
  chooseProblem: (selectedProblem) => set({ selectedProblem }),
  clearProblem: () => set({ selectedProblem: null }),
  backToChooser: () =>
    set({ selectedEnvironment: null, selectedProblem: null, phase: "choose" }),
  completeIntro: () => set({ introComplete: true, phase: "choose" }),
  reset: () =>
    set({
      phase: "arrival",
      selectedEnvironment: null,
      selectedProblem: null,
      introComplete: false,
    }),
}));
