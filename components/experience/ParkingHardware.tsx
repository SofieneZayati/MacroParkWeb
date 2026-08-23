"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export function ParkingBlocker({
  position = [0, 0, 0],
  lowered = false,
}: {
  position?: [number, number, number];
  lowered?: boolean;
}) {
  const barrier = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!barrier.current) return;
    const target = lowered ? -1.18 : -0.08;
    barrier.current.rotation.x = THREE.MathUtils.lerp(
      barrier.current.rotation.x,
      target,
      1 - Math.exp(-delta * 4.2),
    );
  });

  return (
    <group position={position}>
      <RoundedBox args={[0.82, 0.11, 0.48]} radius={0.055} position={[0, 0.08, 0]} castShadow>
        <meshStandardMaterial color="#8e9892" metalness={0.62} roughness={0.36} />
      </RoundedBox>
      <RoundedBox args={[0.34, 0.18, 0.32]} radius={0.05} position={[0, 0.18, -0.03]} castShadow>
        <meshStandardMaterial color="#303834" metalness={0.48} roughness={0.38} />
      </RoundedBox>
      <mesh position={[0, 0.205, 0.15]}>
        <boxGeometry args={[0.12, 0.035, 0.025]} />
        <meshStandardMaterial color="#9df4b7" emissive="#4eb767" emissiveIntensity={0.9} />
      </mesh>

      <group ref={barrier} position={[0, 0.2, 0.08]}>
        {[-0.27, 0.27].map((x) => (
          <mesh key={x} position={[x, 0.42, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.84, 12]} />
            <meshStandardMaterial color="#d8ddd9" metalness={0.54} roughness={0.34} />
          </mesh>
        ))}
        <RoundedBox args={[0.62, 0.08, 0.08]} radius={0.035} position={[0, 0.83, 0]} castShadow>
          <meshStandardMaterial color="#d8ddd9" metalness={0.54} roughness={0.34} />
        </RoundedBox>
        <mesh position={[0, 0.83, 0.045]}>
          <boxGeometry args={[0.25, 0.045, 0.012]} />
          <meshStandardMaterial color="#a9f5bd" emissive="#4cb968" emissiveIntensity={0.75} />
        </mesh>
      </group>
    </group>
  );
}

export function EVCharger({
  position = [0, 0, 0],
  compact = false,
  charging = false,
}: {
  position?: [number, number, number];
  compact?: boolean;
  charging?: boolean;
}) {
  const height = compact ? 1.08 : 1.42;
  const status = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (status.current) {
      const material = status.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = charging
        ? 1.3 + (Math.sin(clock.elapsedTime * 3.1) + 1) * 0.48
        : 1.25;
    }
    if (light.current) {
      light.current.intensity = charging
        ? 2.1 + (Math.sin(clock.elapsedTime * 2.7) + 1) * 0.55
        : 2.1;
    }
  });

  return (
    <group position={position} scale={compact ? 0.9 : 1}>
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.09, 18]} />
        <meshStandardMaterial color="#252c28" metalness={0.42} roughness={0.58} />
      </mesh>
      <RoundedBox args={[0.48, height, 0.38]} radius={0.095} position={[0, height / 2 + 0.08, 0]} castShadow>
        <meshStandardMaterial color="#dce2de" metalness={0.32} roughness={0.35} />
      </RoundedBox>
      <RoundedBox args={[0.34, 0.46, 0.035]} radius={0.045} position={[0, height * 0.68, 0.205]}>
        <meshStandardMaterial color="#17211d" metalness={0.18} roughness={0.18} />
      </RoundedBox>
      <mesh ref={status} position={[0, height * 0.74, 0.226]}>
        <boxGeometry args={[0.2, 0.12, 0.012]} />
        <meshStandardMaterial color="#8ff3aa" emissive="#46b961" emissiveIntensity={1.25} />
      </mesh>
      <mesh position={[0, height * 0.57, 0.228]}>
        <circleGeometry args={[0.048, 20]} />
        <meshStandardMaterial color="#29342e" metalness={0.42} roughness={0.28} />
      </mesh>
      <mesh position={[0.29, height * 0.55, 0.02]} rotation-y={Math.PI / 2}>
        <torusGeometry args={[0.24, 0.025, 10, 32, Math.PI * 1.45]} />
        <meshStandardMaterial color="#202622" roughness={0.76} />
      </mesh>
      <RoundedBox args={[0.11, 0.25, 0.09]} radius={0.025} position={[0.31, height * 0.34, 0.16]} rotation={[0, 0, -0.18]}>
        <meshStandardMaterial color="#313a35" metalness={0.34} roughness={0.46} />
      </RoundedBox>
      <pointLight ref={light} position={[0, height * 0.72, 0.48]} color="#91f5ac" intensity={2.1} distance={2.8} />
    </group>
  );
}

export function SolarCanopy({
  position = [0, 0, 2.1],
  scale = 1,
}: {
  position?: [number, number, number];
  scale?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useFrame((_, delta) => {
    if (!root.current) return;
    root.current.scale.x = scale;
    root.current.scale.z = scale;
    root.current.scale.y = reducedMotion
      ? scale
      : THREE.MathUtils.damp(root.current.scale.y, scale, 3.4, delta);
  });

  return (
    <group ref={root} position={position} scale={[scale, reducedMotion ? scale : scale * 0.08, scale]}>
      {[-2.35, 2.35].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, 1.58, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.08, 3.16, 12]} />
            <meshStandardMaterial color="#616c66" metalness={0.64} roughness={0.38} />
          </mesh>
          <mesh position={[0, 3.08, 0]} castShadow>
            <boxGeometry args={[0.14, 0.14, 4.7]} />
            <meshStandardMaterial color="#505a55" metalness={0.66} roughness={0.36} />
          </mesh>
        </group>
      ))}

      <group position={[0, 3.18, 0]} rotation-z={-0.045}>
        {[-1.72, 0, 1.72].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.58, 0.085, 4.48]} />
              <meshStandardMaterial
                color="#162725"
                emissive="#17382f"
                emissiveIntensity={0.16}
                metalness={0.58}
                roughness={0.25}
              />
            </mesh>
            {[-1.45, -0.48, 0.48, 1.45].map((z) => (
              <mesh key={z} position={[0, 0.049, z]}>
                <boxGeometry args={[1.46, 0.008, 0.018]} />
                <meshBasicMaterial color="#49665f" transparent opacity={0.55} />
              </mesh>
            ))}
            <mesh position={[0, 0.05, 0]}>
              <boxGeometry args={[0.018, 0.008, 4.32]} />
              <meshBasicMaterial color="#49665f" transparent opacity={0.52} />
            </mesh>
          </group>
        ))}
      </group>

      <EnergyFlow />
      <pointLight position={[0, 2.7, 0]} color="#ffe2a0" intensity={3.2} distance={7.5} />
    </group>
  );
}

function EnergyFlow() {
  const first = useRef<THREE.Mesh>(null);
  const second = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const animate = (mesh: THREE.Mesh | null, offset: number) => {
      if (!mesh) return;
      const progress = (clock.elapsedTime * 0.52 + offset) % 1;
      mesh.position.y = 3.02 - progress * 2.58;
      mesh.scale.setScalar(0.72 + Math.sin(progress * Math.PI) * 0.42);
    };

    animate(first.current, 0);
    animate(second.current, 0.5);
  });

  return (
    <>
      <mesh ref={first} position={[-0.24, 2.9, 0]}>
        <sphereGeometry args={[0.075, 12, 12]} />
        <meshBasicMaterial color="#ffd88b" />
      </mesh>
      <mesh ref={second} position={[0.24, 1.6, 0]}>
        <sphereGeometry args={[0.075, 12, 12]} />
        <meshBasicMaterial color="#a7f8be" />
      </mesh>
    </>
  );
}
