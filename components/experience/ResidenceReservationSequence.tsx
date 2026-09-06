"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PremiumVehicle } from "./PremiumVehicle";
import { useMotionPreference } from "./useMotionPreference";

export function ResidenceReservationSequence() {
  const reducedMotion = useMotionPreference();
  const vehicle = useRef<THREE.Group>(null);
  const bayGlow = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const sampledProgress = useRef(-1);
  const matchHold = useRef(0);
  const matchedOnce = useRef(false);
  const [matched, setMatched] = useState(false);
  const point = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const cameraPosition = useMemo(() => new THREE.Vector3(), []);
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const cameraLookAt = useRef(new THREE.Vector3(0, 0.75, 4.2));
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.24, 6.45),
        new THREE.Vector3(0, 0.24, 5.4),
        new THREE.Vector3(0, 0.24, 4.45),
        new THREE.Vector3(0, 0.24, 3.25),
        new THREE.Vector3(0, 0.24, 2.38),
      ]),
    [],
  );

  useFrame(({ clock, camera, size }, delta) => {
    if (!vehicle.current) return;

    if (reducedMotion) {
      progress.current = 1;
    } else if (matchedOnce.current && matchHold.current < 0.62) {
      matchHold.current += delta;
    } else {
      progress.current = Math.min(1, progress.current + delta * 0.23);
    }

    if (!matchedOnce.current && progress.current >= 0.42) {
      matchedOnce.current = true;
      setMatched(true);
    }

    if (sampledProgress.current !== progress.current) {
      const t = THREE.MathUtils.smoothstep(progress.current, 0, 1);
      curve.getPointAt(t, point);
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

    if (bayGlow.current) {
      const material = bayGlow.current.material as THREE.MeshBasicMaterial;
      const base = matched ? 0.23 : 0.17;
      material.opacity = base + (reducedMotion ? 0.06 : (Math.sin(clock.elapsedTime * 2.6) + 1) * 0.06);
    }

    const mobile = size.width <= 760;
    const parkingFocus = progress.current >= 0.68;
    const targetPosition: [number, number, number] = mobile
      ? parkingFocus
        ? [2.6, 7.1, -5.25]
        : [3.2, 7.1, -4.0]
      : parkingFocus
        ? [2.35, 3.85, -6.75]
        : [3.05, 4.25, -5.1];
    const targetLookAt: [number, number, number] = parkingFocus
      ? [0, 0.55, -11.65]
      : [0, 0.9, -9.55];

    cameraPosition.set(...targetPosition);
    cameraTarget.set(...targetLookAt);
    const ease = reducedMotion ? 1 : 1 - Math.exp(-delta * (parkingFocus ? 4.2 : 5.2));
    camera.position.lerp(cameraPosition, ease);
    cameraLookAt.current.lerp(cameraTarget, ease);

    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = mobile ? 49 : parkingFocus ? 39 : 38;
      if (Math.abs(camera.fov - targetFov) > 0.001) {
        camera.fov = reducedMotion ? targetFov : THREE.MathUtils.damp(camera.fov, targetFov, 5.4, delta);
        camera.updateProjectionMatrix();
      }
    }
    camera.lookAt(cameraLookAt.current);
  });

  const color = matched ? "#a9f7bd" : "#f2c76f";
  const emissive = matched ? "#4cc66a" : "#9b681d";

  return (
    <group>
      <group ref={vehicle} position={[0, 0.24, 6.45]}>
        <PremiumVehicle color="#c9d1cc" scale={0.5} lightsOn />
      </group>

      <group position={[0, 0, 2.38]}>
        <mesh ref={bayGlow} rotation-x={-Math.PI / 2} position={[0, 0.255, 0]}>
          <planeGeometry args={[1.95, 2.85]} />
          <meshBasicMaterial color={color} transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
        {[-0.94, 0.94].map((x) => (
          <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.27, 0]}>
            <planeGeometry args={[0.055, 2.72]} />
            <meshBasicMaterial color={color} transparent opacity={0.92} />
          </mesh>
        ))}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.27, -1.33]}>
          <planeGeometry args={[1.9, 0.055]} />
          <meshBasicMaterial color={color} transparent opacity={0.92} />
        </mesh>

        <group position={[0, 0, -1.18]}>
          <mesh position={[0, 0.82, 0]}>
            <cylinderGeometry args={[0.032, 0.045, 1.55, 10]} />
            <meshStandardMaterial color="#606b65" metalness={0.5} roughness={0.43} />
          </mesh>
          <mesh position={[0, 1.58, 0]}>
            <boxGeometry args={[1.15, 0.12, 0.15]} />
            <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={1.45} />
          </mesh>
        </group>
      </group>

      <group position={[1.45, 0, 4.45]}>
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.04, 0.055, 1.35, 10]} />
          <meshStandardMaterial color="#4f5953" metalness={0.45} roughness={0.48} />
        </mesh>
        <mesh position={[-0.06, 1.55, -0.08]} rotation-x={-0.14} rotation-y={-0.24}>
          <boxGeometry args={[0.31, 0.2, 0.4]} />
          <meshStandardMaterial color="#202824" metalness={0.52} roughness={0.34} />
        </mesh>
        <mesh position={[0.09, 1.6, -0.28]} rotation-x={-0.14}>
          <circleGeometry args={[0.024, 14]} />
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={2} />
        </mesh>
      </group>

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.255, 4.45]}>
        <ringGeometry args={[0.66, 0.75, 48]} />
        <meshBasicMaterial color={color} transparent opacity={matched ? 0.62 : 0.34} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
