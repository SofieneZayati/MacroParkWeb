"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PremiumVehicle } from "./PremiumVehicle";

export function HomeAccessSequence({ onRecognized }: { onRecognized: () => void }) {
  const vehicle = useRef<THREE.Group>(null);
  const scanField = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const recognizedOnce = useRef(false);
  const [recognized, setRecognized] = useState(false);
  const point = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.62, 0, 6.35),
        new THREE.Vector3(-0.7, 0, 5.1),
        new THREE.Vector3(-0.77, 0, 3.95),
        new THREE.Vector3(-0.82, 0, 2.8),
        new THREE.Vector3(-0.82, 0, 1.72),
      ]),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!vehicle.current) return;

    progress.current = Math.min(1, progress.current + delta * 0.25);
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
      const distanceFromScan = Math.abs(point.z - 4.05);
      material.opacity = Math.max(0, 0.28 - distanceFromScan * 0.22) *
        (0.78 + Math.sin(clock.elapsedTime * 8) * 0.22);
    }

    if (!recognizedOnce.current && progress.current >= 0.34) {
      recognizedOnce.current = true;
      setRecognized(true);
      onRecognized();
    }
  });

  return (
    <group>
      <group ref={vehicle} position={[-0.62, 0, 6.35]}>
        <PremiumVehicle color="#d8dfdb" scale={0.54} lightsOn />
      </group>

      <group position={[0.68, 0, 4.05]}>
        <mesh position={[0, 0.62, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.065, 1.24, 12]} />
          <meshStandardMaterial color="#4d5851" metalness={0.45} roughness={0.48} />
        </mesh>
        <mesh position={[-0.08, 1.25, -0.08]} rotation-x={-0.18} rotation-y={-0.22} castShadow>
          <boxGeometry args={[0.34, 0.22, 0.46]} />
          <meshStandardMaterial color="#232b27" metalness={0.52} roughness={0.36} />
        </mesh>
        <mesh position={[-0.08, 1.25, -0.318]} rotation-x={-0.18}>
          <circleGeometry args={[0.07, 20]} />
          <meshStandardMaterial color="#101714" metalness={0.35} roughness={0.18} />
        </mesh>
        <mesh position={[0.1, 1.31, -0.31]} rotation-x={-0.18}>
          <circleGeometry args={[0.025, 14]} />
          <meshStandardMaterial
            color={recognized ? "#b9ffcb" : "#65726a"}
            emissive={recognized ? "#5fd87a" : "#000000"}
            emissiveIntensity={recognized ? 2.2 : 0}
          />
        </mesh>
        {recognized && (
          <pointLight position={[0, 1.18, -0.2]} color="#93ffad" intensity={2.4} distance={3.2} />
        )}
      </group>

      <mesh ref={scanField} position={[-0.78, 0.72, 4.05]}>
        <boxGeometry args={[2.25, 1.25, 0.022]} />
        <meshBasicMaterial
          color="#a9f7bd"
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[-0.78, 0.08, 4.05]}>
        <ringGeometry args={[0.7, 0.77, 48]} />
        <meshBasicMaterial
          color={recognized ? "#b8ffc9" : "#738279"}
          transparent
          opacity={recognized ? 0.62 : 0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
