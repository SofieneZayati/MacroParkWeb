"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperienceStore } from "./useExperienceStore";

const BAY_STATUS = ["free", "selected", "occupied", "free"] as const;
const BAY_X = [-2.7, -0.9, 0.9, 2.7] as const;

export function RetailAvailabilityLayer() {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const selectedPulse = useRef<THREE.Mesh>(null);
  const approachPulse = useRef<THREE.Mesh>(null);
  const active = selectedEnvironment === "retail" && selectedProblem === "parking-guidance";

  useFrame(({ clock }) => {
    if (!active) return;

    if (selectedPulse.current) {
      const material = selectedPulse.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.52 + (Math.sin(clock.elapsedTime * 2.8) + 1) * 0.12;
    }
    if (approachPulse.current) {
      const material = approachPulse.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.34 + (Math.sin(clock.elapsedTime * 2.2) + 1) * 0.08;
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
            <mesh position={[0, 1.25, -1.15]}>
              <cylinderGeometry args={[0.028, 0.04, 2.35, 7]} />
              <meshStandardMaterial color="#56615b" metalness={0.4} roughness={0.48} />
            </mesh>
            <mesh position={[0, 2.38, -1.15]}>
              <boxGeometry args={[0.58, 0.11, 0.14]} />
              <meshBasicMaterial color={color} />
            </mesh>
            <mesh position={[0, 2.38, -1.23]}>
              <boxGeometry args={[0.28, 0.035, 0.012]} />
              <meshBasicMaterial color={free ? "#effff3" : "#8a958f"} />
            </mesh>

            {selected && (
              <mesh ref={selectedPulse} rotation-x={-Math.PI / 2} position={[0, 0.12, 0]}>
                <ringGeometry args={[0.62, 0.72, 36]} />
                <meshBasicMaterial
                  color="#b9ffca"
                  transparent
                  opacity={0.62}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
          </group>
        );
      })}

      <mesh ref={approachPulse} rotation-x={-Math.PI / 2} position={[-2.05, 0.085, 5.18]}>
        <ringGeometry args={[0.52, 0.62, 34]} />
        <meshBasicMaterial
          color="#a9f7bd"
          transparent
          opacity={0.42}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function AvailabilityGantry() {
  return (
    <group position={[-2.05, 0, 5.18]}>
      <mesh position={[-1.22, 1.35, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 2.65, 8]} />
        <meshStandardMaterial color="#525d57" metalness={0.45} roughness={0.44} />
      </mesh>
      <mesh position={[1.22, 1.35, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 2.65, 8]} />
        <meshStandardMaterial color="#525d57" metalness={0.45} roughness={0.44} />
      </mesh>
      <mesh position={[0, 2.58, 0]}>
        <boxGeometry args={[2.62, 0.5, 0.16]} />
        <meshStandardMaterial color="#202824" metalness={0.28} roughness={0.42} />
      </mesh>

      <group position={[0, 2.58, 0.09]}>
        {[-0.72, -0.24, 0.24, 0.72].map((x, index) => {
          const free = index !== 2;
          return (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[0.28, 0.14, 0.018]} />
              <meshBasicMaterial color={free ? "#a9f7bd" : "#66716b"} />
            </mesh>
          );
        })}
      </group>

      <mesh position={[0, 2.35, 0.09]}>
        <boxGeometry args={[1.9, 0.035, 0.018]} />
        <meshBasicMaterial color="#d9e5de" transparent opacity={0.38} />
      </mesh>
    </group>
  );
}
