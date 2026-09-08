"use client";

import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { ScenePolish } from "../ScenePolish";
import { SceneRuntime } from "../SceneRuntime";
import { SolutionEffects } from "../SolutionEffects";
import { WorldScene } from "../WorldScene";
import { useExperienceStore } from "../useExperienceStore";
import { useMotionPreference } from "../useMotionPreference";

export type SceneQuality = "auto" | "smooth";

type ExperienceSceneProps = {
  paused: boolean;
  sceneOnly: boolean;
  quality: SceneQuality;
  onReady: () => void;
  onUnavailable: () => void;
  inspect: boolean;
  diagnostics: RefObject<HTMLOutputElement | null>;
  className?: string;
};

/** The rendering boundary. Client choices stay usable if WebGL cannot start. */
export function ExperienceScene({
  paused,
  sceneOnly,
  quality,
  onReady,
  onUnavailable,
  inspect,
  diagnostics,
  className,
}: ExperienceSceneProps) {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const summaryOpen = useExperienceStore((state) => state.summaryOpen);
  const reducedMotion = useMotionPreference();
  const [capability, setCapability] = useState<"checking" | "ready" | "unavailable">("checking");
  const [pageHidden, setPageHidden] = useState(false);
  const [renderDpr, setRenderDpr] = useState(1);
  const [shadowsEnabled, setShadowsEnabled] = useState(true);
  const [contextElement, setContextElement] = useState<HTMLCanvasElement | null>(null);
  const didProbe = useRef(false);
  const didReportFailure = useRef(false);

  const reportUnavailable = useCallback(() => {
    if (didReportFailure.current) return;
    didReportFailure.current = true;
    setCapability("unavailable");
    onUnavailable();
  }, [onUnavailable]);

  useEffect(() => {
    if (didProbe.current) return;
    didProbe.current = true;
    const forcedFallback = process.env.NEXT_PUBLIC_VISUAL_QA === "1"
      && new URLSearchParams(window.location.search).get("qaNoWebGL") === "1";

    if (forcedFallback) {
      reportUnavailable();
      return;
    }

    try {
      const probe = document.createElement("canvas").getContext("webgl2");
      const supported = probe !== null;
      probe?.getExtension("WEBGL_lose_context")?.loseContext();
      if (supported) setCapability("ready");
      else reportUnavailable();
    } catch {
      reportUnavailable();
    }
  }, [reportUnavailable]);

  useEffect(() => {
    const updateVisibility = () => setPageHidden(document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    if (window.innerWidth <= 760) {
      setRenderDpr(0.8);
      setShadowsEnabled(false);
    }
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!contextElement) return;
    contextElement.addEventListener("webglcontextlost", reportUnavailable, { once: true });
    return () => contextElement.removeEventListener("webglcontextlost", reportUnavailable);
  }, [contextElement, reportUnavailable]);

  useEffect(() => {
    if (capability === "unavailable" && inspect && diagnostics.current) {
      diagnostics.current.textContent = "3D rendering unavailable";
    }
  }, [capability, inspect, diagnostics]);

  const renderingPaused = paused || pageHidden || summaryOpen;
  const useShadows = shadowsEnabled && quality === "auto" && selectedEnvironment !== null;
  const fallback = <div className={`${className ?? ""} webgl-fallback`} data-scene-state="unavailable" aria-hidden="true" />;

  if (capability === "unavailable") return fallback;
  if (capability === "checking") return null;

  return (
    <SceneBoundary onUnavailable={reportUnavailable} fallback={fallback}>
      <Canvas
        className={className}
        dpr={quality === "smooth" ? 0.75 : renderDpr}
        shadows={useShadows ? "basic" : false}
        camera={{ position: [0, 3.1, 14], fov: 42, near: 0.1, far: 120 }}
        gl={{ antialias: false, alpha: false, stencil: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => setContextElement(gl.domElement)}
        fallback={<span>Explore MacroPark using the parking choices.</span>}
      >
        {!renderingPaused && !reducedMotion && quality === "auto" && (
          <PerformanceMonitor
            factor={0.5}
            step={0.15}
            // Drei counts healthy incline samples as flips too. A finite cap
            // would eventually force low resolution even on a fast GPU.
            flipflops={Infinity}
            bounds={(refreshRate) => refreshRate > 90 ? [48, 78] : [42, 58]}
            onChange={({ factor }) => {
              setRenderDpr(Math.round((0.75 + factor * 0.35) * 100) / 100);
              if (factor < 0.35) setShadowsEnabled(false);
            }}
          />
        )}
        <Suspense fallback={null}>
          <WorldScene />
          <SolutionEffects />
          <ScenePolish />
          <SceneRuntime
            paused={renderingPaused}
            reducedMotion={reducedMotion}
            onReady={onReady}
            diagnostics={diagnostics}
            inspect={inspect}
            reservePanel={selectedEnvironment !== null && !sceneOnly}
          />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}

class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode; onUnavailable: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onUnavailable(); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
