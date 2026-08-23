"use client";

import { useMemo, useState } from "react";
import { getEnvironment } from "@/lib/experienceContent";
import { useExperienceStore } from "./useExperienceStore";
import styles from "./ConsultationHandoff.module.css";

type ScaleOption = "private" | "small" | "medium" | "large";
type TimingOption = "exploring" | "planning" | "soon" | "upgrade";

const SCALE_LABELS: Record<ScaleOption, string> = {
  private: "1–5 spaces",
  small: "6–30 spaces",
  medium: "31–100 spaces",
  large: "100+ spaces",
};

const TIMING_LABELS: Record<TimingOption, string> = {
  exploring: "Exploring possibilities",
  planning: "Planning a project",
  soon: "Ready to move soon",
  upgrade: "Upgrading an existing parking",
};

export function ConsultationHandoff({ onBack }: { onBack: () => void }) {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblems = useExperienceStore((state) => state.selectedProblems);
  const solarEnabled = useExperienceStore((state) => state.solarEnabled);

  const [location, setLocation] = useState("");
  const [scale, setScale] = useState<ScaleOption>(selectedEnvironment === "home" ? "private" : "small");
  const [timing, setTiming] = useState<TimingOption>("exploring");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const environment = getEnvironment(selectedEnvironment);
  const environmentName = environment?.name ?? "Parking";
  const selected = environment?.problems.filter((problem) => selectedProblems.includes(problem.id)) ?? [];

  const brief = useMemo(() => {
    if (!environment) return "";

    const needs = selected.map((problem) => `- ${problem.label}`).join("\n");

    return [
      "MACROPARK PROJECT BRIEF",
      "",
      `Project type: ${environmentName}`,
      `Location: ${location.trim() || "To be confirmed"}`,
      `Parking scale: ${SCALE_LABELS[scale]}`,
      `Project timing: ${TIMING_LABELS[timing]}`,
      "",
      "What matters:",
      needs || "- To be discussed",
      ...(solarEnabled ? ["- Solar canopy"] : []),
      "",
      `Contact: ${contactName.trim() || "Not provided"}`,
      `Email: ${contactEmail.trim() || "Not provided"}`,
      "",
      "Generated from the MacroPark interactive configurator.",
    ].join("\n");
  }, [contactEmail, contactName, environment, environmentName, location, scale, selected, solarEnabled, timing]);

  if (!environment) return null;

  const configuredRecipient = process.env.NEXT_PUBLIC_MACROPARK_CONTACT_EMAIL?.trim();

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      const area = document.createElement("textarea");
      area.value = brief;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  }

  function contactMacroPark() {
    if (!configuredRecipient) {
      void copyBrief();
      return;
    }

    const subject = encodeURIComponent(`MacroPark project — ${environmentName}${location.trim() ? ` — ${location.trim()}` : ""}`);
    const body = encodeURIComponent(brief);
    window.location.href = `mailto:${configuredRecipient}?subject=${subject}&body=${body}`;
  }

  return (
    <div className={styles.handoff}>
      <button className={styles.back} type="button" onClick={onBack}>
        ← Back to setup
      </button>

      <header className={styles.header}>
        <span>Make it real</span>
        <h2>Tell us just enough to start.</h2>
        <p>
          Your parking needs are already selected. Add a little project context and MacroPark can start from the solution you just built.
        </p>
      </header>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Where is the project?</span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City, residence or project name"
          />
        </label>

        <fieldset className={styles.group}>
          <legend>About how many parking spaces?</legend>
          <div className={styles.options}>
            {(Object.keys(SCALE_LABELS) as ScaleOption[]).map((option) => (
              <button
                type="button"
                key={option}
                className={scale === option ? styles.active : ""}
                onClick={() => setScale(option)}
              >
                {SCALE_LABELS[option]}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.group}>
          <legend>Where are you in the process?</legend>
          <div className={styles.options}>
            {(Object.keys(TIMING_LABELS) as TimingOption[]).map((option) => (
              <button
                type="button"
                key={option}
                className={timing === option ? styles.active : ""}
                onClick={() => setTiming(option)}
              >
                {TIMING_LABELS[option]}
              </button>
            ))}
          </div>
        </fieldset>

        <div className={styles.contactRow}>
          <label className={styles.field}>
            <span>Your name <small>optional</small></span>
            <input value={contactName} onChange={(event) => setContactName(event.target.value)} placeholder="Name" />
          </label>
          <label className={styles.field}>
            <span>Email <small>optional</small></span>
            <input
              type="email"
              value={contactEmail}
              onChange={(event) => setContactEmail(event.target.value)}
              placeholder="you@company.com"
            />
          </label>
        </div>
      </div>

      <div className={styles.briefPreview}>
        <div>
          <span>Project brief ready</span>
          <strong>{environmentName} · {selected.length + (solarEnabled ? 1 : 0)} configured needs</strong>
        </div>
        <button type="button" onClick={copyBrief}>{copied ? "Copied" : "Copy brief"}</button>
      </div>

      <footer className={styles.footer}>
        <p>
          {configuredRecipient
            ? "Your email app will open with this MacroPark brief already filled in."
            : "Contact delivery is not configured yet, so the brief will be copied for you instead."}
        </p>
        <button className={styles.primary} type="button" onClick={contactMacroPark}>
          {configuredRecipient ? "Request a consultation" : copied ? "Brief copied" : "Prepare my project brief"}
          <span aria-hidden="true">→</span>
        </button>
      </footer>
    </div>
  );
}
