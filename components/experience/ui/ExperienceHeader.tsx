"use client";

import { useExperienceStore } from "../useExperienceStore";
import { JourneyIcon } from "./JourneyIcon";
import styles from "./Experience.module.css";

export function ExperienceHeader() {
  const environment = useExperienceStore((s) => s.selectedEnvironment);
  const introComplete = useExperienceStore((s) => s.introComplete);
  const summaryOpen = useExperienceStore((s) => s.summaryOpen);
  const count = useExperienceStore((s) => s.selectedProblems.length);
  const openSummary = useExperienceStore((s) => s.openSummary);
  const current = summaryOpen ? 3 : environment ? 2 : 1;

  return <header className={styles.header}>
    <div className={styles.brand}><span className={styles.brandMark} aria-hidden="true" />MacroPark<span className={styles.brandNote}>A better way to arrive.</span></div>
    {introComplete && <>
      <ol className={styles.progress} aria-label="Your parking plan">
        {["Your place", "Explore", "Your plan"].map((step, i) => <li key={step} aria-current={current === i + 1 ? "step" : undefined} data-complete={current > i + 1}><span>{current > i + 1 ? <JourneyIcon name="check" size={12} /> : `0${i + 1}`}</span>{step}</li>)}
      </ol>
      {environment && <button className={styles.planButton} type="button" disabled={!count} onClick={openSummary} aria-haspopup="dialog">Your plan <span>{count}</span></button>}
    </>}
  </header>;
}
