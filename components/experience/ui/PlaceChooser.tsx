"use client";

import { environments } from "@/lib/experienceContent";
import { useExperienceStore } from "../useExperienceStore";
import { JourneyIcon } from "./JourneyIcon";
import styles from "./Experience.module.css";

export function PlaceChooser({ unavailable }: { unavailable: boolean }) {
  const hovered = useExperienceStore((s) => s.hoveredEnvironment);
  const setHovered = useExperienceStore((s) => s.setHoveredEnvironment);
  const choose = useExperienceStore((s) => s.chooseEnvironment);
  return <section className={styles.chooser} aria-labelledby="place-title">
    <div className={styles.chooserHeading}>
      <div><span className={styles.eyebrow}>Made for your everyday</span><h1 id="place-title">Better parking.<br /><em>Start with your place.</em></h1></div>
      <p>Explore what could change.<br />Keep the solutions that work for you.</p>
    </div>
    <div className={styles.placeGrid}>
      {environments.map((place) => <button key={place.id} className={styles.placeCard} data-highlighted={hovered === place.id} type="button" onClick={() => choose(place.id)} onPointerEnter={() => setHovered(place.id)} onPointerLeave={() => setHovered(null)} onFocus={() => setHovered(place.id)} onBlur={() => setHovered(null)}>
        <span className={styles.placeIcon}><JourneyIcon name={place.id} size={28} /></span>
        <span><strong>{place.name}</strong><small>{place.hint}</small></span>
        <JourneyIcon name="arrow" size={20} />
      </button>)}
    </div>
    {unavailable && <p className={styles.fallbackNote} role="status">The 3D preview is unavailable here. You can still explore solutions and create your plan.</p>}
  </section>;
}
