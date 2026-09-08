"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PremiumVehicle } from "./PremiumVehicle";
import { useMotionPreference } from "./useMotionPreference";
import { useStoryCamera } from "./useStoryCamera";

export function RetailReservationSequence() {
  const reducedMotion = useMotionPreference();
  const vehicle = useRef<THREE.Group>(null);
  const waitingState = useRef<THREE.Group>(null);
  const matchedState = useRef<THREE.Group>(null);
  const recognitionRing = useRef<THREE.Mesh>(null);
  const progress = useRef(0);
  const sampledProgress = useRef(-1);
  const matchHold = useRef(0);
  const matchedOnce = useRef(false);
  const point = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const updateCamera = useStoryCamera([-11.2, 0.4, -6.2]);
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

  useFrame(({ clock, camera, size }, delta) => {
    if (!vehicle.current) return;

    if (reducedMotion) {
      progress.current = 1;
    } else if (matchedOnce.current && matchHold.current < 0.58) {
      matchHold.current += delta;
    } else {
      progress.current = Math.min(1, progress.current + delta * 0.22);
    }

    if (!matchedOnce.current && progress.current >= 0.37) {
      matchedOnce.current = true;
    }

    // React/Suspense can restore the JSX visibility after a renderer update.
    // Reconcile from the story state so a matched bay cannot disappear.
    if (waitingState.current) waitingState.current.visible = !matchedOnce.current;
    if (matchedState.current) matchedState.current.visible = matchedOnce.current;

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

    if (recognitionRing.current) {
      const material = recognitionRing.current.material as THREE.MeshBasicMaterial;
      material.color.set(matchedOnce.current ? "#b9ffca" : "#f2c76f");
      material.opacity = matchedOnce.current
        ? 0.58
        : reducedMotion ? 0.3 : 0.24 + (Math.sin(clock.elapsedTime * 2.2) + 1) * 0.06;
    }

    const mobile = size.width <= 760;
    const parkingFocus = progress.current >= 0.65;
    const targetPosition: [number, number, number] = mobile
      ? parkingFocus
        ? [-12.75, 6.8, -2.2]
        : [-13.5, 7.0, -1.0]
      : parkingFocus
        ? [-14.4, 4.0, -3.65]
        : [-15.4, 4.3, -2.4];
    const targetLookAt: [number, number, number] = parkingFocus
      ? [-11.1, 0.35, -7.65]
      : [-11.25, 0.4, -6.15];

    updateCamera(camera, delta, reducedMotion, {
      position: targetPosition,
      lookAt: targetLookAt,
      fov: mobile ? 50 : parkingFocus ? 38 : 39,
      movementDamping: parkingFocus ? 4.4 : 5.2,
      fovDamping: 5.2,
    });
  });

  return (
    <group>
      <group ref={vehicle} position={[-3.8, 0.24, 6.55]}>
        <PremiumVehicle color="#d4dbd7" scale={0.46} lightsOn={false} />
      </group>

      <group position={[-2.7, 0, 2.45]}>
        <group ref={waitingState}>
          <ReservationBayState color="#f2c76f" emissive="#80612a" />
        </group>
        <group ref={matchedState} visible={false}>
          <ReservationBayState color="#b9ffca" emissive="#3f7150" />
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
          <meshBasicMaterial color="#dce8e1" />
        </mesh>
        <mesh ref={recognitionRing} rotation-x={-Math.PI / 2} position={[0, 0.255, 0]}>
          <ringGeometry args={[0.52, 0.6, 34]} />
          <meshBasicMaterial color="#f2c76f" transparent opacity={0.32} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

function ReservationBayState({ color, emissive }: { color: string; emissive: string }) {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.255, 0]}>
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
          <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.9} />
        </mesh>
        <mesh position={[0, 1.54, -0.07]}>
          <boxGeometry args={[0.56, 0.026, 0.01]} />
          <meshBasicMaterial color={color === "#b9ffca" ? "#effff3" : "#fff1cf"} />
        </mesh>
      </group>
    </>
  );
}
