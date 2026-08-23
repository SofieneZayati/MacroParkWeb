"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore, type EnvironmentId } from "./useExperienceStore";

const FOCUS: Record<EnvironmentId, [number, number, number]> = {
  home: [8, 3.2, -8.5],
  residence: [0, 3.6, -11.5],
  retail: [-8.5, 3.8, -8.5],
};

export function ScenePolish() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <>
      <CameraParallax />
      <DepthParticles />
      <EnvironmentGlow />
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

function CameraParallax() {
  const previous = useRef(new THREE.Vector2());

  useFrame(({ camera, pointer }, delta) => {
    camera.position.x -= previous.current.x;
    camera.position.y -= previous.current.y;

    const nextX = THREE.MathUtils.damp(previous.current.x, pointer.x * 0.16, 4.2, delta);
    const nextY = THREE.MathUtils.damp(previous.current.y, pointer.y * 0.07, 4.2, delta);

    camera.position.x += nextX;
    camera.position.y += nextY;
    previous.current.set(nextX, nextY);
  });

  return null;
}

function DepthParticles() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(72 * 3);

    for (let index = 0; index < 72; index += 1) {
      const stride = index * 3;
      const angle = index * 2.399963229728653;
      const radius = 7 + ((index * 17) % 21) * 0.68;

      values[stride] = Math.cos(angle) * radius;
      values[stride + 1] = 0.7 + ((index * 13) % 11) * 0.62;
      values[stride + 2] = -5 - Math.sin(angle) * radius - ((index * 7) % 9);
    }

    return values;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current) return;
    points.current.rotation.y = Math.sin(clock.elapsedTime * 0.07) * 0.025;
    points.current.position.y = Math.sin(clock.elapsedTime * 0.18) * 0.08;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#c9e8d3"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.3}
        depthWrite={false}
      />
    </points>
  );
}

function EnvironmentGlow() {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const light = useRef<THREE.PointLight>(null);
  const current = useRef(new THREE.Vector3(0, 3, -8));
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, delta) => {
    if (!light.current) return;

    const targetPosition = selectedEnvironment ? FOCUS[selectedEnvironment] : ([0, 4, -9] as const);
    target.set(...targetPosition);
    current.current.lerp(target, 1 - Math.exp(-delta * 2.6));
    light.current.position.copy(current.current);
    light.current.intensity = 2.6 + Math.sin(clock.elapsedTime * 1.2) * 0.35;
  });

  return <pointLight ref={light} color="#9ff5b9" intensity={2.8} distance={13} decay={2} />;
}
