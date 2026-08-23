"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { WorldScene } from "./WorldScene";
import { SolutionEffects } from "./SolutionEffects";
import { ScenePolish } from "./ScenePolish";
import { ConfigurationSummary } from "./ConfigurationSummary";
import { useExperienceStore } from "./useExperienceStore";
import { environments, getEnvironment, getProblem } from "@/lib/experienceContent";

export function MacroParkExperience() {
  const {
    phase,
    introComplete,
    selectedEnvironment,
    selectedProblem,
    selectedProblems,
    setPhase,
    completeIntro,
    chooseEnvironment,
    chooseProblem,
    clearProblem,
    backToChooser,
  } = useExperienceStore();

  const environment = getEnvironment(selectedEnvironment);
  const problem = getProblem(selectedEnvironment, selectedProblem);

  useEffect(() => {
    if (introComplete) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      completeIntro();
      return;
    }

    const scan = window.setTimeout(() => setPhase("scan"), 2100);
    const reveal = window.setTimeout(() => setPhase("reveal"), 4300);
    const choose = window.setTimeout(() => completeIntro(), 6800);

    return () => {
      window.clearTimeout(scan);
      window.clearTimeout(reveal);
      window.clearTimeout(choose);
    };
  }, [completeIntro, introComplete, setPhase]);

  return (
    <main className="experience-shell">
      <Canvas
        className="experience-canvas"
        dpr={[1, 1.7]}
        shadows
        camera={{ position: [0, 3.1, 14], fov: 42, near: 0.1, far: 120 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        fallback={
          <div className="webgl-fallback">
            <span>MacroPark</span>
            <strong>Parking should just happen.</strong>
            <p>
              This browser cannot show the interactive 3D experience, but you can still explore the
              parking solutions below.
            </p>
          </div>
        }
      >
        <Suspense fallback={null}>
          <WorldScene />
          <SolutionEffects />
          <ScenePolish />
          <Preload all />
        </Suspense>
      </Canvas>

      <div className="experience-vignette" />

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span>MacroPark</span>
        </div>
        <span className="topbar-note">Parking that adapts to you</span>
      </header>

      <ConfigurationSummary />

      <section className="hud" aria-live="polite">
        {phase === "arrival" && !introComplete && (
          <div className="hero-copy fade-in">
            <span className="hero-kicker">A quieter arrival</span>
            <h1 className="hero-title">
              Parking should <em>just happen.</em>
            </h1>
            <p className="hero-description">
              No searching for remotes. No unnecessary stops. Arrive, be recognized and keep moving.
            </p>
          </div>
        )}

        {phase === "scan" && !introComplete && (
          <div className="status-pill fade-in">
            <span className="status-dot" />
            Vehicle recognized · access ready
          </div>
        )}

        {phase === "reveal" && !introComplete && (
          <div className="hero-copy fade-in">
            <span className="hero-kicker">One idea, many places</span>
            <h1 className="hero-title">Make parking fit the place.</h1>
            <p className="hero-description">
              Homes, residences and busy commercial spaces need different things. Start with yours.
            </p>
          </div>
        )}

        {!introComplete && (
          <button className="skip-button" type="button" onClick={completeIntro}>
            Skip intro
          </button>
        )}

        {phase === "choose" && (
          <div className="chooser fade-in">
            <div className="chooser-heading">
              <span>Start with your world</span>
              <h1>Where should parking feel smarter?</h1>
            </div>
            <div className="environment-grid">
              {environments.map((item) => (
                <button
                  className="environment-card"
                  type="button"
                  key={item.id}
                  onClick={() => chooseEnvironment(item.id)}
                >
                  <span className="environment-index">{item.index}</span>
                  <span className="environment-name">{item.name}</span>
                  <span className="environment-hint">{item.hint}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {environment && phase !== "choose" && (
          <>
            <button className="back-button" type="button" onClick={backToChooser}>
              ← Change place
            </button>

            <div className="solution-panel fade-in" key={`${environment.id}-${problem?.id ?? "question"}`}>
              <span className="solution-eyebrow">{problem ? "MacroPark response" : environment.eyebrow}</span>
              <h2>{problem ? problem.resultTitle : environment.question}</h2>
              <p>{problem ? problem.resultBody : environment.description}</p>

              {!problem ? (
                <div className="problem-list">
                  {environment.problems.map((item) => {
                    const configured = selectedProblems.includes(item.id);

                    return (
                      <button
                        className="problem-button"
                        type="button"
                        key={item.id}
                        aria-pressed={configured}
                        onClick={() => chooseProblem(item.id)}
                      >
                        {configured ? `✓ ${item.label}` : item.label}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="problem-list">
                  <button className="problem-button" type="button" onClick={clearProblem}>
                    Add another need
                  </button>
                </div>
              )}
            </div>

            <div className="corner-caption">Interactive concept · Phase 1</div>
          </>
        )}
      </section>
    </main>
  );
}
