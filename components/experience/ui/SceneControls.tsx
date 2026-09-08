"use client";

import { useEffect, useRef } from "react";
import { useExperienceStore } from "../useExperienceStore";
import { JourneyIcon } from "./JourneyIcon";
import styles from "./Experience.module.css";

type Props = {
  paused: boolean; onPause: () => void;
  sceneOnly: boolean; onSceneOnly: () => void;
  quality: "auto" | "smooth"; onQuality: (value: "auto" | "smooth") => void;
  reducedMotion: boolean; onReplay: () => void;
};

export function SceneControls({ paused, onPause, sceneOnly, onSceneOnly, quality, onQuality, reducedMotion, onReplay }: Props) {
  const place = useExperienceStore((s) => s.selectedEnvironment);
  const problem = useExperienceStore((s) => s.selectedProblem);
  const settings = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape" && settings.current?.open) {
        settings.current.open = false;
        settings.current.querySelector("summary")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  useEffect(() => { if (settings.current) settings.current.open = false; }, [place, problem]);

  return <div className={styles.sceneControls} aria-label="Preview controls">
    {problem && <button type="button" onClick={onReplay}><JourneyIcon name="play" size={15} /><span>Replay</span></button>}
    {!reducedMotion && <button type="button" onClick={onPause} aria-pressed={paused} aria-label={paused ? "Resume animation" : "Pause animation"}><JourneyIcon name={paused ? "play" : "pause"} size={15} /></button>}
    {place && <button type="button" onClick={onSceneOnly} aria-pressed={sceneOnly}><JourneyIcon name="expand" size={15} /><span>{sceneOnly ? "Show choices" : "Full scene"}</span></button>}
    <details ref={settings} className={styles.sceneSettings}>
      <summary aria-label="View settings"><JourneyIcon name="settings" size={17} /></summary>
      <div><label htmlFor="scene-quality">Scene quality</label><select id="scene-quality" value={quality} onChange={(event) => onQuality(event.target.value as Props["quality"])}><option value="auto">Automatic</option><option value="smooth">Lighter graphics</option></select><p>Use lighter graphics if the animation feels slow.</p></div>
    </details>
  </div>;
}
