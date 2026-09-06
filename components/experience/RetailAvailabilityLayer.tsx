"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "./useExperienceStore";
import { useMotionPreference } from "./useMotionPreference";

const BAY_STATUS = ["free", "selected", "occupied", "free"] as const;
const BAY_X = [-2.7, -0.9, 0.9, 2.7] as const;
const APPROACH_POSITION: [number, number, number] = [-2.72, 0, 6.35];

export function RetailAvailabilityLayer() {
  const reducedMotion = useMotionPreference();
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const selectedPulse = useRef<THREE.Mesh>(null);
  const approachPulse = useRef<THREE.Mesh>(null);
  const active = selectedEnvironment === "retail" && selectedProblem === "parking-guidance";

  useFrame(({ clock }) => {
    if (!active || reducedMotion) return;

    if (selectedPulse.current) {
      const material = selectedPulse.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.42 + (Math.sin(clock.elapsedTime * 2.6) + 1) * 0.1;
    }
    if (approachPulse.current) {
      const material = approachPulse.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.24 + (Math.sin(clock.elapsedTime * 2) + 1) * 0.06;
    }
  });

  if (!active) return null;

  return (
    <group position={[-8.5, 0, -10]}>
      <AvailabilityGantry />

      {BAY_X.map((x, index) => {
        const status = BAY_STATUS[index];
        const selected = status === "selected";
        const free = status === "free" || selected;
        const color = free ? "#a9f7bd" : "#66716b";

        return (
          <group key={x} position={[x, 0, 2.45]}>
            <mesh position={[0, 0.93, -1.12]}>
              <cylinderGeometry args={[0.022, 0.032, 1.72, 7]} />
              <meshStandardMaterial color="#56615b" metalness={0.4} roughness={0.48} />
            </mesh>
            <mesh position={[0, 1.75, -1.12]}>
              <boxGeometry args={[0.42, 0.075, 0.1]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0, 1.75, -1.18]}>
              <boxGeometry args={[0.2, 0.024, 0.01]} />
              <meshBasicMaterial color={free ? "#effff3" : "#8a958f"} />
            </mesh>

            {selected && (
              <mesh ref={selectedPulse} rotation-x={-Math.PI / 2} position={[0, 0.255, 0]}>
                <ringGeometry args={[0.54, 0.62, 30]} />
                <meshBasicMaterial
                  color="#b9ffca"
                  transparent
                  opacity={0.52}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
          </group>
        );
      })}

      <mesh
        ref={approachPulse}
        rotation-x={-Math.PI / 2}
        position={[APPROACH_POSITION[0], 0.082, APPROACH_POSITION[2]]}
      >
        <ringGeometry args={[0.4, 0.47, 28]} />
        <meshBasicMaterial
          color="#a9f7bd"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function AvailabilityGantry() {
  return (
    <group position={APPROACH_POSITION} scale={0.72}>
      <mesh position={[-0.94, 1.05, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 2.05, 8]} />
        <meshStandardMaterial color="#525d57" metalness={0.45} roughness={0.44} />
      </mesh>
      <mesh position={[0.94, 1.05, 0]}>
        <cylinderGeometry args={[0.035, 0.045, 2.05, 8]} />
        <meshStandardMaterial color="#525d57" metalness={0.45} roughness={0.44} />
      </mesh>
      <mesh position={[0, 1.98, 0]}>
        <boxGeometry args={[2.05, 0.34, 0.13]} />
        <meshStandardMaterial color="#202824" metalness={0.28} roughness={0.42} />
      </mesh>

      <group position={[0, 1.99, 0.075]}>
        {[-0.55, -0.18, 0.18, 0.55].map((x, index) => {
          const free = index !== 2;
          return (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[0.21, 0.09, 0.015]} />
              <meshBasicMaterial color={free ? "#a9f7bd" : "#66716b"} />
            </mesh>
          );
        })}
      </group>

      <mesh position={[0, 1.81, 0.075]}>
        <boxGeometry args={[1.45, 0.026, 0.015]} />
        <meshBasicMaterial color="#d9e5de" transparent opacity={0.32} />
      </mesh>
    </group>
  );
}
