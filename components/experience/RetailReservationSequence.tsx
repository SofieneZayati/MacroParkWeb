"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PremiumVehicle } from "./PremiumVehicle";

export function RetailReservationSequence() {
  const vehicle = useRef<THREE.Group>(null);
  const bayGlow = useRef<THREE.Mesh>(null);
  const recognitionRing = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const matchHold = useRef(0);
  const matchedOnce = useRef(false);
  const [matched, setMatched] = useState(false);
  const point = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.8, 0.24, 6.55),
        new THREE.Vector3(-3.62, 0.24, 5.45),
        new THREE.Vector3(-3.3, 0.24, 4.45),
        new THREE.Vector3(-2.9, 0.24, 3.35),
        new THREE.Vector3(-2.7, 0.24, 2.45),
      ]),
    [],
  );

  useFrame(({ clock }, delta) => {
    if (!vehicle.current) return;

    if (matchedOnce.current && matchHold.current < 0.58) {
      matchHold.current += delta;
    } else {
      progress.current = Math.min(1, progress.current + delta * 0.22);
    }

    if (!matchedOnce.current && progress.current >= 0.37) {
      matchedOnce.current = true;
      setMatched(true);
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

    if (bayGlow.current) {
      const material = bayGlow.current.material as THREE.MeshBasicMaterial;
      const base = matched ? 0.24 : 0.15;
      material.opacity = base + (Math.sin(clock.elapsedTime * 2.4) + 1) * 0.055;
    }

    if (recognitionRing.current) {
      const material = recognitionRing.current.material as THREE.MeshBasicMaterial;
      material.opacity = matched ? 0.58 : 0.24 + (Math.sin(clock.elapsedTime * 2.2) + 1) * 0.06;
    }
  });

  const color = matched ? "#b9ffca" : "#f2c76f";
  const bodyColor = matched ? "#3f7150" : "#80612a";

  return (
    <group>
      <group ref={vehicle} position={[-3.8, 0.24, 6.55]}>
        <PremiumVehicle color="#d4dbd7" scale={0.46} lightsOn={false} />
      </group>

      <group position={[-2.7, 0, 2.45]}>
        <mesh ref={bayGlow} rotation-x={-Math.PI / 2} position={[0, 0.255, 0]}>
          <planeGeometry args={[1.42, 3.02]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
        {[-0.68, 0.68].map((x) => (
          <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.27, 0]}>
            <planeGeometry args={[0.05, 2.9]} />
            <meshBasicMaterial color={color} transparent opacity={0.9} />
          </mesh>
        ))}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.27, -1.42]}>
          <planeGeometry args={[1.38, 0.05]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>

        <group position={[0, 0, -1.24]}>
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.028, 0.04, 1.5, 8]} />
            <meshStandardMaterial color="#59635e" metalness={0.42} roughness={0.46} />
          </mesh>
          <mesh position={[0, 1.54, 0]}>
            <boxGeometry args={[1.02, 0.11, 0.13]} />
            <meshStandardMaterial color={color} emissive={bodyColor} emissiveIntensity={0.9} />
          </mesh>
          <mesh position={[0, 1.54, -0.07]}>
            <boxGeometry args={[0.56, 0.026, 0.01]} />
            <meshBasicMaterial color={matched ? "#effff3" : "#fff1cf"} />
          </mesh>
        </group>
      </group>

      <group position={[-3.28, 0, 4.52]}>
        <mesh position={[0.72, 0.82, -0.18]}>
          <cylinderGeometry args={[0.03, 0.045, 1.5, 8]} />
          <meshStandardMaterial color="#505a55" metalness={0.44} roughness={0.46} />
        </mesh>
        <mesh position={[0.67, 1.52, -0.24]} rotation-x={-0.12} rotation-y={-0.2}>
          <boxGeometry args={[0.26, 0.18, 0.32]} />
          <meshStandardMaterial color="#202824" metalness={0.46} roughness={0.35} />
        </mesh>
        <mesh position={[0.58, 1.56, -0.4]} rotation-x={-0.12}>
          <circleGeometry args={[0.022, 12]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh ref={recognitionRing} rotation-x={-Math.PI / 2} position={[0, 0.255, 0]}>
          <ringGeometry args={[0.52, 0.6, 34]} />
          <meshBasicMaterial color={color} transparent opacity={0.32} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}
