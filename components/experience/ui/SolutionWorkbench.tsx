"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import { getEnvironment, getProblem } from "@/lib/experienceContent";
import { useExperienceStore, type ProblemId } from "../useExperienceStore";
import { JourneyIcon } from "./JourneyIcon";
import { solutionNames } from "./journeyPresentation";
import styles from "./Experience.module.css";

export function SolutionWorkbench({ unavailable, onInteract }: { unavailable: boolean; onInteract: () => void }) {
  const environmentId = useExperienceStore((s) => s.selectedEnvironment);
  const problemId = useExperienceStore((s) => s.selectedProblem);
  const included = useExperienceStore((s) => s.selectedProblems);
  const solar = useExperienceStore((s) => s.solarEnabled);
  const guest = useExperienceStore((s) => s.guestAccessPreview);
  const preview = useExperienceStore((s) => s.previewProblem);
  const add = useExperienceStore((s) => s.addProblem);
  const remove = useExperienceStore((s) => s.removeProblem);
  const toggleSolar = useExperienceStore((s) => s.toggleSolar);
  const setGuest = useExperienceStore((s) => s.setGuestAccessPreview);
  const changePlace = useExperienceStore((s) => s.backToChooser);
  const openPlan = useExperienceStore((s) => s.openSummary);
  const title = useRef<HTMLHeadingElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const place = getEnvironment(environmentId);
  const problem = getProblem(environmentId, problemId);
  const isIncluded = !!problem && included.includes(problem.id);

  useEffect(() => { title.current?.focus({ preventScroll: true }); }, [environmentId]);
  useEffect(() => {
    if (detail.current) detail.current.scrollTop = 0;
    if (!problemId) return;
    const revealActiveTab = () => document.getElementById(`need-${problemId}`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
    revealActiveTab();
    window.addEventListener("resize", revealActiveTab);
    return () => window.removeEventListener("resize", revealActiveTab);
  }, [problemId]);
  if (!place) return null;

  function select(id: ProblemId) { onInteract(); preview(id); }
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!place) return;
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % place.problems.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index + place.problems.length - 1) % place.problems.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = place.problems.length - 1;
    else return;
    event.preventDefault();
    select(place.problems[next].id);
    const tab = document.getElementById(`need-${place.problems[next].id}`);
    tab?.focus({ preventScroll: true });
    tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  return <section className={styles.workbench} aria-labelledby="workbench-title">
    <div className={styles.placeContext}>
      <JourneyIcon name={place.id} size={26} />
      <div><span>Your place</span><strong>{place.name}</strong></div>
      <button type="button" onClick={changePlace}>Change</button>
    </div>
    <div className={styles.workbenchIntro}><h1 id="workbench-title" ref={title} tabIndex={-1}>What should be easier?</h1><p>Choose a need. See what changes.</p></div>
    <div className={styles.solutionGrid} role="tablist" aria-label="Explore parking solutions">
      {place.problems.map((item, i) => <button key={item.id} id={`need-${item.id}`} className={styles.solutionTab} type="button" role="tab" aria-selected={item.id === problemId} aria-controls="solution-preview" tabIndex={item.id === problemId || (!problemId && i === 0) ? 0 : -1} onClick={() => select(item.id)} onKeyDown={(event) => navigate(event, i)}>
        <JourneyIcon name={item.id} size={21} /><span>{solutionNames[item.id]}</span>
        {included.includes(item.id) && <span className={styles.includedMark}><JourneyIcon name="check" size={13} /><span className="sr-only">Included in your plan</span></span>}
      </button>)}
    </div>

    <div ref={detail} className={styles.previewScroll}>
      <div id="solution-preview" className={styles.previewDetail} role="tabpanel" aria-labelledby={problem ? `need-${problem.id}` : undefined} aria-label={problem ? undefined : "Solution preview"} tabIndex={0}>
        {problem ? <>
          <div className={styles.detailCopy} key={problem.id}>
            <span className={styles.eyebrow}>{unavailable ? "How it works" : "See it in action"}</span>
            <h2>{problem.label}</h2><p>{problem.resultBody}</p>
          </div>
          <div className={styles.decision}>
            <button className={styles.primaryButton} type="button" onClick={isIncluded ? openPlan : () => { onInteract(); add(problem.id); }}>{isIncluded ? "Review your plan" : "Add to your plan"}<JourneyIcon name={isIncluded ? "arrow" : "check"} size={19} /></button>
            <div className={styles.selectionStatus} aria-live="polite">
              {isIncluded ? <><span><JourneyIcon name="check" size={14} /> Included in your plan</span><button type="button" onClick={() => { onInteract(); remove(problem.id); }}>Remove</button></> : <span>Preview freely. Only add what you need.</span>}
            </div>
          </div>
          {problem.id === "ev-charging" && isIncluded && <button className={styles.solarOption} type="button" aria-pressed={solar} onClick={() => { onInteract(); toggleSolar(); }}><span className={styles.sunIcon} aria-hidden="true">☼</span><span><strong>Add solar above your parking</strong><small>{solar ? "Solar canopy included" : "Optional · generate your own energy"}</small></span><span className={styles.switch} aria-hidden="true"><i /></span></button>}
          {problem.id === "guest-access" && <details className={styles.tryDetail}>
            <summary>Try a guest’s arrival <span aria-hidden="true">＋</span></summary>
            <div className={styles.guestToggle} aria-label="Guest access preview">
              <button type="button" aria-pressed={guest === "active"} onClick={() => { onInteract(); setGuest("active"); }}>During the visit</button>
              <button type="button" aria-pressed={guest === "expired"} onClick={() => { onInteract(); setGuest("expired"); }}>After the visit</button>
            </div>
            <p>{guest === "active" ? "Your guest is expected. Access is allowed." : "The visit has ended. Access stays closed."}</p>
          </details>}
        </> : <div className={styles.emptyPreview}>
          <span className={styles.emptyPreviewIcon}><JourneyIcon name="play" size={25} /></span>
          <h2>Your parking, with possibilities.</h2><p>Pick a need above to watch MacroPark solve it. You can combine several solutions in one plan.</p>
          {included.length > 0 && <button className={styles.primaryButton} type="button" onClick={openPlan}>Review your saved plan <JourneyIcon name="arrow" size={19} /></button>}
        </div>}
      </div>
      {unavailable && <p className={styles.fallbackNote}>3D preview unavailable. Your plan still works.</p>}
    </div>
    <div className={styles.workbenchFoot}><span className={styles.statusDot} /> {included.length ? `${included.length} solution${included.length === 1 ? "" : "s"} in your plan` : "Your plan starts with what matters to you"}</div>
  </section>;
}
