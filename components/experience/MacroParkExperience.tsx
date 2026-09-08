"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { ConfigurationSummary } from "./ConfigurationSummary";
import { useExperienceLifecycle } from "./hooks/useExperienceLifecycle";
import { useExperienceStore } from "./useExperienceStore";
import { ExperienceHeader } from "./ui/ExperienceHeader";
import { OpeningStory } from "./ui/OpeningStory";
import { PlaceChooser } from "./ui/PlaceChooser";
import { SceneControls } from "./ui/SceneControls";
import { SolutionWorkbench } from "./ui/SolutionWorkbench";
import { solutionNames } from "./ui/journeyPresentation";
import styles from "./ui/Experience.module.css";

const ExperienceScene = dynamic(() => import("./scene/ExperienceScene").then((module) => module.ExperienceScene), { ssr: false });

/** Coordinates the journey. GPU lifecycle and client decisions live independently. */
export function MacroParkExperience() {
  const introComplete = useExperienceStore((s) => s.introComplete);
  const environment = useExperienceStore((s) => s.selectedEnvironment);
  const problem = useExperienceStore((s) => s.selectedProblem);
  const demoRevision = useExperienceStore((s) => s.demoRevision);
  const solar = useExperienceStore((s) => s.solarEnabled);
  const summaryOpen = useExperienceStore((s) => s.summaryOpen);
  const replay = useExperienceStore((s) => s.replayDemo);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sceneOnly, setSceneOnly] = useState(false);
  const [quality, setQuality] = useState<"auto" | "smooth">("auto");
  const diagnostics = useRef<HTMLOutputElement>(null);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => { setUnavailable(true); setReady(true); }, []);
  const onInteract = useCallback(() => setPaused(false), []);
  const { inspect, reducedMotion } = useExperienceLifecycle({ ready, unavailable });

  useEffect(() => { setSceneOnly(false); }, [environment, problem]);
  // Display changes can resize the drawing buffer or change camera framing.
  // Resume to render the updated scene even if the previous preview was paused.
  useEffect(() => { setPaused(false); }, [environment, problem, demoRevision, solar, sceneOnly, quality]);
  useEffect(() => {
    const restore = (event: KeyboardEvent) => { if (event.key === "Escape") setSceneOnly(false); };
    window.addEventListener("keydown", restore);
    return () => window.removeEventListener("keydown", restore);
  }, []);
  useEffect(() => {
    if (!summaryOpen && document.activeElement === document.body) document.getElementById("workbench-title")?.focus({ preventScroll: true });
  }, [summaryOpen]);

  return <main className={styles.shell} data-scene-only={sceneOnly} data-unavailable={unavailable}>
    <ExperienceScene className={styles.canvas} paused={paused} sceneOnly={sceneOnly} quality={quality} onReady={onReady} onUnavailable={onUnavailable} inspect={inspect} diagnostics={diagnostics} />
    <div className={styles.vignette} aria-hidden="true" />
    <ExperienceHeader />
    {!introComplete ? <OpeningStory /> : !environment ? <PlaceChooser unavailable={unavailable} /> : <>
      {!sceneOnly && <SolutionWorkbench unavailable={unavailable} onInteract={onInteract} />}
      {!unavailable && <div className={styles.sceneLabel}><span className={styles.statusDot} /><span>{problem ? `Live preview / ${solutionNames[problem]}` : "Explore your place"}</span></div>}
    </>}
    {introComplete && !unavailable && <SceneControls paused={paused} onPause={() => setPaused((value) => !value)} sceneOnly={sceneOnly} onSceneOnly={() => setSceneOnly((value) => !value)} quality={quality} onQuality={setQuality} reducedMotion={reducedMotion} onReplay={() => { onInteract(); replay(); }} />}
    <ConfigurationSummary />
    {inspect && <output ref={diagnostics} className={styles.diagnostics} aria-label="Rendering diagnostics">Preparing the scene…</output>}
    {!ready && <div className={styles.loading} role="status"><span className={styles.loadingMark} /><span>Preparing your arrival</span></div>}
  </main>;
}
