"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PremiumVehicle } from "./PremiumVehicle";

export function HomeGuestSequence({ allowed }: { allowed: boolean }) {
  const vehicle = useRef<THREE.Group>(null);
  const scanField = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const point = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(1.38, 0, 6.2),
        new THREE.Vector3(1.32, 0, 5.1),
        new THREE.Vector3(1.25, 0, 4.1),
        new THREE.Vector3(1.2, 0, 3.25),
        new THREE.Vector3(1.15, 0, 2.55),
      ]),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!vehicle.current) return;

    const stopAt = allowed ? 1 : 0.47;
    progress.current = Math.min(stopAt, progress.current + delta * 0.24);
    const normalized = progress.current / stopAt;
    const t = allowed
      ? THREE.MathUtils.smoothstep(progress.current, 0, 1)
      : THREE.MathUtils.smoothstep(normalized, 0, 1) * stopAt;

    curve.getPointAt(Math.min(1, t), point);
    curve.getTangentAt(Math.min(1, t + 0.001), tangent).normalize();
    vehicle.current.position.copy(point);
    vehicle.current.rotation.y = THREE.MathUtils.damp(
      vehicle.current.rotation.y,
      Math.atan2(-tangent.x, -tangent.z),
      8,
      delta,
    );

    if (scanField.current) {
      const material = scanField.current.material as THREE.MeshBasicMaterial;
      const distanceFromScan = Math.abs(point.z - 4.05);
      const nearScan = Math.max(0, 0.26 - distanceFromScan * 0.23);
      material.opacity = nearScan * (0.78 + Math.sin(clock.elapsedTime * 7.5) * 0.22);
    }
  });

  const signalColor = allowed ? "#b8ffc9" : "#f2c76f";
  const emissiveColor = allowed ? "#57ce72" : "#ad7927";

  return (
    <group>
      <group ref={vehicle} position={[1.38, 0, 6.2]}>
        <PremiumVehicle color="#9eb2a5" scale={0.54} lightsOn />
      </group>

      <group position={[2.48, 0, 4.05]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.06, 1.2, 12]} />
          <meshStandardMaterial color="#4c5750" metalness={0.44} roughness={0.48} />
        </mesh>
        <mesh position={[-0.08, 1.2, -0.08]} rotation-x={-0.16} rotation-y={-0.24} castShadow>
          <boxGeometry args={[0.32, 0.21, 0.42]} />
          <meshStandardMaterial color="#222a26" metalness={0.5} roughness={0.36} />
        </mesh>
        <mesh position={[-0.08, 1.2, -0.29]} rotation-x={-0.16}>
          <circleGeometry args={[0.066, 20]} />
          <meshStandardMaterial color="#101714" metalness={0.34} roughness={0.18} />
        </mesh>
        <mesh position={[0.09, 1.27, -0.285]} rotation-x={-0.16}>
          <circleGeometry args={[0.025, 14]} />
          <meshStandardMaterial
            color={signalColor}
            emissive={emissiveColor}
            emissiveIntensity={2.1}
          />
        </mesh>
        <pointLight position={[0, 1.15, -0.16]} color={signalColor} intensity={2.1} distance={3.1} />
      </group>

      <mesh ref={scanField} position={[1.25, 0.7, 4.05]}>
        <boxGeometry args={[2.15, 1.15, 0.02]} />
        <meshBasicMaterial
          color={signalColor}
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[1.25, 0.08, 4.05]}>
        <ringGeometry args={[0.66, 0.74, 48]} />
        <meshBasicMaterial
          color={signalColor}
          transparent
          opacity={allowed ? 0.46 : 0.58}
          side={THREE.DoubleSide}
        />
      </mesh>

      {!allowed && (
        <>
          <mesh position={[1.25, 0.14, 3.52]} rotation-z={-0.03}>
            <boxGeometry args={[1.85, 0.06, 0.12]} />
            <meshStandardMaterial color="#b38335" emissive="#71470f" emissiveIntensity={0.4} />
          </mesh>
          <pointLight position={[1.25, 0.5, 3.62]} color="#efc36f" intensity={1.35} distance={2.5} />
        </>
      )}
    </group>
  );
}
