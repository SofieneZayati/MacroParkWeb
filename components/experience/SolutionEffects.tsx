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

const RESERVATION_PLACEMENT: Record<EnvironmentId, [number, number, number]> = {
  home: [0, 0, 2.5],
  residence: [0, 0, 2.35],
  retail: [-2.7, 0, 2.45],
};

const GUEST_PLACEMENT: Record<EnvironmentId, [number, number, number]> = {
  home: [1.15, 0.04, 3.1],
  residence: [0, 0.04, 2.35],
  retail: [0, 0.04, 2.45],
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
      {hasGuidance && selectedEnvironment === "retail" && <GuidanceTrail />}
      {hasProtectedSpace && selectedEnvironment === "residence" && (
        <ProtectedBay showHardware={selectedProblem !== "protect-space"} />
      )}
      {hasReservation && <ReservedBay position={RESERVATION_PLACEMENT[selectedEnvironment]} />}
      {hasGuestAccess && <GuestWindow position={GUEST_PLACEMENT[selectedEnvironment]} />}
      {hasFlow && (
        <FlowPulse
          x={selectedEnvironment === "retail" ? -1.9 : -0.75}
          startZ={selectedEnvironment === "retail" ? 5.7 : 4.8}
          endZ={selectedEnvironment === "retail" ? 1.2 : 1.15}
        />
      )}
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
      {[0, 1, 2, 3, 4, 5].map((step) => (
        <group key={step} position={[-3.25 + step * 0.47, 0.075, 5.75 - step * 0.66]}>
          <mesh rotation-x={-Math.PI / 2} rotation-z={-0.23} position={[-0.12, 0, 0]}>
            <planeGeometry args={[0.5, 0.11]} />
            <meshBasicMaterial
              color="#b9ffca"
              transparent
              opacity={0.38 + step * 0.08}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation-x={-Math.PI / 2} rotation-z={-1.05} position={[0.12, 0, 0]}>
            <planeGeometry args={[0.5, 0.11]} />
            <meshBasicMaterial
              color="#b9ffca"
              transparent
              opacity={0.38 + step * 0.08}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
      <AvailableBayMarker />
    </group>
  );
}

function AvailableBayMarker() {
  const pulse = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const material = pulse.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.23 + (Math.sin(clock.elapsedTime * 2.6) + 1) * 0.09;
  });

  return (
    <group position={[-0.9, 0, 2.45]}>
      <mesh ref={pulse} rotation-x={-Math.PI / 2} position={[0, 0.09, 0]}>
        <planeGeometry args={[1.42, 3.02]} />
        <meshBasicMaterial color="#8dffab" transparent opacity={0.32} side={THREE.DoubleSide} />
      </mesh>

      {[-0.68, 0.68].map((x) => (
        <mesh key={`line-${x}`} rotation-x={-Math.PI / 2} position={[x, 0.115, 0]}>
          <planeGeometry args={[0.055, 2.9]} />
          <meshBasicMaterial color="#d5ffdf" transparent opacity={0.92} />
        </mesh>
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.115, -1.42]}>
        <planeGeometry args={[1.38, 0.055]} />
        <meshBasicMaterial color="#d5ffdf" transparent opacity={0.92} />
      </mesh>

      {[-0.62, 0.62].map((x) => (
        <mesh key={`post-${x}`} position={[x, 0.78, -1.28]}>
          <cylinderGeometry args={[0.032, 0.045, 1.5, 10]} />
          <meshStandardMaterial color="#66726b" metalness={0.48} roughness={0.44} />
        </mesh>
      ))}
      <mesh position={[0, 1.5, -1.28]}>
        <boxGeometry args={[1.38, 0.12, 0.14]} />
        <meshStandardMaterial
          color="#bfffd0"
          emissive="#5dd979"
          emissiveIntensity={1.65}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 1.5, -1.355]}>
        <boxGeometry args={[0.74, 0.035, 0.012]} />
        <meshBasicMaterial color="#effff3" />
      </mesh>
      <pointLight position={[0, 1.38, -1.05]} color="#8fffaa" intensity={3} distance={4.6} />
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

function ReservedBay({ position }: { position: [number, number, number] }) {
  const marker = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!marker.current) return;
    marker.current.rotation.z = clock.elapsedTime * 0.22;
    const material = marker.current.material as THREE.MeshBasicMaterial;
    material.opacity = 0.32 + (Math.sin(clock.elapsedTime * 2) + 1) * 0.08;
  });

  return (
    <group position={position}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.05, 0]}>
        <planeGeometry args={[1.7, 3.1]} />
        <meshBasicMaterial color="#f2c76f" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={marker} rotation-x={Math.PI / 2} position={[0, 0.11, 0]}>
        <torusGeometry args={[0.55, 0.045, 10, 48, Math.PI * 1.62]} />
        <meshBasicMaterial color="#f6cf79" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0.16, -1.28]}>
        <boxGeometry args={[1.35, 0.08, 0.12]} />
        <meshStandardMaterial color="#d8aa50" emissive="#7d5720" emissiveIntensity={0.45} />
      </mesh>
      <pointLight position={[0, 1.1, 0]} color="#f2ca77" intensity={1.8} distance={3.2} />
    </group>
  );
}

function GuestWindow({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.62, 0.7, 40]} />
        <meshBasicMaterial color="#d6f7df" transparent opacity={0.44} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, 1.1, 0]} color="#b6f7c9" intensity={2.2} distance={3.4} />
    </group>
  );
}

function FlowPulse({ x, startZ, endZ }: { x: number; startZ: number; endZ: number }) {
  const pulse = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const progress = (clock.elapsedTime * 0.65) % 1;
    pulse.current.position.z = THREE.MathUtils.lerp(startZ, endZ, progress);
    pulse.current.position.y = 0.18 + Math.sin(progress * Math.PI) * 0.18;
  });

  return (
    <mesh ref={pulse} position={[x, 0.2, startZ]}>
      <sphereGeometry args={[0.1, 14, 14]} />
      <meshBasicMaterial color="#a7f8be" />
      <pointLight color="#9effbd" intensity={2.8} distance={2.5} />
    </mesh>
  );
}
