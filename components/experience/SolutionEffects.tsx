"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ParkingBlocker, SolarCanopy } from "./ParkingHardware";
import { useExperienceStore, type EnvironmentId } from "./useExperienceStore";

const ORIGIN: Record<EnvironmentId, [number, number, number]> = {
  home: [8, 0, -10],
  residence: [0, 0, -14],
  retail: [-8.5, 0, -10],
};

const SOLAR_PLACEMENT: Record<EnvironmentId, { position: [number, number, number]; scale: number }> = {
  home: { position: [0, 0, 2.35], scale: 0.68 },
  residence: { position: [0, 0, 2.15], scale: 0.82 },
  retail: { position: [0, 0, 2.2], scale: 0.9 },
};

export function SolutionEffects() {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const selectedProblems = useExperienceStore((state) => state.selectedProblems);
  const solarEnabled = useExperienceStore((state) => state.solarEnabled);

  if (!selectedEnvironment) return null;

  const origin = ORIGIN[selectedEnvironment];
  const solar = SOLAR_PLACEMENT[selectedEnvironment];
  const hasGuidance = selectedProblems.includes("parking-guidance");
  const hasProtectedSpace = selectedProblems.includes("protect-space");
  const hasReservation = selectedProblems.includes("reservations");
  const hasGuestAccess = selectedProblems.includes("guest-access");
  const hasFlow = selectedProblems.includes("reduce-queues") || selectedProblems.includes("automatic-access");

  return (
    <group position={origin}>
      {selectedProblem && <ActiveBeacon />}
      {hasGuidance && <GuidanceTrail />}
      {hasProtectedSpace && <ProtectedBay showHardware={selectedProblem !== "protect-space"} />}
      {hasReservation && <ReservedBay />}
      {hasGuestAccess && <GuestWindow />}
      {hasFlow && <FlowPulse />}
      {solarEnabled && <SolarCanopy position={solar.position} scale={solar.scale} />}
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
    <group>
      {[0, 1, 2, 3, 4].map((step) => (
        <mesh
          key={step}
          rotation-x={-Math.PI / 2}
          rotation-z={-0.7}
          position={[-1.9 + step * 0.7, 0.07, 5.3 - step * 0.8]}
        >
          <planeGeometry args={[0.72, 0.19]} />
          <meshBasicMaterial
            color="#a7f8be"
            transparent
            opacity={0.42 + step * 0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <pointLight position={[0.9, 0.65, 2.1]} color="#9effbd" intensity={1.5} distance={2.8} />
    </group>
  );
}

function ProtectedBay({ showHardware }: { showHardware: boolean }) {
  const glow = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!glow.current) return;
    const material = glow.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.12 + (Math.sin(clock.elapsedTime * 2.4) + 1) * 0.05;
  });

  return (
    <group position={[-2.45, 0, 2.4]}>
      <mesh ref={glow} rotation-x={-Math.PI / 2} position={[0, 0.045, 0]}>
        <planeGeometry args={[2.15, 3.15]} />
        <meshBasicMaterial color="#a7f8be" transparent opacity={0.17} side={THREE.DoubleSide} />
      </mesh>
      {showHardware && <ParkingBlocker position={[0, 0.04, -1.05]} />}
    </group>
  );
}

function ReservedBay() {
  const marker = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!marker.current) return;
    marker.current.rotation.z = clock.elapsedTime * 0.22;
    const material = marker.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.32 + (Math.sin(clock.elapsedTime * 2) + 1) * 0.08;
  });

  return (
    <group position={[-2.7, 0, 0.55]}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.05, 0]}>
        <planeGeometry args={[2.05, 4]} />
        <meshBasicMaterial color="#f2c76f" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={marker} rotation-x={Math.PI / 2} position={[0, 0.11, 0]}>
        <torusGeometry args={[0.55, 0.045, 10, 48, Math.PI * 1.62]} />
        <meshBasicMaterial color="#f6cf79" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0.16, -1.62]}>
        <boxGeometry args={[1.5, 0.08, 0.12]} />
        <meshStandardMaterial color="#d8aa50" emissive="#7d5720" emissiveIntensity={0.45} />
      </mesh>
      <pointLight position={[0, 1.1, 0]} color="#f2ca77" intensity={1.8} distance={3.2} />
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
