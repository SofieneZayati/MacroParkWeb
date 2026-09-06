"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ParkingBlocker, SolarCanopy } from "./ParkingHardware";
import { ResidenceAccessSequence } from "./ResidenceAccessSequence";
import { ResidenceReservationSequence } from "./ResidenceReservationSequence";
import { ResidenceGuestSequence } from "./ResidenceGuestSequence";
import { ResidenceChargingSequence } from "./ResidenceChargingSequence";
import { RetailReservationSequence } from "./RetailReservationSequence";
import { useExperienceStore, type EnvironmentId, type ProblemId } from "./useExperienceStore";
import { useMotionPreference } from "./useMotionPreference";

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
  home: [1.15, 0.245, 3.1],
  residence: [0, 0.24, 2.35],
  retail: [0, 0.245, 2.45],
};

export function SolutionEffects() {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const selectedProblems = useExperienceStore((state) => state.selectedProblems);
  const solarEnabled = useExperienceStore((state) => state.solarEnabled);
  const guestAccessPreview = useExperienceStore((state) => state.guestAccessPreview);
  const demoRevision = useExperienceStore((state) => state.demoRevision);
  const residenceAccessAuthorized = useExperienceStore(
    (state) => state.residenceAccessAuthorized,
  );

  if (!selectedEnvironment) return null;

  const origin = ORIGIN[selectedEnvironment];
  const solar = SOLAR_PLACEMENT[selectedEnvironment];
  // A preview shows the complete solution before the client adds it to their setup.
  const isVisible = (problem: ProblemId) => selectedProblem === problem || selectedProblems.includes(problem);
  const hasGuidance = isVisible("parking-guidance");
  const hasProtectedSpace = isVisible("protect-space");
  const hasReservation = isVisible("reservations");
  const hasGuestAccess = isVisible("guest-access");
  const hasFlow = isVisible("reduce-queues") || isVisible("automatic-access");
  const guestPreviewActive = guestAccessPreview === "active";

  const residenceProtectionStory =
    selectedEnvironment === "residence" && selectedProblem === "protect-space";
  const residenceReservationStory =
    selectedEnvironment === "residence" && selectedProblem === "reservations";
  const residenceGuestStory =
    selectedEnvironment === "residence" && selectedProblem === "guest-access";
  const residenceChargingStory =
    selectedEnvironment === "residence" && selectedProblem === "ev-charging";
  const retailReservationStory =
    selectedEnvironment === "retail" && selectedProblem === "reservations";
  const residenceBayReady = !residenceProtectionStory || residenceAccessAuthorized;

  return (
    <group position={origin}>
      {selectedProblem && <ActiveBeacon />}
      {hasGuidance && selectedEnvironment === "retail" && <GuidanceTrail />}

      {hasProtectedSpace && selectedEnvironment === "residence" && (
        <ProtectedBay
          showHardware={selectedProblem !== "protect-space"}
          ready={residenceBayReady}
        />
      )}
      {residenceProtectionStory && <ResidenceAccessSequence key={demoRevision} />}
      {residenceReservationStory && <ResidenceReservationSequence key={demoRevision} />}
      {residenceGuestStory && <ResidenceGuestSequence key={demoRevision} allowed={guestPreviewActive} />}
      {residenceChargingStory && <ResidenceChargingSequence key={demoRevision} />}
      {retailReservationStory && <RetailReservationSequence key={demoRevision} />}

      {hasReservation && !residenceReservationStory && !retailReservationStory && (
        <ReservedBay position={RESERVATION_PLACEMENT[selectedEnvironment]} />
      )}
      {hasGuestAccess && !residenceGuestStory && (
        <GuestWindow position={GUEST_PLACEMENT[selectedEnvironment]} active={guestPreviewActive} />
      )}
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
  const reducedMotion = useMotionPreference();
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ring.current) return;
    const pulse = reducedMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 2.8) * 0.1;
    ring.current.scale.setScalar(pulse);
  });

  return (
    <mesh ref={ring} rotation-x={Math.PI / 2} position={[0, 0.255, 0]}>
      <torusGeometry args={[3.4, 0.035, 8, 48]} />
      <meshBasicMaterial color="#9df4b7" transparent opacity={0.35} />
    </mesh>
  );
}

function GuidanceTrail() {
  return (
    <group>
      {[0, 1, 2, 3, 4, 5].map((step) => (
        <group key={step} position={[-3.25 + step * 0.47, 0.255, 5.75 - step * 0.66]}>
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
  const reducedMotion = useMotionPreference();
  const pulse = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const material = pulse.current.material as THREE.MeshBasicMaterial;
    material.opacity = reducedMotion ? 0.32 : 0.23 + (Math.sin(clock.elapsedTime * 2.6) + 1) * 0.09;
  });

  return (
    <group position={[-0.9, 0, 2.45]}>
      <mesh ref={pulse} rotation-x={-Math.PI / 2} position={[0, 0.245, 0]}>
        <planeGeometry args={[1.42, 3.02]} />
        <meshBasicMaterial color="#8dffab" transparent opacity={0.32} side={THREE.DoubleSide} />
      </mesh>

      {[-0.68, 0.68].map((x) => (
        <mesh key={`line-${x}`} rotation-x={-Math.PI / 2} position={[x, 0.26, 0]}>
          <planeGeometry args={[0.055, 2.9]} />
          <meshBasicMaterial color="#d5ffdf" transparent opacity={0.92} />
        </mesh>
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.26, -1.42]}>
        <planeGeometry args={[1.38, 0.055]} />
        <meshBasicMaterial color="#d5ffdf" transparent opacity={0.92} />
      </mesh>

      {[-0.62, 0.62].map((x) => (
        <mesh key={`post-${x}`} position={[x, 0.78, -1.28]}>
          <cylinderGeometry args={[0.032, 0.045, 1.5, 8]} />
          <meshStandardMaterial color="#66726b" metalness={0.48} roughness={0.44} />
        </mesh>
      ))}
      <mesh position={[0, 1.5, -1.28]}>
        <boxGeometry args={[1.38, 0.12, 0.14]} />
        <meshStandardMaterial
          color="#bfffd0"
          emissive="#5dd979"
          emissiveIntensity={1.4}
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0, 1.5, -1.355]}>
        <boxGeometry args={[0.74, 0.035, 0.012]} />
        <meshBasicMaterial color="#effff3" />
      </mesh>
    </group>
  );
}

function ProtectedBay({ showHardware, ready }: { showHardware: boolean; ready: boolean }) {
  const reducedMotion = useMotionPreference();
  const glow = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!glow.current) return;
    const material = glow.current.material as THREE.MeshBasicMaterial;
    material.opacity = ready
      ? reducedMotion ? 0.27 : 0.2 + (Math.sin(clock.elapsedTime * 2.4) + 1) * 0.07
      : 0.9;
  });

  const lineColor = ready ? "#d1ffdc" : "#66736b";
  const lineOpacity = ready ? 0.95 : 0.45;

  return (
    <group position={[-2.45, 0, 2.4]}>
      <mesh ref={glow} rotation-x={-Math.PI / 2} position={[0, 0.255, 0]}>
        <planeGeometry args={[2.08, 3.02]} />
        <meshBasicMaterial
          color={ready ? "#78e693" : "#222a26"}
          transparent
          opacity={ready ? 0.25 : 0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {[-1.01, 1.01].map((x) => (
        <mesh key={`protected-side-${x}`} rotation-x={-Math.PI / 2} position={[x, 0.27, 0]}>
          <planeGeometry args={[0.055, 3.02]} />
          <meshBasicMaterial color={lineColor} transparent opacity={lineOpacity} />
        </mesh>
      ))}
      {[-1.48, 1.48].map((z) => (
        <mesh key={`protected-end-${z}`} rotation-x={-Math.PI / 2} position={[0, 0.27, z]}>
          <planeGeometry args={[2.08, 0.055]} />
          <meshBasicMaterial color={lineColor} transparent opacity={lineOpacity} />
        </mesh>
      ))}

      {ready && (
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.28, -0.2]}>
          <ringGeometry args={[0.45, 0.51, 36]} />
          <meshBasicMaterial color="#caffd7" transparent opacity={0.72} side={THREE.DoubleSide} />
        </mesh>
      )}
      {showHardware && <ParkingBlocker position={[0, 0.24, -1.05]} />}
    </group>
  );
}

function ReservedBay({ position }: { position: [number, number, number] }) {
  const reducedMotion = useMotionPreference();
  const marker = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!marker.current) return;
    marker.current.rotation.z = reducedMotion ? 0 : clock.elapsedTime * 0.22;
    const material = marker.current.material as THREE.MeshBasicMaterial;
    material.opacity = reducedMotion ? 0.4 : 0.32 + (Math.sin(clock.elapsedTime * 2) + 1) * 0.08;
  });

  return (
    <group position={position}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.245, 0]}>
        <planeGeometry args={[1.7, 3.1]} />
        <meshBasicMaterial color="#f2c76f" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={marker} rotation-x={Math.PI / 2} position={[0, 0.285, 0]}>
        <torusGeometry args={[0.55, 0.045, 8, 40, Math.PI * 1.62]} />
        <meshBasicMaterial color="#f6cf79" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 0.28, -1.28]}>
        <boxGeometry args={[1.35, 0.08, 0.12]} />
        <meshStandardMaterial color="#d8aa50" emissive="#7d5720" emissiveIntensity={0.45} />
      </mesh>
    </group>
  );
}

function GuestWindow({ position, active }: { position: [number, number, number]; active: boolean }) {
  const color = active ? "#d6f7df" : "#f0c779";

  return (
    <group position={position}>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.62, 0.7, 32]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 0.44 : 0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function FlowPulse({ x, startZ, endZ }: { x: number; startZ: number; endZ: number }) {
  const reducedMotion = useMotionPreference();
  const pulse = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!pulse.current) return;
    const progress = reducedMotion ? 0.5 : (clock.elapsedTime * 0.65) % 1;
    pulse.current.position.z = THREE.MathUtils.lerp(startZ, endZ, progress);
    pulse.current.position.y = 0.33 + Math.sin(progress * Math.PI) * 0.18;
  });

  return (
    <mesh ref={pulse} position={[x, 0.33, startZ]}>
      <sphereGeometry args={[0.11, 10, 10]} />
      <meshBasicMaterial color="#a7f8be" />
    </mesh>
  );
}
