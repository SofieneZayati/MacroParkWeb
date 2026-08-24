"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { RetailAvailabilityLayer } from "./RetailAvailabilityLayer";
import { useExperienceStore, type EnvironmentId } from "./useExperienceStore";

const CAMERA_OFFSET: Record<EnvironmentId, [number, number, number]> = {
  home: [2.8, 0.7, 4.2],
  residence: [2.7, -0.6, 3.8],
  retail: [-3.2, 0.6, 4.2],
};

export function ScenePolish() {
  const reducedMotion = useReducedMotion();

  return (
    <>
      <CameraComposition reducedMotion={reducedMotion} />
      {!reducedMotion && <CameraParallax />}
      <RetailAvailabilityLayer />
    </>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

function CameraComposition({ reducedMotion }: { reducedMotion: boolean }) {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const previous = useRef(new THREE.Vector3());
  const next = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, delta) => {
    camera.position.sub(previous.current);

    const target = selectedEnvironment ? CAMERA_OFFSET[selectedEnvironment] : ([0, 0, 0] as const);
    const speed = reducedMotion ? 18 : 3.4;
    next.set(
      THREE.MathUtils.damp(previous.current.x, target[0], speed, delta),
      THREE.MathUtils.damp(previous.current.y, target[1], speed, delta),
      THREE.MathUtils.damp(previous.current.z, target[2], speed, delta),
    );

    camera.position.add(next);
    previous.current.copy(next);
  });

  return null;
}

function CameraParallax() {
  const previous = useRef(new THREE.Vector2());

  useFrame(({ camera, pointer }, delta) => {
    camera.position.x -= previous.current.x;
    camera.position.y -= previous.current.y;

    const nextX = THREE.MathUtils.damp(previous.current.x, pointer.x * 0.14, 4.2, delta);
    const nextY = THREE.MathUtils.damp(previous.current.y, pointer.y * 0.06, 4.2, delta);

    camera.position.x += nextX;
    camera.position.y += nextY;
    previous.current.set(nextX, nextY);
  });

  return null;
}
