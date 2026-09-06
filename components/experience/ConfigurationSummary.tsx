"use client";

import { useEffect, useRef, useState } from "react";
import { getEnvironment } from "@/lib/experienceContent";
import { useExperienceStore } from "./useExperienceStore";
import { ConsultationHandoff } from "./ConsultationHandoff";
import styles from "./ConfigurationSummary.module.css";

export function ConfigurationSummary() {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblems = useExperienceStore((state) => state.selectedProblems);
  const solarEnabled = useExperienceStore((state) => state.solarEnabled);
  const summaryOpen = useExperienceStore((state) => state.summaryOpen);
  const removeProblem = useExperienceStore((state) => state.removeProblem);
  const chooseProblem = useExperienceStore((state) => state.chooseProblem);
  const toggleSolar = useExperienceStore((state) => state.toggleSolar);
  const openSummary = useExperienceStore((state) => state.openSummary);
  const closeSummary = useExperienceStore((state) => state.closeSummary);
  const [handoffOpen, setHandoffOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const exploreRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const environment = getEnvironment(selectedEnvironment);
  const selected = environment?.problems.filter((problem) => selectedProblems.includes(problem.id)) ?? [];
  const hasEv = selectedProblems.includes("ev-charging");
  const choiceCount = selected.length + (solarEnabled ? 1 : 0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (summaryOpen && !dialog.open) {
      // The native modal keeps the world inert and restores its opener's focus.
      dialog.showModal();
      headingRef.current?.focus({ preventScroll: true });
    } else if (!summaryOpen && dialog.open) {
      dialog.close();
    }

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [summaryOpen, selectedEnvironment]);

  useEffect(() => {
    if (summaryOpen && summaryRef.current) summaryRef.current.scrollTop = 0;
  }, [summaryOpen, handoffOpen]);

  function dismiss() {
    closeSummary();
    setHandoffOpen(false);
  }

  if (!environment) return null;

  return (
    <>
      {selected.length > 0 && (
        <aside className={styles.dock} aria-label="Current MacroPark setup">
          <div>
            <span className={styles.dockEyebrow}>Your setup · {environment.eyebrow}</span>
            <strong aria-live="polite">{choiceCount} {choiceCount === 1 ? "choice" : "choices"} added</strong>
          </div>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => {
              setHandoffOpen(false);
              openSummary();
            }}
          >
            Review setup
            <span aria-hidden="true">→</span>
          </button>
        </aside>
      )}

      <dialog
        ref={dialogRef}
        className={styles.backdrop}
        aria-label={handoffOpen ? "Your MacroPark project brief" : "Your MacroPark configuration"}
        onCancel={(event) => {
          event.preventDefault();
          dismiss();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dismiss();
        }}
      >
        <section ref={summaryRef} className={styles.summary}>
          <button className={styles.close} type="button" onClick={dismiss} aria-label="Close configuration">
            ×
          </button>

          <div hidden={handoffOpen}>
            <div className={styles.heading}>
              <span>Your MacroPark · {environment.name}</span>
              <h2 ref={headingRef} tabIndex={-1}>Built around you.</h2>
              <p>
                One place. Your priorities. Preview any part of your setup, keep refining it, or turn it into a project brief.
              </p>
            </div>

            <div className={styles.solutionList} aria-live="polite" aria-relevant="removals">
              {selected.map((problem, index) => (
                <article className={styles.solution} key={problem.id}>
                  <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{problem.resultTitle}</strong>
                    <p>{problem.resultBody}</p>
                  </div>
                  <div className={styles.solutionActions}>
                    <button
                      className={styles.previewAction}
                      type="button"
                      onClick={() => chooseProblem(problem.id)}
                      aria-label={`Preview ${problem.label}`}
                    >
                      <span aria-hidden="true">▷</span> Preview
                    </button>
                    <button
                      type="button"
                      onClick={(event) => {
                        const next = event.currentTarget.closest("article")?.nextElementSibling?.querySelector("button");
                        removeProblem(problem.id);
                        requestAnimationFrame(() => (next ?? exploreRef.current)?.focus());
                      }}
                      aria-label={`Remove ${problem.label}`}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
              {selected.length === 0 && (
                <div className={styles.emptyState}>
                  <strong>A fresh start for your space.</strong>
                  <p>Choose a need in the experience to begin building your setup.</p>
                </div>
              )}
            </div>

            {hasEv && (
              <button
                type="button"
                className={`${styles.solarOption} ${solarEnabled ? styles.solarActive : ""}`}
                onClick={toggleSolar}
                aria-pressed={solarEnabled}
              >
                <span className={styles.solarIcon} aria-hidden="true">☀</span>
                <span>
                  <strong>{solarEnabled ? "Solar canopy included" : "Add a solar canopy"}</strong>
                  <small>Generate energy above the same spaces used for parking and charging.</small>
                </span>
                <span className={styles.toggle} aria-hidden="true"><i /></span>
              </button>
            )}

            <div className={styles.footer}>
              {selected.length > 0 && (
                <div>
                  <span>Your direction</span>
                  <strong>{hasEv ? "Connected parking + energy" : "Connected access + parking"}</strong>
                </div>
              )}
              <div className={styles.footerActions}>
                <button ref={exploreRef} type="button" onClick={dismiss}>Keep exploring</button>
                {selected.length > 0 && (
                  <button className={styles.primaryAction} type="button" onClick={() => setHandoffOpen(true)}>
                    Turn this into a project
                    <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div hidden={!handoffOpen}>
            <ConsultationHandoff
              key={environment.id}
              active={handoffOpen && summaryOpen}
              onBack={() => {
                setHandoffOpen(false);
                requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
              }}
            />
          </div>
        </section>
      </dialog>
    </>
  );
}
