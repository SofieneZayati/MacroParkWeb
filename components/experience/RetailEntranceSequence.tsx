"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PremiumVehicle } from "./PremiumVehicle";
import { useMotionPreference } from "./useMotionPreference";
import { useStoryCamera } from "./useStoryCamera";

const CAR_COLORS = ["#d7ded9", "#83968c", "#b9c4be"] as const;
const CAR_OFFSETS = [0, 0.34, 0.68] as const;

export function RetailEntranceSequence() {
  const reducedMotion = useMotionPreference();
  const elapsed = useRef(0);
  const cars = useRef<Array<THREE.Group | null>>([]);
  const scanField = useRef<THREE.Mesh>(null);
  const statusBar = useRef<THREE.Mesh>(null);
  const updateCamera = useStoryCamera([-9.1, 0.8, -5.15]);
  const point = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.5, 0.24, 8.1),
        new THREE.Vector3(0.2, 0.24, 6.25),
        new THREE.Vector3(-0.15, 0.24, 4.8),
        new THREE.Vector3(-0.65, 0.24, 3.55),
        new THREE.Vector3(-1.25, 0.24, 2.75),
      ]),
    [],
  );

  useFrame(({ clock, camera, size }, delta) => {
    elapsed.current += delta;
    let nearestScanDistance = Infinity;

    CAR_OFFSETS.forEach((offset, index) => {
      const car = cars.current[index];
      if (!car) return;

      const progress = ((reducedMotion ? 4 : elapsed.current) * 0.105 + offset) % 1;
      const eased = THREE.MathUtils.smoothstep(progress, 0, 1);
      curve.getPointAt(eased, point);
      curve.getTangentAt(Math.min(1, eased + 0.002), tangent);

      car.position.copy(point);
      car.rotation.y = reducedMotion ? Math.atan2(-tangent.x, -tangent.z) : THREE.MathUtils.damp(
        car.rotation.y,
        Math.atan2(-tangent.x, -tangent.z),
        9,
        delta,
      );

      nearestScanDistance = Math.min(nearestScanDistance, Math.abs(point.z - 4.8));
    });

    const scanStrength = THREE.MathUtils.clamp(1 - nearestScanDistance / 0.85, 0, 1);
    if (scanField.current) {
      const material = scanField.current.material as THREE.MeshBasicMaterial;
      material.opacity = scanStrength * (reducedMotion ? 0.22 : 0.22 + Math.sin(clock.elapsedTime * 8) * 0.06);
    }
    if (statusBar.current) {
      const material = statusBar.current.material as THREE.MeshBasicMaterial;
      material.color.set(scanStrength > 0.15 ? "#b9ffca" : "#748078");
    }

    const mobile = size.width <= 760;
    const targetPosition: [number, number, number] = mobile
      ? [-12.4, 7.35, 0.5]
      : [-13.45, 4.7, -2.15];
    const targetLookAt: [number, number, number] = [-9.1, 0.8, -5.15];
    updateCamera(camera, delta, reducedMotion, {
      position: targetPosition,
      lookAt: targetLookAt,
      fov: mobile ? 48 : 37,
      movementDamping: 4.8,
      fovDamping: 5.2,
    });
  });

  return (
    <group>
      {CAR_OFFSETS.map((_, index) => (
        <group
          key={CAR_COLORS[index]}
          ref={(node) => {
            cars.current[index] = node;
          }}
          position={[0.5, 0.24, 8.1]}
        >
          <PremiumVehicle color={CAR_COLORS[index]} scale={0.43} lightsOn={false} />
        </group>
      ))}

      <group position={[1.28, 0, 4.8]}>
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.04, 0.055, 1.52, 8]} />
          <meshStandardMaterial color="#4d5851" metalness={0.42} roughness={0.48} />
        </mesh>
        <mesh position={[-0.08, 1.5, -0.08]} rotation-x={-0.16} rotation-y={-0.28}>
          <boxGeometry args={[0.32, 0.21, 0.42]} />
          <meshStandardMaterial color="#222a26" metalness={0.48} roughness={0.36} />
        </mesh>
        <mesh position={[0.09, 1.56, -0.285]} rotation-x={-0.16}>
          <circleGeometry args={[0.026, 12]} />
          <meshBasicMaterial color="#b9ffca" />
        </mesh>
      </group>

      <mesh ref={scanField} position={[-0.15, 0.9, 4.8]}>
        <boxGeometry args={[2.2, 1.2, 0.02]} />
        <meshBasicMaterial
          color="#a9f7bd"
          transparent
          opacity={0}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[-0.15, 0.255, 4.8]}>
        <ringGeometry args={[0.68, 0.76, 32]} />
        <meshBasicMaterial color="#a9f7bd" transparent opacity={0.42} side={THREE.DoubleSide} />
      </mesh>

      <group position={[-0.15, 0, 3.92]}>
        <mesh position={[-0.82, 1.38, 0]}>
          <cylinderGeometry args={[0.035, 0.05, 2.7, 8]} />
          <meshStandardMaterial color="#535e58" metalness={0.45} roughness={0.44} />
        </mesh>
        <mesh position={[0.82, 1.38, 0]}>
          <cylinderGeometry args={[0.035, 0.05, 2.7, 8]} />
          <meshStandardMaterial color="#535e58" metalness={0.45} roughness={0.44} />
        </mesh>
        <mesh position={[0, 2.65, 0]}>
          <boxGeometry args={[1.78, 0.16, 0.18]} />
          <meshStandardMaterial color="#303934" metalness={0.35} roughness={0.42} />
        </mesh>
        <mesh ref={statusBar} position={[0, 2.65, 0.095]}>
          <boxGeometry args={[1.18, 0.045, 0.012]} />
          <meshBasicMaterial color="#748078" />
        </mesh>
      </group>
    </group>
  );
}
