"use client";

import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { WorldScene } from "./WorldScene";
import { SolutionEffects } from "./SolutionEffects";
import { ScenePolish } from "./ScenePolish";
import { ConfigurationSummary } from "./ConfigurationSummary";
import { SceneRuntime } from "./SceneRuntime";
import { useMotionPreference } from "./useMotionPreference";
import {
  type EnvironmentId,
  type ProblemId,
  useExperienceStore,
} from "./useExperienceStore";
import {
  environments,
  getEnvironment,
  getProblem,
  getRecommendedProblem,
} from "@/lib/experienceContent";

export function MacroParkExperience() {
  const {
    phase,
    introComplete,
    selectedEnvironment,
    selectedProblem,
    selectedProblems,
    guestAccessPreview,
    solarEnabled,
    summaryOpen,
    hoveredEnvironment,
    setHoveredEnvironment,
    replayDemo,
    openSummary,
    setPhase,
    completeIntro,
    chooseEnvironment,
    chooseProblem,
    clearProblem,
    toggleSolar,
    backToChooser,
    setGuestAccessPreview,
  } = useExperienceStore();

  const [renderDpr, setRenderDpr] = useState(1);
  const [shadowsEnabled, setShadowsEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [canRender, setCanRender] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [paused, setPaused] = useState(false);
  const [sceneOnly, setSceneOnly] = useState(false);
  const [quality, setQuality] = useState("auto");
  const [inspect, setInspect] = useState(false);
  const reducedMotion = useMotionPreference();
  const diagnostics = useRef<HTMLOutputElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const onReady = useCallback(() => setReady(true), []);
  const onUnavailable = useCallback(() => {
    setUnavailable(true);
    setReady(true);
    useExperienceStore.getState().completeIntro();
  }, []);

  const environment = getEnvironment(selectedEnvironment);
  const problem = getProblem(selectedEnvironment, selectedProblem);
  const recommendation = getRecommendedProblem(
    selectedEnvironment,
    selectedProblem,
    selectedProblems,
  );
  const showingGuestAccess =
    (selectedEnvironment === "home" || selectedEnvironment === "residence") &&
    selectedProblem === "guest-access";

  useEffect(() => {
    const forcedFallback = process.env.NEXT_PUBLIC_VISUAL_QA === "1" && new URLSearchParams(window.location.search).get("qaNoWebGL") === "1";
    let supported = false;
    try {
      const probe = document.createElement("canvas").getContext("webgl2");
      supported = probe !== null && !forcedFallback;
      probe?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { /* The consultation remains usable without a GPU context. */ }
    if (supported) setCanRender(true);
    else onUnavailable();
  }, [onUnavailable]);

  useEffect(() => {
    setInspect(new URLSearchParams(window.location.search).get("perf") === "1");
    const visibility = () => setPageHidden(document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    if (window.innerWidth <= 760) {
      setRenderDpr(0.8);
      setShadowsEnabled(false);
    }
    return () => document.removeEventListener("visibilitychange", visibility);
  }, []);

  useEffect(() => {
    setSceneOnly(false);
    setPaused(false);
    if (selectedEnvironment) heading.current?.focus({ preventScroll: true });
  }, [selectedEnvironment, selectedProblem]);

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSceneOnly(false);
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, []);

  useEffect(() => {
    if (introComplete || !ready) return;

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
  }, [completeIntro, introComplete, setPhase, ready, reducedMotion]);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_VISUAL_QA !== "1") return;

    const params = new URLSearchParams(window.location.search);

    if (params.get("qaChooser") === "1") {
      completeIntro();
      return;
    }

    const environmentParam = params.get("qaEnvironment");
    const problemParam = params.get("qaProblem");
    const wantsSolar = params.get("qaSolar") === "1";
    const guestPreviewParam = params.get("qaGuest");

    const validEnvironment = environments.find((item) => item.id === environmentParam);
    if (!validEnvironment) return;

    const environmentId = validEnvironment.id as EnvironmentId;
    const validProblem = problemParam
      ? validEnvironment.problems.find((item) => item.id === problemParam)
      : null;

    completeIntro();
    chooseEnvironment(environmentId);

    if (validProblem) {
      chooseProblem(validProblem.id as ProblemId);
      if (wantsSolar && validProblem.id === "ev-charging") toggleSolar();
      if (
        (environmentId === "home" || environmentId === "residence") &&
        validProblem.id === "guest-access" &&
        guestPreviewParam === "expired"
      ) {
        setGuestAccessPreview("expired");
      }
    }
  }, [
    chooseEnvironment,
    chooseProblem,
    completeIntro,
    setGuestAccessPreview,
    toggleSolar,
  ]);

  const useShadows = shadowsEnabled && quality !== "smooth" && selectedEnvironment !== null;

  return (
    <main className={`experience-shell${sceneOnly ? " scene-only" : ""}${unavailable ? " scene-unavailable" : ""}`}>
      <SceneBoundary onUnavailable={onUnavailable}>
      {unavailable ? <SceneFallback /> : canRender && <Canvas
        className="experience-canvas"
        dpr={quality === "smooth" ? 0.75 : renderDpr}
        shadows={useShadows ? "basic" : false}
        camera={{ position: [0, 3.1, 14], fov: 42, near: 0.1, far: 120 }}
        gl={{
          antialias: false,
          alpha: false,
          stencil: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", onUnavailable, { once: true });
        }}
        fallback={<p>Explore MacroPark parking solutions using the choices below.</p>}
      >
        {!paused && !pageHidden && !summaryOpen && !reducedMotion && <PerformanceMonitor
          factor={0.5}
          step={0.15}
          // Drei counts every incline/decline as a flip, including healthy
          // samples. A finite cap permanently degraded even a fast GPU.
          flipflops={Infinity}
          bounds={(refreshRate) => (refreshRate > 90 ? [48, 78] : [42, 58])}
          onChange={({ factor }) => {
            const nextDpr = Math.round((0.75 + factor * 0.35) * 100) / 100;
            setRenderDpr(nextDpr);
            if (factor < 0.35) setShadowsEnabled(false);
          }}
        />}
        <Suspense fallback={null}>
          <WorldScene />
          <SolutionEffects />
          <ScenePolish />
          <SceneRuntime
            paused={paused || pageHidden || summaryOpen}
            reducedMotion={reducedMotion}
            onReady={onReady}
            diagnostics={diagnostics}
            inspect={inspect}
            reservePanel={environment !== null && !sceneOnly}
          />
        </Suspense>
      </Canvas>}
      </SceneBoundary>

      {!ready && <div className="scene-loading" role="status"><span className="loading-mark" /><span>Preparing your arrival</span></div>}

      <div className="experience-vignette" />

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span>MacroPark</span>
        </div>
        <span className="topbar-note">Parking that adapts to you</span>
      </header>

      <ConfigurationSummary />

      {introComplete && (
        <div className="experience-controls" aria-label="Experience controls">
          {!unavailable && <>
            <label className="quality-control"><span className="sr-only">Render quality</span>
              <select aria-label="Render quality" value={quality} onChange={(event) => setQuality(event.target.value)}>
                <option value="auto">Adaptive quality</option>
                <option value="smooth">Smoother motion</option>
              </select>
            </label>
            {!reducedMotion && <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? "Resume motion" : "Pause motion"}</button>}
            {environment && <button type="button" aria-pressed={sceneOnly} onClick={() => setSceneOnly(!sceneOnly)}>{sceneOnly ? "Show choices" : "Explore the view"}</button>}
          </>}
        </div>
      )}
      {inspect && <output ref={diagnostics} className="performance-readout" aria-label="Rendering diagnostics">Collecting rendering sample…</output>}

      <section className="hud" aria-label="Build your parking solution">
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
          <div className="chooser">
            <div className="fade-in">
              <div className="chooser-heading">
                <span>01 / Your place</span>
                <h1>Where should parking feel smarter?</h1>
                <p>{unavailable ? "Choose a place and build your setup." : "Choose a place. See what changes."}</p>
                {unavailable && <p className="fallback-notice" role="status">3D preview unavailable in this browser.</p>}
              </div>
              <div className="environment-grid">
                {environments.map((item) => (
                  <button
                    className={`environment-card${hoveredEnvironment === item.id ? " is-highlighted" : ""}`}
                    type="button"
                    key={item.id}
                    onClick={() => chooseEnvironment(item.id)}
                    onPointerEnter={() => setHoveredEnvironment(item.id)}
                    onPointerLeave={() => setHoveredEnvironment(null)}
                    onFocus={() => setHoveredEnvironment(item.id)}
                    onBlur={() => setHoveredEnvironment(null)}
                  >
                    <span className="environment-index">{item.index}</span>
                    <PlaceIcon place={item.id} />
                    <span className="environment-name">{item.name}</span>
                    <span className="environment-hint">{item.hint}</span>
                    <span className="environment-arrow" aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {environment && phase !== "choose" && (
          <>
            <button className="back-button" type="button" onClick={backToChooser}>
              ← Change place
            </button>

            <nav className="journey-trail" aria-label="Your progress">
              <button type="button" onClick={backToChooser}>01 <span>Your place</span></button>
              <span aria-hidden="true">/</span>
              <button type="button" onClick={clearProblem} aria-current={!problem ? "step" : undefined}>02 <span>Your needs</span></button>
              <span aria-hidden="true">/</span>
              <button type="button" onClick={openSummary} disabled={selectedProblems.length === 0}>03 <span>Your MacroPark</span></button>
            </nav>

            <div className="solution-panel fade-in" key={`${environment.id}-${problem?.id ?? "question"}`}>
              <span className="solution-eyebrow">{environment.eyebrow} <span aria-hidden="true">/</span> {problem ? "Made easier" : "Made for you"}</span>
              <h2 ref={heading} tabIndex={-1}>{problem ? problem.resultTitle : environment.question}</h2>
              <p>{problem ? problem.resultBody : environment.description}</p>
              {unavailable && <p className="fallback-notice">3D preview unavailable. You can still prepare your project brief.</p>}

              {problem && <div className="demo-toolbar">
                <span className="added-to-setup"><span aria-hidden="true">✓</span> Added to your setup</span>
                {!unavailable && <button type="button" onClick={() => { setPaused(false); replayDemo(); }}>↻ Replay</button>}
              </div>}

              {selectedProblem === "ev-charging" && <button className="inline-solar" type="button" aria-pressed={solarEnabled} onClick={() => { setPaused(false); toggleSolar(); }}>
                <span className="solar-glyph" aria-hidden="true">☼</span>
                <span><strong>{solarEnabled ? "Powered by the sun" : "What if parking made energy?"}</strong><small>{solarEnabled ? "Solar canopy added · tap to remove" : "Add a solar canopy and see the connection"}</small></span>
                <span className="solar-switch" aria-hidden="true" />
              </button>}

              {showingGuestAccess && (
                <div className={`guest-access-preview guest-access-preview-${guestAccessPreview}`}>
                  <div className="guest-access-state">
                    <span className="guest-access-dot" aria-hidden="true" />
                    <strong>
                      {guestAccessPreview === "active"
                        ? "Temporary access · active for this visit"
                        : "Access window ended · entrance stays closed"}
                    </strong>
                  </div>
                  <div className="guest-access-toggle" aria-label="Guest access demonstration">
                    <button
                      type="button"
                      aria-pressed={guestAccessPreview === "active"}
                      onClick={() => { setPaused(false); setGuestAccessPreview("active"); }}
                    >
                      Guest expected
                    </button>
                    <button
                      type="button"
                      aria-pressed={guestAccessPreview === "expired"}
                      onClick={() => { setPaused(false); setGuestAccessPreview("expired"); }}
                    >
                      After visit
                    </button>
                  </div>
                </div>
              )}

              {!problem ? (
                <div className="problem-list">
                  <span className="needs-hint">Choose one to see it in action. You can combine needs.</span>
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
                <div className="response-actions">
                  {recommendation && (
                    <button
                      className="recommendation-button"
                      type="button"
                      onClick={() => chooseProblem(recommendation.id)}
                    >
                      <span>Recommended next</span>
                      <strong>{recommendation.label}</strong>
                      <i aria-hidden="true">→</i>
                    </button>
                  )}
                  {!recommendation && <button className="complete-setup" type="button" onClick={openSummary}>Your setup is ready to explore <span aria-hidden="true">→</span></button>}
                  <button className="secondary-action" type="button" onClick={clearProblem}>
                    See all needs
                  </button>
                </div>
              )}
            </div>

            <div className="corner-caption"><span className="status-dot" /> {environment.eyebrow} <span>Built around your everyday</span></div>
          </>
        )}
      </section>
    </main>
  );
}

function PlaceIcon({ place }: { place: EnvironmentId }) {
  return <svg className="place-icon" width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    {place === "home" ? <><path d="M4 15 16 5l12 10M7 13v14h18V13M12 27V17h8v10" /><path d="M20 8V5h4v6" /></> : place === "residence" ? <><path d="M5 27V5h13v22M18 12h9v15M2 27h28M9 10h5m-5 5h5m-5 5h5m8-3h2m-2 5h2" /></> : <><path d="M4 13h24v14H4zM2 13l4-7h20l4 7M8 6l-2 7m8-7-1 7m5-7 1 7m5-7 2 7M12 27v-9h8v9" /></>}
  </svg>;
}

class SceneBoundary extends Component<{ children: ReactNode; onUnavailable: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? <SceneFallback /> : this.props.children; }
}

function SceneFallback() {
  return <div className="webgl-fallback" aria-hidden="true" />;
}
