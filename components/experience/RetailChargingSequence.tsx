"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PremiumVehicle } from "./PremiumVehicle";
import { useExperienceStore } from "./useExperienceStore";

export function RetailChargingSequence() {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const solarEnabled = useExperienceStore((state) => state.solarEnabled);
  const active = selectedEnvironment === "retail" && selectedProblem === "ev-charging";
  const cablePulseA = useRef<THREE.Mesh>(null);
  const cablePulseB = useRef<THREE.Mesh>(null);
  const solarPulseA = useRef<THREE.Mesh>(null);
  const solarPulseB = useRef<THREE.Mesh>(null);
  const chargeRing = useRef<THREE.Mesh>(null);

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

  useFrame(({ clock }) => {
    if (!active) return;

    const animatePulse = (
      mesh: THREE.Mesh | null,
      curve: THREE.CatmullRomCurve3,
      offset: number,
      speed: number,
    ) => {
      if (!mesh) return;
      const progress = (clock.elapsedTime * speed + offset) % 1;
      mesh.position.copy(curve.getPointAt(progress));
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
      material.opacity = 0.22 + (Math.sin(clock.elapsedTime * 2.2) + 1) * 0.07;
      const scale = 1 + Math.sin(clock.elapsedTime * 1.7) * 0.03;
      chargeRing.current.scale.setScalar(scale);
    }
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
