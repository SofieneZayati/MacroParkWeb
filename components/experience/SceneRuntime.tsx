"use client";

import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "three";

type Props = {
  paused: boolean;
  reducedMotion: boolean;
  onReady: () => void;
  diagnostics: RefObject<HTMLOutputElement | null>;
  inspect: boolean;
  reservePanel: boolean;
};

/** Stop rendering behind dialogs/hidden tabs; inspect only when ?perf=1 is requested. */
export function SceneRuntime({ paused, reducedMotion, onReady, diagnostics, inspect, reservePanel }: Props) {
  const setFrameloop = useThree((state) => state.setFrameloop);
  const invalidate = useThree((state) => state.invalidate);
  const clock = useThree((state) => state.clock);
  const get = useThree((state) => state.get);
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const ready = useRef(false);
  const elapsed = useRef(0);
  const samples = useRef<number[]>([]);
  const rendererName = useRef("");

  // Compose into the unobstructed part of the screen without changing the
  // physical story camera or shrinking the touch/keyboard controls.
  useLayoutEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    if (reservePanel) {
      const landscape = size.width > size.height && size.height <= 500;
      const mobile = size.width <= 760 && !landscape;
      camera.setViewOffset(size.width, size.height, mobile ? 0 : size.width * 0.14,
        mobile ? size.height * 0.2 : 0, size.width, size.height);
    } else {
      camera.clearViewOffset();
    }
    invalidate();
  }, [camera, size.width, size.height, reservePanel, invalidate]);

  useEffect(() => {
    const sceneTime = clock.elapsedTime;
    // R3F can consume a queued invalidation after switching to manual time.
    // Cancel it before pausing so the RAF timestamp cannot advance the story.
    if (paused) get().internal.frames = 0;
    setFrameloop(paused ? "never" : reducedMotion ? "demand" : "always");
    clock.elapsedTime = sceneTime;
    invalidate();
    samples.current.length = 0;
    elapsed.current = 0;
    if (inspect && diagnostics.current && (paused || reducedMotion)) {
      diagnostics.current.textContent = paused ? "Rendering paused" : "Reduced motion · renders only when the scene changes";
    }
  }, [paused, reducedMotion, setFrameloop, invalidate, clock, get, inspect, diagnostics]);

  useFrame(({ gl, scene }, delta) => {
    if (!ready.current) {
      ready.current = true;
      onReady();
    }
    if (!inspect || !diagnostics.current || paused || reducedMotion || delta <= 0) return;
    samples.current.push(delta * 1000);
    elapsed.current += delta;
    if (elapsed.current < 1) return;
    const values = samples.current;
    const fps = values.length / elapsed.current;
    values.sort((a, b) => a - b);
    let lights = 0;
    scene.traverse((object) => {
      if ("isPointLight" in object && object.isPointLight) lights++;
    });
    if (!rendererName.current) {
      const context = gl.getContext();
      const debug = context.getExtension("WEBGL_debug_renderer_info");
      rendererName.current = debug ? String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : "Renderer unavailable";
    }
    diagnostics.current.textContent = `${fps.toFixed(1)} FPS · p95 ${values[Math.floor(values.length * 0.95)].toFixed(1)} ms · ${gl.info.render.calls} draws · ${gl.info.render.triangles.toLocaleString()} triangles · ${lights} point lights · DPR ${gl.getPixelRatio().toFixed(2)} · ${rendererName.current}`;
    values.length = 0;
    elapsed.current = 0;
  });

  return null;
}
