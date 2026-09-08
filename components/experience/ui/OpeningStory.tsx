"use client";

import { useExperienceStore } from "../useExperienceStore";
import { JourneyIcon } from "./JourneyIcon";
import styles from "./Experience.module.css";

export function OpeningStory() {
  const phase = useExperienceStore((s) => s.phase);
  const complete = useExperienceStore((s) => s.completeIntro);
  return <section className={styles.opening} aria-label="Welcome to MacroPark">
    <div className={styles.openingCopy} key={phase}>
      <span className={styles.eyebrow}>{phase === "scan" ? "Recognized. Ready. Welcome." : "Parking that adapts to you"}</span>
      <h1>{phase === "reveal" ? <>Every place.<br /><em>Its own possibilities.</em></> : <>Just arrive.<br /><em>We’ll take it from here.</em></>}</h1>
      <p>{phase === "reveal" ? "A home, a shared residence, or a busy destination. Discover what fits yours." : "An easier way to enter, park, welcome guests, and charge."}</p>
    </div>
    <button className={styles.startButton} type="button" onClick={complete}>Explore your parking <JourneyIcon name="arrow" size={20} /></button>
  </section>;
}
