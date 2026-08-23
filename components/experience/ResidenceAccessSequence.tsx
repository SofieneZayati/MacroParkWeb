"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PremiumVehicle } from "./PremiumVehicle";

export function ResidenceAccessSequence({
  onRecognized,
}: {
  onRecognized: () => void;
}) {
  const vehicle = useRef<THREE.Group>(null);
  const scanField = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const recognitionHold = useRef(0);
  const recognizedOnce = useRef(false);
  const [recognized, setRecognized] = useState(false);
  const point = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-2.45, 0, 6.45),
        new THREE.Vector3(-2.45, 0, 5.35),
        new THREE.Vector3(-2.45, 0, 4.45),
        new THREE.Vector3(-2.45, 0, 3.35),
        new THREE.Vector3(-2.45, 0, 2.42),
      ]),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!vehicle.current) return;

    if (recognizedOnce.current && recognitionHold.current < 0.72) {
      recognitionHold.current += delta;
    } else {
      progress.current = Math.min(1, progress.current + delta * 0.24);
    }

    if (!recognizedOnce.current && progress.current >= 0.39) {
      recognizedOnce.current = true;
      setRecognized(true);
      onRecognized();
    }

    const t = THREE.MathUtils.smoothstep(progress.current, 0, 1);
    curve.getPointAt(t, point);
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
      const distanceFromScan = Math.abs(point.z - 4.45);
      const proximity = Math.max(0, 0.3 - distanceFromScan * 0.27);
      material.opacity = proximity * (0.78 + Math.sin(clock.elapsedTime * 8.2) * 0.22);
    }
  });

  return (
    <group>
      <group ref={vehicle} position={[-2.45, 0, 6.45]}>
        <PremiumVehicle color="#cfd8d2" scale={0.5} lightsOn />
      </group>

      <group position={[-0.82, 0, 4.45]}>
        <mesh position={[0, 0.66, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.065, 1.32, 12]} />
          <meshStandardMaterial color="#4d5851" metalness={0.45} roughness={0.48} />
        </mesh>
        <mesh position={[-0.08, 1.32, -0.08]} rotation-x={-0.17} rotation-y={-0.35} castShadow>
          <boxGeometry args={[0.34, 0.22, 0.44]} />
          <meshStandardMaterial color="#222a26" metalness={0.52} roughness={0.35} />
        </mesh>
        <mesh position={[-0.08, 1.32, -0.303]} rotation-x={-0.17}>
          <circleGeometry args={[0.07, 20]} />
          <meshStandardMaterial color="#0f1613" metalness={0.3} roughness={0.18} />
        </mesh>
        <mesh position={[0.09, 1.38, -0.3]} rotation-x={-0.17}>
          <circleGeometry args={[0.025, 14]} />
          <meshStandardMaterial
            color={recognized ? "#b9ffca" : "#67736c"}
            emissive={recognized ? "#55d174" : "#000000"}
            emissiveIntensity={recognized ? 2.2 : 0}
          />
        </mesh>
        {recognized && (
          <pointLight position={[0, 1.22, -0.15]} color="#98ffb0" intensity={2.4} distance={3.1} />
        )}
      </group>

      <mesh ref={scanField} position={[-2.45, 0.72, 4.45]}>
        <boxGeometry args={[2.18, 1.22, 0.02]} />
        <meshBasicMaterial
          color="#a9f7bd"
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[-2.45, 0.085, 4.45]}>
        <ringGeometry args={[0.68, 0.76, 48]} />
        <meshBasicMaterial
          color={recognized ? "#b8ffc9" : "#718078"}
          transparent
          opacity={recognized ? 0.62 : 0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
