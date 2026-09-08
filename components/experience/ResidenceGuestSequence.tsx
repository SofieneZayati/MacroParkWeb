"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PremiumVehicle } from "./PremiumVehicle";
import { useMotionPreference } from "./useMotionPreference";
import { useStoryCamera } from "./useStoryCamera";

export function ResidenceGuestSequence({ allowed }: { allowed: boolean }) {
  const reducedMotion = useMotionPreference();
  const vehicle = useRef<THREE.Group>(null);
  const scanField = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const sampledProgress = useRef(-1);
  const point = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const updateCamera = useStoryCamera([0, 0.9, -9.6]);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.15, 0.24, 6.45),
        new THREE.Vector3(0.1, 0.24, 5.4),
        new THREE.Vector3(0.05, 0.24, 4.45),
        new THREE.Vector3(0.02, 0.24, 3.4),
        new THREE.Vector3(0, 0.24, 2.42),
      ]),
    [],
  );

  useEffect(() => {
    progress.current = 0;
    sampledProgress.current = -1;
    vehicle.current?.rotation.set(0, 0, 0);
  }, [allowed]);

  useFrame(({ clock, camera, size }, delta) => {
    if (!vehicle.current) return;

    const stopAt = allowed ? 1 : 0.47;
    progress.current = reducedMotion ? stopAt : Math.min(stopAt, progress.current + delta * 0.23);
    if (sampledProgress.current !== progress.current) {
      const normalized = progress.current / stopAt;
      const t = allowed
        ? THREE.MathUtils.smoothstep(progress.current, 0, 1)
        : THREE.MathUtils.smoothstep(normalized, 0, 1) * stopAt;
      curve.getPointAt(Math.min(1, t), point);
      curve.getTangentAt(Math.min(1, t + 0.001), tangent);
      vehicle.current.position.copy(point);
      sampledProgress.current = progress.current;
    }
    const heading = Math.atan2(-tangent.x, -tangent.z);
    if (Math.abs(vehicle.current.rotation.y - heading) > 0.0001) {
      vehicle.current.rotation.y = reducedMotion
        ? heading
        : THREE.MathUtils.damp(vehicle.current.rotation.y, heading, 8, delta);
    }

    if (scanField.current) {
      const material = scanField.current.material as THREE.MeshBasicMaterial;
      const distanceFromScan = Math.abs(point.z - 4.45);
      const nearScan = Math.max(0, 0.28 - distanceFromScan * 0.24);
      material.opacity = nearScan * (reducedMotion ? 1 : 0.78 + Math.sin(clock.elapsedTime * 7.6) * 0.22);
    }

    const mobile = size.width <= 760;
    const targetPosition: [number, number, number] = mobile
      ? [3.05, 7.05, -4.1]
      : [3.0, 4.15, -5.15];
    const targetLookAt: [number, number, number] = allowed && progress.current > 0.7
      ? [0, 0.7, -11.4]
      : [0, 0.9, -9.55];
    updateCamera(camera, delta, reducedMotion, {
      position: targetPosition,
      lookAt: targetLookAt,
      fov: mobile ? 49 : 39,
      movementDamping: 5,
      fovDamping: 5.2,
    });
  });

  const signalColor = allowed ? "#b8ffc9" : "#f2c76f";
  const emissiveColor = allowed ? "#57ce72" : "#ad7927";

  return (
    <group>
      <group ref={vehicle} position={[0.15, 0.24, 6.45]}>
        <PremiumVehicle color="#a7b6ae" scale={0.5} lightsOn />
      </group>

      <group position={[1.5, 0, 4.45]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.042, 0.058, 1.36, 12]} />
          <meshStandardMaterial color="#4c5750" metalness={0.44} roughness={0.48} />
        </mesh>
        <mesh position={[-0.07, 1.56, -0.08]} rotation-x={-0.16} rotation-y={-0.24} castShadow>
          <boxGeometry args={[0.32, 0.21, 0.42]} />
          <meshStandardMaterial color="#222a26" metalness={0.5} roughness={0.36} />
        </mesh>
        <mesh position={[0.09, 1.62, -0.285]} rotation-x={-0.16}>
          <circleGeometry args={[0.025, 14]} />
          <meshStandardMaterial color={signalColor} emissive={emissiveColor} emissiveIntensity={2.1} />
        </mesh>
      </group>

      <mesh ref={scanField} position={[0.05, 0.92, 4.45]}>
        <boxGeometry args={[2.05, 1.2, 0.02]} />
        <meshBasicMaterial color={signalColor} transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[0.05, 0.255, 4.45]}>
        <ringGeometry args={[0.66, 0.74, 48]} />
        <meshBasicMaterial color={signalColor} transparent opacity={allowed ? 0.46 : 0.58} side={THREE.DoubleSide} />
      </mesh>

      {allowed ? (
        <group position={[0, 0, 2.42]}>
          <mesh rotation-x={-Math.PI / 2} position={[0, 0.255, 0]}>
            <planeGeometry args={[1.9, 2.8]} />
            <meshBasicMaterial color="#b8ffc9" transparent opacity={0.12} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ) : (
        <>
          <mesh position={[0.05, 0.34, 3.76]} rotation-z={-0.02}>
            <boxGeometry args={[1.8, 0.07, 0.12]} />
            <meshStandardMaterial color="#b38335" emissive="#71470f" emissiveIntensity={0.4} />
          </mesh>
        </>
      )}
    </group>
  );
}
