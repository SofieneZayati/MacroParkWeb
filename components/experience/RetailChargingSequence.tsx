"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PremiumVehicle } from "./PremiumVehicle";
import { useExperienceStore } from "./useExperienceStore";
import { useMotionPreference } from "./useMotionPreference";
import { useStoryCamera } from "./useStoryCamera";

export function RetailChargingSequence() {
  const reducedMotion = useMotionPreference();
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const solarEnabled = useExperienceStore((state) => state.solarEnabled);
  const active = selectedEnvironment === "retail" && selectedProblem === "ev-charging";
  const cablePulseA = useRef<THREE.Mesh>(null);
  const cablePulseB = useRef<THREE.Mesh>(null);
  const solarPulseA = useRef<THREE.Mesh>(null);
  const solarPulseB = useRef<THREE.Mesh>(null);
  const chargeRing = useRef<THREE.Mesh>(null);
  const updateCamera = useStoryCamera([-7.8, 0.35, -8.25]);

  const cableCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.15, 1.0, 0.62),
        new THREE.Vector3(1.12, 0.7, 1.05),
        new THREE.Vector3(1.06, 0.55, 1.5),
        new THREE.Vector3(0.96, 0.56, 2.03),
      ]),
    [],
  );
  const cableGeometry = useMemo(
    () => new THREE.TubeGeometry(cableCurve, 30, 0.025, 6, false),
    [cableCurve],
  );
  useEffect(() => () => cableGeometry.dispose(), [cableGeometry]);
  const solarCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.2, 2.7, 2.2),
        new THREE.Vector3(0.55, 2.15, 1.75),
        new THREE.Vector3(0.88, 1.55, 1.2),
        new THREE.Vector3(1.15, 1.05, 0.64),
      ]),
    [],
  );

  useFrame(({ clock, camera, size }, delta) => {
    if (!active) return;

    const animatePulse = (
      mesh: THREE.Mesh | null,
      curve: THREE.CatmullRomCurve3,
      offset: number,
      speed: number,
    ) => {
      if (!mesh) return;
      const progress = ((reducedMotion ? 0 : clock.elapsedTime) * speed + offset) % 1;
      curve.getPointAt(progress, mesh.position);
      mesh.scale.setScalar(0.72 + Math.sin(progress * Math.PI) * 0.28);
    };

    animatePulse(cablePulseA.current, cableCurve, 0, 0.48);
    animatePulse(cablePulseB.current, cableCurve, 0.52, 0.48);
    if (solarEnabled) {
      animatePulse(solarPulseA.current, solarCurve, 0, 0.32);
      animatePulse(solarPulseB.current, solarCurve, 0.5, 0.32);
    }

    if (chargeRing.current) {
      const material = chargeRing.current.material as THREE.MeshBasicMaterial;
      material.opacity = reducedMotion ? 0.28 : 0.22 + (Math.sin(clock.elapsedTime * 2.2) + 1) * 0.07;
      const scale = reducedMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 1.7) * 0.03;
      chargeRing.current.scale.setScalar(scale);
    }

    const mobile = size.width <= 760;
    const targetPosition: [number, number, number] = mobile
      ? [-10.9, 7.15, -2.3]
      : [-13.05, 4.25, -2.95];
    const targetLookAt: [number, number, number] = [-7.8, mobile ? 0.25 : 0.55, -8.2];
    updateCamera(camera, delta, reducedMotion, {
      position: targetPosition,
      lookAt: targetLookAt,
      fov: mobile ? 50 : 39,
      movementDamping: 4.7,
      fovDamping: 5.1,
    });
  });

  if (!active) return null;

  return (
    <group position={[-8.5, 0, -10]}>
      <group position={[0.9, 0.24, 2.45]} rotation-y={Math.PI}>
        <PremiumVehicle color="#d8dfdb" scale={0.47} lightsOn={false} />
      </group>

      <mesh geometry={cableGeometry}>
        <meshStandardMaterial color="#252d29" metalness={0.16} roughness={0.76} />
      </mesh>
      <mesh ref={cablePulseA}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshBasicMaterial color="#a9f7bd" />
      </mesh>
      <mesh ref={cablePulseB}>
        <sphereGeometry args={[0.048, 9, 9]} />
        <meshBasicMaterial color="#d1ffdc" />
      </mesh>

      <mesh ref={chargeRing} rotation-x={-Math.PI / 2} position={[0.9, 0.255, 2.45]}>
        <ringGeometry args={[0.82, 0.91, 38]} />
        <meshBasicMaterial color="#8ff3aa" transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>

      <group position={[0.9, 0, 2.45]}>
        {[-0.68, 0.68].map((x) => (
          <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.27, 0]}>
            <planeGeometry args={[0.045, 2.9]} />
            <meshBasicMaterial color="#bafaca" transparent opacity={0.75} />
          </mesh>
        ))}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.27, -1.42]}>
          <planeGeometry args={[1.36, 0.045]} />
          <meshBasicMaterial color="#bafaca" transparent opacity={0.75} />
        </mesh>
      </group>

      {solarEnabled && (
        <>
          <mesh ref={solarPulseA}>
            <sphereGeometry args={[0.06, 10, 10]} />
            <meshBasicMaterial color="#ffd88b" />
          </mesh>
          <mesh ref={solarPulseB}>
            <sphereGeometry args={[0.048, 9, 9]} />
            <meshBasicMaterial color="#ffe7a8" />
          </mesh>
        </>
      )}
    </group>
  );
}
