"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore, type EnvironmentId } from "./useExperienceStore";

const ORIGIN: Record<EnvironmentId, [number, number, number]> = {
  home: [8, 0, -10],
  residence: [0, 0, -13],
  retail: [-8.5, 0, -10],
};

export function SolutionEffects() {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const selectedProblems = useExperienceStore((state) => state.selectedProblems);
  const solarEnabled = useExperienceStore((state) => state.solarEnabled);

  if (!selectedEnvironment) return null;

  const origin = ORIGIN[selectedEnvironment];
  const hasGuidance = selectedProblems.includes("parking-guidance");
  const hasProtectedSpace = selectedProblems.includes("protect-space");
  const hasGuestAccess = selectedProblems.includes("guest-access");
  const hasFlow = selectedProblems.includes("reduce-queues") || selectedProblems.includes("automatic-access");

  return (
    <group position={origin}>
      {selectedProblem && <ActiveBeacon />}
      {hasGuidance && <GuidanceTrail />}
      {hasProtectedSpace && <ProtectedBay />}
      {hasGuestAccess && <GuestWindow />}
      {hasFlow && <FlowPulse />}
      {solarEnabled && <SolarCanopy />}
    </group>
  );
}

function ActiveBeacon() {
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ring.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 2.8) * 0.1;
    ring.current.scale.setScalar(pulse);
    ring.current.rotation.z += 0.002;
  });

  return (
    <mesh ref={ring} rotation-x={Math.PI / 2} position={[0, 0.08, 0]}>
      <torusGeometry args={[3.4, 0.035, 10, 72]} />
      <meshBasicMaterial color="#9df4b7" transparent opacity={0.35} />
    </mesh>
  );
}

function GuidanceTrail() {
  return (
    <group position={[0, 0.055, 2.8]}>
      {[0, 1, 2, 3, 4].map((step) => (
        <mesh key={step} rotation-x={-Math.PI / 2} position={[0, 0, step * 0.72]}>
          <planeGeometry args={[0.7, 0.18]} />
          <meshBasicMaterial
            color="#a7f8be"
            transparent
            opacity={0.75 - step * 0.09}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function ProtectedBay() {
  const glow = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!glow.current) return;
    const material = glow.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.12 + (Math.sin(clock.elapsedTime * 2.4) + 1) * 0.05;
  });

  return (
    <group position={[2.8, 0, 2.4]}>
      <mesh ref={glow} rotation-x={-Math.PI / 2} position={[0, 0.045, 0]}>
        <planeGeometry args={[2.15, 4.1]} />
        <meshBasicMaterial color="#a7f8be" transparent opacity={0.17} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.38, -1.72]}>
        <boxGeometry args={[1.7, 0.12, 0.22]} />
        <meshStandardMaterial color="#9beeb3" emissive="#3e8653" emissiveIntensity={0.55} />
      </mesh>
    </group>
  );
}

function GuestWindow() {
  return (
    <group position={[-2.65, 0.04, 2.65]}>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.62, 0.7, 40]} />
        <meshBasicMaterial color="#d6f7df" transparent opacity={0.44} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, 1.1, 0]} color="#b6f7c9" intensity={2.2} distance={3.4} />
    </group>
  );
}

function FlowPulse() {
  const pulse = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const progress = (clock.elapsedTime * 0.65) % 1;
    pulse.current.position.z = 6 - progress * 9;
    pulse.current.position.y = 0.18 + Math.sin(progress * Math.PI) * 0.18;
  });

  return (
    <mesh ref={pulse} position={[0, 0.2, 5]}>
      <sphereGeometry args={[0.1, 14, 14]} />
      <meshBasicMaterial color="#a7f8be" />
      <pointLight color="#9effbd" intensity={2.8} distance={2.5} />
    </mesh>
  );
}

function SolarCanopy() {
  return (
    <group position={[0, 0, 2.1]}>
      {[-2.3, 2.3].map((x) => (
        <mesh key={x} position={[x, 1.55, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.07, 3.1, 10]} />
          <meshStandardMaterial color="#65716a" metalness={0.6} roughness={0.42} />
        </mesh>
      ))}

      <group position={[0, 3.06, 0]} rotation-z={-0.05}>
        {[-1.7, 0, 1.7].map((x) => (
          <mesh key={x} position={[x, 0, 0]} castShadow>
            <boxGeometry args={[1.55, 0.09, 4.4]} />
            <meshStandardMaterial
              color="#182b29"
              emissive="#183f34"
              emissiveIntensity={0.18}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      <EnergyDrops />
      <pointLight position={[0, 2.5, 0]} color="#ffe5a0" intensity={4.2} distance={7} />
    </group>
  );
}

function EnergyDrops() {
  const first = useRef<THREE.Mesh>(null);
  const second = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const animate = (mesh: THREE.Mesh | null, offset: number) => {
      if (!mesh) return;
      const progress = (clock.elapsedTime * 0.55 + offset) % 1;
      mesh.position.y = 2.85 - progress * 2.5;
      mesh.scale.setScalar(0.7 + Math.sin(progress * Math.PI) * 0.5);
    };

    animate(first.current, 0);
    animate(second.current, 0.5);
  });

  return (
    <>
      <mesh ref={first} position={[-0.22, 2.8, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#ffd98a" />
      </mesh>
      <mesh ref={second} position={[0.22, 1.5, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color="#a7f8be" />
      </mesh>
    </>
  );
}
