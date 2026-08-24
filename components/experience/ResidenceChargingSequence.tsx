"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EVCharger } from "./ParkingHardware";
import { PremiumVehicle } from "./PremiumVehicle";

export function ResidenceChargingSequence() {
  const cablePulseA = useRef<THREE.Mesh>(null);
  const cablePulseB = useRef<THREE.Mesh>(null);
  const chargeRing = useRef<THREE.Mesh>(null);
  const cameraPosition = useMemo(() => new THREE.Vector3(), []);
  const cameraTarget = useMemo(() => new THREE.Vector3(), []);
  const cameraLookAt = useRef(new THREE.Vector3(2.2, 0.8, -11.2));

  const cableCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(3.1, 1.0, 1.2),
        new THREE.Vector3(3.0, 0.62, 1.52),
        new THREE.Vector3(2.82, 0.5, 1.9),
        new THREE.Vector3(2.52, 0.55, 2.34),
      ]),
    [],
  );
  const cableGeometry = useMemo(
    () => new THREE.TubeGeometry(cableCurve, 42, 0.027, 8, false),
    [cableCurve],
  );

  useFrame(({ clock, camera, size }, delta) => {
    const animatePulse = (mesh: THREE.Mesh | null, offset: number) => {
      if (!mesh) return;
      const progress = (clock.elapsedTime * 0.48 + offset) % 1;
      mesh.position.copy(cableCurve.getPointAt(progress));
      mesh.scale.setScalar(0.72 + Math.sin(progress * Math.PI) * 0.34);
    };
    animatePulse(cablePulseA.current, 0);
    animatePulse(cablePulseB.current, 0.52);

    if (chargeRing.current) {
      const material = chargeRing.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.22 + (Math.sin(clock.elapsedTime * 2.25) + 1) * 0.075;
      const scale = 1 + Math.sin(clock.elapsedTime * 1.7) * 0.035;
      chargeRing.current.scale.setScalar(scale);
    }

    const mobile = size.width <= 760;
    const targetPosition: [number, number, number] = mobile
      ? [6.7, 7.4, -5.2]
      : [7.0, 4.35, -7.0];
    const targetLookAt: [number, number, number] = [2.25, 0.9, -11.4];
    cameraPosition.set(...targetPosition);
    cameraTarget.set(...targetLookAt);
    const ease = 1 - Math.exp(-delta * 4.8);
    camera.position.lerp(cameraPosition, ease);
    cameraLookAt.current.lerp(cameraTarget, ease);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.damp(camera.fov, mobile ? 49 : 38, 5.2, delta);
      camera.updateProjectionMatrix();
    }
    camera.lookAt(cameraLookAt.current);
  });

  return (
    <group>
      <group position={[2.42, 0.24, 2.42]} rotation-y={Math.PI}>
        <PremiumVehicle color="#d6ddd9" scale={0.5} lightsOn={false} />
      </group>

      <EVCharger position={[3.1, 0.22, 1.2]} charging />

      <mesh geometry={cableGeometry}>
        <meshStandardMaterial color="#252d29" metalness={0.18} roughness={0.74} />
      </mesh>
      <mesh ref={cablePulseA}>
        <sphereGeometry args={[0.065, 14, 14]} />
        <meshBasicMaterial color="#a9f7bd" />
      </mesh>
      <mesh ref={cablePulseB}>
        <sphereGeometry args={[0.052, 14, 14]} />
        <meshBasicMaterial color="#d1ffdc" />
      </mesh>

      <mesh ref={chargeRing} rotation-x={-Math.PI / 2} position={[2.42, 0.255, 2.42]}>
        <ringGeometry args={[0.95, 1.06, 54]} />
        <meshBasicMaterial color="#8ff3aa" transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[2.42, 0.85, 2.42]} color="#8ff3aa" intensity={1.65} distance={3.6} />

      <group position={[2.42, 0, 2.42]}>
        {[-0.94, 0.94].map((x) => (
          <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.27, 0]}>
            <planeGeometry args={[0.05, 2.72]} />
            <meshBasicMaterial color="#bafaca" transparent opacity={0.78} />
          </mesh>
        ))}
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.27, -1.33]}>
          <planeGeometry args={[1.88, 0.05]} />
          <meshBasicMaterial color="#bafaca" transparent opacity={0.78} />
        </mesh>
      </group>
    </group>
  );
}
