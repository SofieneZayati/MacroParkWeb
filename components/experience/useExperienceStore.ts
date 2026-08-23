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

type ExperienceState = {
  phase: ExperiencePhase;
  selectedEnvironment: EnvironmentId | null;
  introComplete: boolean;
  setPhase: (phase: ExperiencePhase) => void;
  chooseEnvironment: (environment: EnvironmentId) => void;
  completeIntro: () => void;
  reset: () => void;
};

export const useExperienceStore = create<ExperienceState>((set) => ({
  phase: "arrival",
  selectedEnvironment: null,
  introComplete: false,
  setPhase: (phase) => set({ phase }),
  chooseEnvironment: (selectedEnvironment) =>
    set({ selectedEnvironment, phase: selectedEnvironment }),
  completeIntro: () => set({ introComplete: true, phase: "choose" }),
  reset: () =>
    set({ phase: "arrival", selectedEnvironment: null, introComplete: false }),
}));
