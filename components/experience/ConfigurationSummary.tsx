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
  const previewProblem = useExperienceStore((state) => state.previewProblem);
  const toggleSolar = useExperienceStore((state) => state.toggleSolar);
  const openSummary = useExperienceStore((state) => state.openSummary);
  const closeSummary = useExperienceStore((state) => state.closeSummary);
  const clearProblem = useExperienceStore((state) => state.clearProblem);
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
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => {
              setHandoffOpen(false);
              openSummary();
            }}
          >
            My setup <span aria-live="polite">({choiceCount})</span>
          </button>
        </aside>
      )}

      <dialog
        ref={dialogRef}
        className={styles.backdrop}
        aria-label={handoffOpen ? "Your project brief" : "Your selected solutions"}
        onCancel={(event) => {
          event.preventDefault();
          dismiss();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dismiss();
        }}
      >
        <section ref={summaryRef} className={styles.summary}>
          <button className={styles.close} type="button" onClick={dismiss} aria-label="Close setup">
            ×
          </button>

          <div hidden={handoffOpen}>
            <div className={styles.heading}>
              <span>{environment.name}</span>
              <h2 ref={headingRef} tabIndex={-1}>Your selected solutions</h2>
              <p>
                Review what you added, then save it as a project brief.
              </p>
            </div>

            <div className={styles.solutionList} aria-live="polite" aria-relevant="removals">
              {selected.map((problem, index) => (
                <article className={styles.solution} key={problem.id}>
                  <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{problem.label}</strong>
                    <p>{problem.resultBody}</p>
                  </div>
                  <div className={styles.solutionActions}>
                    <button
                      className={styles.previewAction}
                      type="button"
                      onClick={() => {
                        previewProblem(problem.id);
                        dismiss();
                      }}
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
                  <strong>No solutions added yet.</strong>
                  <p>Preview a solution, then add the ones you want.</p>
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
                  <small>Generate solar energy above your charging spaces.</small>
                </span>
                <span className={styles.toggle} aria-hidden="true"><i /></span>
              </button>
            )}

            <div className={styles.footer}>
              <div className={styles.footerActions}>
                {selected.length > 0 && (
                  <button className={styles.primaryAction} type="button" onClick={() => setHandoffOpen(true)}>
                    Create project brief
                    <span aria-hidden="true">→</span>
                  </button>
                )}
                <button ref={exploreRef} type="button" onClick={() => { clearProblem(); dismiss(); }}>Add another solution</button>
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
