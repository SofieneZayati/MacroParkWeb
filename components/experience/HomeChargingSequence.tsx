"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EVCharger } from "./ParkingHardware";
import { PremiumVehicle } from "./PremiumVehicle";
import { useMotionPreference } from "./useMotionPreference";

export function HomeChargingSequence({ solarEnabled }: { solarEnabled: boolean }) {
  const reducedMotion = useMotionPreference();
  const cablePulseA = useRef<THREE.Mesh>(null);
  const cablePulseB = useRef<THREE.Mesh>(null);
  const solarPulseA = useRef<THREE.Mesh>(null);
  const solarPulseB = useRef<THREE.Mesh>(null);
  const chargeRing = useRef<THREE.Mesh>(null);

  const cableCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.08, 0.8, 2.2),
        new THREE.Vector3(-1.82, 0.48, 2.38),
        new THREE.Vector3(-1.45, 0.42, 2.56),
        new THREE.Vector3(-1.06, 0.5, 2.62),
      ]),
    [],
  );

  const cableGeometry = useMemo(
    () => new THREE.TubeGeometry(cableCurve, 30, 0.026, 6, false),
    [cableCurve],
  );
  useEffect(() => () => cableGeometry.dispose(), [cableGeometry]);

  const solarCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.05, 2.24, 2.35),
        new THREE.Vector3(-0.72, 2.05, 2.3),
        new THREE.Vector3(-1.5, 1.55, 2.22),
        new THREE.Vector3(-2.22, 1.12, 2.18),
      ]),
    [],
  );

  useFrame(({ clock }) => {
    const animateAlongCurve = (
      mesh: THREE.Mesh | null,
      curve: THREE.CatmullRomCurve3,
      offset: number,
      speed: number,
    ) => {
      if (!mesh) return;
      const progress = ((reducedMotion ? 0 : clock.elapsedTime) * speed + offset) % 1;
      curve.getPointAt(progress, mesh.position);
      const scale = 0.72 + Math.sin(progress * Math.PI) * 0.34;
      mesh.scale.setScalar(scale);
    };

    animateAlongCurve(cablePulseA.current, cableCurve, 0, 0.48);
    animateAlongCurve(cablePulseB.current, cableCurve, 0.52, 0.48);

    if (solarEnabled) {
      animateAlongCurve(solarPulseA.current, solarCurve, 0, 0.34);
      animateAlongCurve(solarPulseB.current, solarCurve, 0.5, 0.34);
    }

    if (chargeRing.current) {
      const material = chargeRing.current.material as THREE.MeshBasicMaterial;
      material.opacity = reducedMotion ? 0.28 : 0.2 + (Math.sin(clock.elapsedTime * 2.3) + 1) * 0.075;
      const scale = reducedMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 1.8) * 0.035;
      chargeRing.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={[0, 0.23, 0]}>
      <group position={[-0.45, 0, 2.55]} rotation-y={Math.PI}>
        <PremiumVehicle color="#d7dfda" scale={0.56} lightsOn={false} />
      </group>

      <EVCharger position={[-2.28, 0, 2.15]} compact charging />

      <mesh geometry={cableGeometry}>
        <meshStandardMaterial color="#252d29" metalness={0.18} roughness={0.74} />
      </mesh>

      <mesh ref={cablePulseA}>
        <sphereGeometry args={[0.07, 14, 14]} />
        <meshBasicMaterial color="#a9f7bd" />
      </mesh>
      <mesh ref={cablePulseB}>
        <sphereGeometry args={[0.055, 14, 14]} />
        <meshBasicMaterial color="#c8ffd7" />
      </mesh>

      <mesh ref={chargeRing} rotation-x={-Math.PI / 2} position={[-0.45, 0.015, 2.55]}>
        <ringGeometry args={[1.02, 1.13, 54]} />
        <meshBasicMaterial color="#8ff3aa" transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>

      {solarEnabled && (
        <>
          <mesh ref={solarPulseA}>
            <sphereGeometry args={[0.065, 14, 14]} />
            <meshBasicMaterial color="#ffd88b" />
          </mesh>
          <mesh ref={solarPulseB}>
            <sphereGeometry args={[0.055, 14, 14]} />
            <meshBasicMaterial color="#ffe8ae" />
          </mesh>
        </>
      )}
    </group>
  );
}
