"use client";

import { useState } from "react";
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
  const toggleSolar = useExperienceStore((state) => state.toggleSolar);
  const openSummary = useExperienceStore((state) => state.openSummary);
  const closeSummary = useExperienceStore((state) => state.closeSummary);
  const [handoffOpen, setHandoffOpen] = useState(false);

  const environment = getEnvironment(selectedEnvironment);
  if (!environment || selectedProblems.length === 0) return null;

  const selected = environment.problems.filter((problem) => selectedProblems.includes(problem.id));
  const hasEv = selectedProblems.includes("ev-charging");

  if (!summaryOpen) {
    return (
      <aside className={styles.dock} aria-label="Current MacroPark setup">
        <div>
          <span className={styles.dockEyebrow}>Your setup</span>
          <strong>{selected.length + (solarEnabled ? 1 : 0)} choices added</strong>
        </div>
        <button
          type="button"
          onClick={() => {
            setHandoffOpen(false);
            openSummary();
          }}
        >
          Review setup
          <span aria-hidden="true">→</span>
        </button>
      </aside>
    );
  }

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Your MacroPark configuration">
      <section className={styles.summary}>
        <button
          className={styles.close}
          type="button"
          onClick={() => {
            setHandoffOpen(false);
            closeSummary();
          }}
          aria-label="Close configuration"
        >
          ×
        </button>

        {handoffOpen ? (
          <ConsultationHandoff onBack={() => setHandoffOpen(false)} />
        ) : (
          <>
            <div className={styles.heading}>
              <span>Your MacroPark · {environment.name}</span>
              <h2>Built around what matters to you.</h2>
              <p>
                This is the experience you have shaped so far. Keep refining it, or use it as the starting point for a real installation.
              </p>
            </div>

            <div className={styles.solutionList}>
              {selected.map((problem, index) => (
                <article className={styles.solution} key={problem.id}>
                  <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{problem.resultTitle}</strong>
                    <p>{problem.resultBody}</p>
                  </div>
                  <button type="button" onClick={() => removeProblem(problem.id)} aria-label={`Remove ${problem.label}`}>
                    Remove
                  </button>
                </article>
              ))}
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
                  <strong>{solarEnabled ? "Solar canopy included" : "Add solar canopy"}</strong>
                  <small>Generate energy above the same spaces used for parking and charging.</small>
                </span>
                <span className={styles.toggle} aria-hidden="true"><i /></span>
              </button>
            )}

            <div className={styles.footer}>
              <div>
                <span>Recommended direction</span>
                <strong>{hasEv ? "Connected parking + energy" : "Connected access + parking"}</strong>
              </div>
              <div className={styles.footerActions}>
                <button type="button" onClick={closeSummary}>Keep exploring</button>
                <button className={styles.primaryAction} type="button" onClick={() => setHandoffOpen(true)}>
                  Turn this into a project
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
