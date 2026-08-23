"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useExperienceStore } from "./useExperienceStore";

export function EntranceKit() {
  const phase = useExperienceStore((state) => state.phase);
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const arm = useRef<THREE.Group>(null);
  const isOpen = phase !== "arrival" || selectedProblem === "automatic-access";

  useFrame((_, delta) => {
    if (!arm.current) return;
    const desired = isOpen ? Math.PI * 0.47 : 0;
    arm.current.rotation.z = THREE.MathUtils.lerp(
      arm.current.rotation.z,
      desired,
      1 - Math.exp(-delta * 4.6),
    );
  });

  return (
    <group position={[0, 0, 0.25]}>
      <BarrierHousing isOpen={isOpen} />

      <group ref={arm} position={[-2.31, 1.14, 0]}>
        <RoundedBox args={[4.95, 0.135, 0.17]} radius={0.04} position={[2.42, 0, 0]} castShadow>
          <meshStandardMaterial color="#e8ece9" metalness={0.22} roughness={0.36} />
        </RoundedBox>
        {[0.58, 1.62, 2.66, 3.7].map((x) => (
          <mesh key={x} position={[x, 0, 0.096]}>
            <boxGeometry args={[0.42, 0.108, 0.012]} />
            <meshStandardMaterial color="#46514b" roughness={0.42} />
          </mesh>
        ))}
        <mesh position={[4.73, 0, 0.1]}>
          <boxGeometry args={[0.24, 0.09, 0.015]} />
          <meshStandardMaterial color="#a9f5bd" emissive="#55bf74" emissiveIntensity={1.2} />
        </mesh>
      </group>

      <RecognitionPost active={phase === "scan"} />
      <InductionLoop />
      {phase === "scan" && <ScanField />}
    </group>
  );
}

function BarrierHousing({ isOpen }: { isOpen: boolean }) {
  return (
    <group position={[-2.45, 0, 0]}>
      <RoundedBox args={[0.68, 1.5, 0.72]} radius={0.11} position={[0, 0.75, 0]} castShadow>
        <meshStandardMaterial color="#d8ddd9" metalness={0.38} roughness={0.34} />
      </RoundedBox>
      <RoundedBox args={[0.55, 0.16, 0.58]} radius={0.05} position={[0, 1.46, 0]}>
        <meshStandardMaterial color="#252d29" metalness={0.55} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 1.18, 0.365]}>
        <boxGeometry args={[0.34, 0.18, 0.025]} />
        <meshStandardMaterial color="#101713" roughness={0.28} />
      </mesh>
      <mesh position={[0, 1.18, 0.382]}>
        <circleGeometry args={[0.055, 20]} />
        <meshStandardMaterial
          color={isOpen ? "#9df4b7" : "#d7b56b"}
          emissive={isOpen ? "#52b96c" : "#936f29"}
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[0, 0.23, 0.37]}>
        <boxGeometry args={[0.3, 0.055, 0.02]} />
        <meshStandardMaterial color="#7d8982" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.9, 0.1, 0.9]} />
        <meshStandardMaterial color="#1a201d" roughness={0.72} />
      </mesh>
    </group>
  );
}

function RecognitionPost({ active }: { active: boolean }) {
  return (
    <group position={[2.3, 0, 0.25]}>
      <mesh position={[0, 1.32, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 2.64, 12]} />
        <meshStandardMaterial color="#343d38" metalness={0.62} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.07, 0]}>
        <cylinderGeometry args={[0.24, 0.28, 0.14, 16]} />
        <meshStandardMaterial color="#1b211e" metalness={0.35} roughness={0.7} />
      </mesh>

      <group position={[-0.16, 2.48, -0.03]} rotation={[0.02, 0.24, -0.13]}>
        <RoundedBox args={[0.62, 0.28, 0.33]} radius={0.07} castShadow>
          <meshStandardMaterial color="#d2d8d4" metalness={0.38} roughness={0.31} />
        </RoundedBox>
        <RoundedBox args={[0.28, 0.17, 0.04]} radius={0.04} position={[-0.32, 0, 0]}>
          <meshStandardMaterial color="#111814" roughness={0.2} />
        </RoundedBox>
        <mesh position={[-0.345, 0, 0]} rotation-y={Math.PI / 2}>
          <cylinderGeometry args={[0.055, 0.055, 0.045, 18]} />
          <meshStandardMaterial
            color="#99e8ad"
            emissive={active ? "#64da83" : "#1d4a2a"}
            emissiveIntensity={active ? 2.2 : 0.35}
          />
        </mesh>
        {[-0.08, 0.08].map((y) => (
          <mesh key={y} position={[-0.344, y, 0.09]} rotation-y={Math.PI / 2}>
            <cylinderGeometry args={[0.018, 0.018, 0.045, 12]} />
            <meshBasicMaterial color={active ? "#d9ffe3" : "#607068"} />
          </mesh>
        ))}
      </group>

      <group position={[0.1, 1.16, 0.1]}>
        <RoundedBox args={[0.34, 0.5, 0.16]} radius={0.05} castShadow>
          <meshStandardMaterial color="#27302b" metalness={0.35} roughness={0.42} />
        </RoundedBox>
        <mesh position={[0, 0.09, 0.085]}>
          <boxGeometry args={[0.2, 0.12, 0.012]} />
          <meshBasicMaterial color="#7aa389" />
        </mesh>
        <mesh position={[0, -0.11, 0.086]}>
          <circleGeometry args={[0.04, 20]} />
          <meshStandardMaterial color="#98f0b0" emissive="#3c9854" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
  );
}

function InductionLoop() {
  return (
    <group position={[0, 0.028, 2.1]} rotation-x={-Math.PI / 2}>
      <mesh>
        <ringGeometry args={[1.42, 1.46, 4]} />
        <meshBasicMaterial color="#65736b" transparent opacity={0.22} />
      </mesh>
      <mesh scale={[1.75, 1, 1]}>
        <ringGeometry args={[1.42, 1.46, 4]} />
        <meshBasicMaterial color="#65736b" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

function ScanField() {
  const primary = useRef<THREE.Mesh>(null);
  const secondary = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const progress = (Math.sin(clock.elapsedTime * 3.7) + 1) * 0.5;
    if (primary.current) primary.current.position.z = 1.25 + progress * 2;
    if (secondary.current) secondary.current.position.z = 3.25 - progress * 2;
  });

  return (
    <group>
      <mesh ref={primary} rotation-x={-Math.PI / 2} position={[0, 0.055, 2.2]}>
        <planeGeometry args={[5.45, 0.09]} />
        <meshBasicMaterial color="#8ff5ac" transparent opacity={0.82} />
      </mesh>
      <mesh ref={secondary} rotation-x={-Math.PI / 2} position={[0, 0.052, 2.8]}>
        <planeGeometry args={[4.7, 0.035]} />
        <meshBasicMaterial color="#caffd8" transparent opacity={0.38} />
      </mesh>
      <pointLight position={[0, 1.05, 2.25]} color="#8affb0" intensity={4.5} distance={5.8} />
    </group>
  );
}
