"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getEnvironment } from "@/lib/experienceContent";
import { useExperienceStore } from "./useExperienceStore";
import styles from "./ConsultationHandoff.module.css";

type ScaleOption = "private" | "small" | "medium" | "large";
type TimingOption = "exploring" | "planning" | "soon" | "upgrade";
type Feedback = "idle" | "copying" | "copied" | "error" | "downloaded";

const SCALE_LABELS: Record<ScaleOption, string> = {
  private: "1–5 spaces",
  small: "6–30 spaces",
  medium: "31–100 spaces",
  large: "101+ spaces",
};

const TIMING_LABELS: Record<TimingOption, string> = {
  exploring: "Exploring possibilities",
  planning: "Planning a project",
  soon: "Ready to move soon",
  upgrade: "Upgrading existing parking",
};

const FEEDBACK_LABELS: Record<Feedback, string> = {
  idle: "",
  copying: "Copying your brief…",
  copied: "Project brief copied. Ready to paste and share.",
  error: "Copy is unavailable. Download your brief, or select the text in the preview below.",
  downloaded: "Download requested. If your browser blocks it, use Copy brief to keep the same details.",
};

export function ConsultationHandoff({ onBack, active = true }: { onBack: () => void; active?: boolean }) {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblems = useExperienceStore((state) => state.selectedProblems);
  const solarEnabled = useExperienceStore((state) => state.solarEnabled);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // The draft stays in memory when reviewing the setup; personal details are never stored locally.
  const [location, setLocation] = useState("");
  const [scale, setScale] = useState<ScaleOption>(selectedEnvironment === "home" ? "private" : "small");
  const [timing, setTiming] = useState<TimingOption>("exploring");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [feedback, setFeedback] = useState<Feedback>("idle");

  const environment = getEnvironment(selectedEnvironment);
  const environmentName = environment?.name ?? "Parking";
  const selected = useMemo(
    () => environment?.problems.filter((problem) => selectedProblems.includes(problem.id)) ?? [],
    [environment, selectedProblems],
  );

  const brief = useMemo(() => {
    if (!environment) return "";

    return [
      "MACROPARK PROJECT BRIEF",
      "",
      `Project type: ${environmentName}`,
      `Location: ${location.trim() || "To be confirmed"}`,
      `Parking scale: ${SCALE_LABELS[scale]}`,
      `Project timing: ${TIMING_LABELS[timing]}`,
      "",
      "Selected solutions:",
      ...selected.map((problem) => `- ${problem.label}\n  ${problem.resultBody}`),
      ...(solarEnabled ? ["- Solar canopy above parking and charging spaces"] : []),
      "",
      `Contact: ${contactName.trim() || "Not provided"}`,
      `Email: ${contactEmail.trim() || "Not provided"}`,
      "",
      "A starting point for consultation. Final design and scope to be confirmed.",
      "Created with the MacroPark interactive experience.",
    ].join("\n");
  }, [contactEmail, contactName, environment, environmentName, location, scale, selected, solarEnabled, timing]);

  useEffect(() => {
    if (active) headingRef.current?.focus({ preventScroll: true });
  }, [active]);

  useEffect(() => {
    setFeedback("idle");
  }, [brief]);

  if (!environment) return null;

  const configuredRecipient = process.env.NEXT_PUBLIC_MACROPARK_CONTACT_EMAIL?.trim();
  const choiceCount = selected.length + (solarEnabled ? 1 : 0);

  async function copyBrief() {
    setFeedback("copying");
    try {
      await navigator.clipboard.writeText(brief);
      setFeedback("copied");
    } catch {
      // Some browsers disallow the Clipboard API. Keep the fallback inside the active dialog.
      const previouslyFocused = document.activeElement;
      const area = document.createElement("textarea");
      area.value = brief;
      area.style.position = "fixed";
      area.style.opacity = "0";
      area.setAttribute("aria-label", "Project brief to copy");
      formRef.current?.appendChild(area);
      area.select();
      try {
        setFeedback(document.execCommand("copy") ? "copied" : "error");
      } catch {
        setFeedback("error");
      } finally {
        area.remove();
        if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus({ preventScroll: true });
      }
    }
  }

  function downloadBrief() {
    const url = URL.createObjectURL(new Blob([brief], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `MacroPark-${selectedEnvironment}-project-brief.txt`;
    formRef.current?.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    setFeedback("downloaded");
  }

  function prepareBrief() {
    if (!configuredRecipient) {
      downloadBrief();
      return;
    }

    const subject = encodeURIComponent(`MacroPark project — ${environmentName}${location.trim() ? ` — ${location.trim()}` : ""}`);
    window.location.href = `mailto:${configuredRecipient}?subject=${subject}&body=${encodeURIComponent(brief)}`;
  }

  return (
    <form
      ref={formRef}
      className={styles.handoff}
      onSubmit={(event) => {
        event.preventDefault();
        prepareBrief();
      }}
    >
      <button className={styles.back} type="button" onClick={onBack}>
        ← Back to setup
      </button>

      <header className={styles.header}>
        <span>{environmentName}</span>
        <h2 ref={headingRef} tabIndex={-1}>Your project brief</h2>
        <p>
          Your selected solutions are included. Add any project details you know, then download or copy your brief.
        </p>
      </header>

      <div className={styles.selectedNeeds} aria-label="Included in your brief">
        <span>{choiceCount} {choiceCount === 1 ? "solution" : "solutions"} included</span>
        {solarEnabled && <span>Solar included</span>}
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Project location <small>optional</small></span>
          <input
            name="project-location"
            autoComplete="off"
            maxLength={160}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City, residence or project name"
          />
        </label>

        <fieldset className={styles.group}>
          <legend>Number of parking spaces</legend>
          <div className={styles.options}>
            {(Object.keys(SCALE_LABELS) as ScaleOption[]).map((option) => (
              <label key={option} className={scale === option ? styles.active : ""}>
                <input type="radio" name="parking-scale" value={option} checked={scale === option} onChange={() => setScale(option)} />
                <span>{SCALE_LABELS[option]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.group}>
          <legend>Project stage</legend>
          <div className={styles.options}>
            {(Object.keys(TIMING_LABELS) as TimingOption[]).map((option) => (
              <label key={option} className={timing === option ? styles.active : ""}>
                <input type="radio" name="project-timing" value={option} checked={timing === option} onChange={() => setTiming(option)} />
                <span>{TIMING_LABELS[option]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.contactRow}>
          <label className={styles.field}>
            <span>Your name <small>optional</small></span>
            <input name="name" autoComplete="name" maxLength={100} value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder="Name" />
          </label>
          <label className={styles.field}>
            <span>Email <small>optional</small></span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={254}
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              placeholder="you@company.com"
            />
          </label>
        </div>
      </div>

      <div className={styles.briefPreview}>
        <div>
          <strong>Save a copy of your brief</strong>
        </div>
        <button type="button" onClick={copyBrief} disabled={feedback === "copying"}>
          {feedback === "copied" ? "Copied ✓" : "Copy brief"}
        </button>
      </div>

      <details className={styles.previewDetails}>
        <summary>Read your brief <span aria-hidden="true">+</span></summary>
        <pre tabIndex={0} aria-label="Full project brief">{brief}</pre>
      </details>
      <p className={styles.feedback} role="status" aria-live="polite">{FEEDBACK_LABELS[feedback]}</p>

      <footer className={styles.footer}>
        <p>
          {configuredRecipient
            ? "The email button opens a draft for you to review and send."
            : "Download or copy this brief to share it with MacroPark. This page does not send your details."}
        </p>
        <div className={styles.footerActions}>
          {configuredRecipient && <button type="button" className={styles.download} onClick={downloadBrief}>Download brief</button>}
          <button className={styles.primary} type="submit">
            {configuredRecipient ? "Open email draft" : "Download brief"}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </footer>
    </form>
  );
}
