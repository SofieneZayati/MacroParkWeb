"use client";

import { useEffect, useRef, useState } from "react";
import { environments } from "@/lib/experienceContent";
import { useExperienceStore } from "../useExperienceStore";
import { useMotionPreference } from "../useMotionPreference";

type LifecycleOptions = { ready: boolean; unavailable: boolean };

/** Opening and QA navigation are independent of the scene and client controls. */
export function useExperienceLifecycle({ ready, unavailable }: LifecycleOptions) {
  const introComplete = useExperienceStore((state) => state.introComplete);
  const reducedMotion = useMotionPreference();
  const [inspect, setInspect] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    // Strict Mode replays effects; a second solar toggle must not undo QA state.
    if (initialized.current) return;
    initialized.current = true;
    const params = new URLSearchParams(window.location.search);
    setInspect(params.get("perf") === "1");
    if (process.env.NEXT_PUBLIC_VISUAL_QA !== "1") return;

    const store = useExperienceStore.getState();
    if (params.get("qaChooser") === "1") {
      store.completeIntro();
      return;
    }

    const environment = environments.find((item) => item.id === params.get("qaEnvironment"));
    if (!environment) return;
    const problem = environment.problems.find((item) => item.id === params.get("qaProblem"));

    store.completeIntro();
    store.chooseEnvironment(environment.id);
    if (!problem) return;
    if (params.get("qaPreview") === "1") store.previewProblem(problem.id);
    else store.chooseProblem(problem.id);
    if (params.get("qaSolar") === "1" && problem.id === "ev-charging") store.toggleSolar();
    if (environment.id !== "retail" && problem.id === "guest-access" && params.get("qaGuest") === "expired") {
      store.setGuestAccessPreview("expired");
    }
  }, []);

  useEffect(() => {
    if (introComplete || (!ready && !unavailable)) return;
    const store = useExperienceStore.getState();
    // A GPU failure must not send someone who already chose a place back to
    // the chooser. Store navigation may have run earlier in this effect flush.
    if (store.introComplete) return;
    if (unavailable || reducedMotion) {
      store.completeIntro();
      return;
    }

    const scan = window.setTimeout(() => store.setPhase("scan"), 2100);
    const reveal = window.setTimeout(() => store.setPhase("reveal"), 4300);
    const choose = window.setTimeout(() => store.completeIntro(), 6800);
    return () => {
      window.clearTimeout(scan);
      window.clearTimeout(reveal);
      window.clearTimeout(choose);
    };
  }, [introComplete, ready, unavailable, reducedMotion]);

  return { inspect, reducedMotion };
}
