"use client";

import { RoundedBox } from "@react-three/drei";
import { useExperienceStore } from "./useExperienceStore";

export function PremiumVehicle({
  color = "#dce2de",
  scale = 1,
  lightsOn = true,
}: {
  color?: string;
  scale?: number;
  lightsOn?: boolean;
}) {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const introVehicle = lightsOn && scale === 1;

  if (introVehicle && selectedEnvironment) return null;

  return (
    <group scale={scale}>
      <mesh position={[0, 0.23, 0]} castShadow>
        <boxGeometry args={[1.66, 0.16, 3.12]} />
        <meshStandardMaterial color="#121715" metalness={0.35} roughness={0.52} />
      </mesh>

      <RoundedBox args={[1.74, 0.42, 3.26]} radius={0.22} position={[0, 0.48, 0]} castShadow>
        <meshStandardMaterial color={color} metalness={0.58} roughness={0.24} />
      </RoundedBox>

      <RoundedBox args={[1.52, 0.18, 1.18]} radius={0.16} position={[0, 0.7, -0.98]} castShadow>
        <meshStandardMaterial color={color} metalness={0.56} roughness={0.25} />
      </RoundedBox>

      <RoundedBox args={[1.42, 0.5, 1.56]} radius={0.22} position={[0, 0.88, 0.08]} castShadow>
        <meshStandardMaterial color="#17211d" metalness={0.3} roughness={0.18} />
      </RoundedBox>

      <mesh position={[0, 1.13, 0.08]}>
        <boxGeometry args={[1.04, 0.025, 0.9]} />
        <meshStandardMaterial color="#0d1512" metalness={0.5} roughness={0.12} />
      </mesh>

      <mesh position={[0, 0.88, -0.72]} rotation-x={-0.27}>
        <boxGeometry args={[1.24, 0.025, 0.66]} />
        <meshStandardMaterial color="#23332d" metalness={0.35} roughness={0.12} transparent opacity={0.9} />
      </mesh>

      <mesh position={[0, 0.88, 0.82]} rotation-x={0.25}>
        <boxGeometry args={[1.2, 0.025, 0.54]} />
        <meshStandardMaterial color="#1d2b26" metalness={0.35} roughness={0.14} transparent opacity={0.86} />
      </mesh>

      {[-0.9, 0.9].map((z) => (
        <group key={z}>
          <Wheel x={-0.76} z={z} />
          <Wheel x={0.76} z={z} />
        </group>
      ))}

      {[-0.55, 0.55].map((x) => (
        <mesh key={`head-${x}`} position={[x, 0.55, -1.64]}>
          <boxGeometry args={[0.34, 0.09, 0.035]} />
          <meshStandardMaterial
            color="#effff5"
            emissive={lightsOn ? "#d8ffe6" : "#4a544e"}
            emissiveIntensity={lightsOn ? 2.2 : 0.2}
          />
        </mesh>
      ))}

      {[-0.54, 0.54].map((x) => (
        <mesh key={`tail-${x}`} position={[x, 0.53, 1.64]}>
          <boxGeometry args={[0.3, 0.085, 0.035]} />
          <meshStandardMaterial color="#8e211f" emissive="#ff4f49" emissiveIntensity={0.9} />
        </mesh>
      ))}

      <mesh position={[0, 0.39, 1.665]}>
        <boxGeometry args={[0.62, 0.16, 0.02]} />
        <meshStandardMaterial color="#e8ece9" roughness={0.36} />
      </mesh>
      <mesh position={[0, 0.39, 1.68]}>
        <boxGeometry args={[0.46, 0.035, 0.01]} />
        <meshBasicMaterial color="#3a433e" />
      </mesh>

      <mesh position={[-0.83, 0.86, -0.25]} rotation-z={0.12}>
        <boxGeometry args={[0.16, 0.08, 0.28]} />
        <meshStandardMaterial color={color} metalness={0.52} roughness={0.28} />
      </mesh>
      <mesh position={[0.83, 0.86, -0.25]} rotation-z={-0.12}>
        <boxGeometry args={[0.16, 0.08, 0.28]} />
        <meshStandardMaterial color={color} metalness={0.52} roughness={0.28} />
      </mesh>

      <mesh position={[0, 0.34, -1.65]}>
        <boxGeometry args={[0.84, 0.07, 0.03]} />
        <meshStandardMaterial color="#0c100e" metalness={0.7} roughness={0.32} />
      </mesh>

      {lightsOn && (
        <>
          <pointLight position={[-0.5, 0.55, -1.82]} color="#e8fff0" intensity={1.6} distance={4.2} />
          <pointLight position={[0.5, 0.55, -1.82]} color="#e8fff0" intensity={1.6} distance={4.2} />
        </>
      )}
    </group>
  );
}

function Wheel({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0.29, z]} rotation-z={Math.PI / 2}>
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.18, 24]} />
        <meshStandardMaterial color="#070908" roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.095, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.02, 18]} />
        <meshStandardMaterial color="#606963" metalness={0.78} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.108, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.018, 16]} />
        <meshStandardMaterial color="#1b211e" metalness={0.7} roughness={0.34} />
      </mesh>
    </group>
  );
}
