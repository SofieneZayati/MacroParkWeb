"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useCursor } from "@react-three/drei";
import * as THREE from "three";
import {
  type EnvironmentId,
  useExperienceStore,
} from "./useExperienceStore";

const CAMERA: Record<string, { position: [number, number, number]; lookAt: [number, number, number] }> = {
  arrival: { position: [0, 3.1, 14], lookAt: [0, 0.8, 1] },
  scan: { position: [3.8, 2.3, 7.2], lookAt: [0, 0.7, 1] },
  reveal: { position: [0, 10.5, 20], lookAt: [0, 0.7, -8] },
  choose: { position: [0, 12, 21], lookAt: [0, 0.4, -9] },
  home: { position: [11.5, 5.5, -2.5], lookAt: [8, 1, -10] },
  residence: { position: [4.5, 6.6, -4.5], lookAt: [0, 1.5, -13] },
  retail: { position: [-12.5, 6.6, -2.5], lookAt: [-8.5, 1, -10] },
};

export function WorldScene() {
  const phase = useExperienceStore((state) => state.phase);

  return (
    <>
      <color attach="background" args={["#0a0e0c"]} />
      <fog attach="fog" args={["#0a0e0c", 18, 56]} />
      <ambientLight intensity={0.65} />
      <directionalLight
        castShadow
        position={[9, 14, 9]}
        intensity={2.2}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight args={["#d9f4e3", "#18201b", 0.75]} />

      <CameraRig phase={phase} />
      <Ground />
      <Road />
      <Entrance />
      <ArrivalCar />
      <WorldBuildings />
    </>
  );
}

function CameraRig({ phase }: { phase: string }) {
  const lookAt = useRef(new THREE.Vector3(0, 0.8, 1));
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, delta) => {
    const target = CAMERA[phase] ?? CAMERA.choose;
    targetPosition.set(...target.position);
    targetLookAt.set(...target.lookAt);

    const ease = 1 - Math.exp(-delta * 2.35);
    camera.position.lerp(targetPosition, ease);
    lookAt.current.lerp(targetLookAt, ease);
    camera.lookAt(lookAt.current);
  });

  return null;
}

function Ground() {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.035, -8]} receiveShadow>
        <planeGeometry args={[54, 58]} />
        <meshStandardMaterial color="#141a16" roughness={0.96} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, -9]}>
        <circleGeometry args={[25, 80]} />
        <meshStandardMaterial color="#18201b" roughness={1} />
      </mesh>
    </>
  );
}

function Road() {
  const markers = Array.from({ length: 11 }, (_, index) => index);

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, 5]} receiveShadow>
        <planeGeometry args={[7, 31]} />
        <meshStandardMaterial color="#1b211e" roughness={0.92} />
      </mesh>
      {markers.map((marker) => (
        <mesh key={marker} rotation-x={-Math.PI / 2} position={[0, 0.02, 16 - marker * 2.8]}>
          <planeGeometry args={[0.08, 1.15]} />
          <meshBasicMaterial color="#657069" transparent opacity={0.32} />
        </mesh>
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[-3.25, 0.018, 5]}>
        <planeGeometry args={[0.05, 31]} />
        <meshBasicMaterial color="#bec8c1" transparent opacity={0.16} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[3.25, 0.018, 5]}>
        <planeGeometry args={[0.05, 31]} />
        <meshBasicMaterial color="#bec8c1" transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function Entrance() {
  const phase = useExperienceStore((state) => state.phase);
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const arm = useRef<THREE.Group>(null);
  const isOpen = phase !== "arrival" || selectedProblem === "automatic-access";

  useFrame((_, delta) => {
    if (!arm.current) return;
    const desired = isOpen ? Math.PI * 0.47 : 0;
    arm.current.rotation.z = THREE.MathUtils.lerp(
      arm.current.rotation.z,
      desired,
      1 - Math.exp(-delta * 4.6),
    );
  });

  return (
    <group position={[0, 0, 0.25]}>
      <RoundedBox args={[0.55, 1.35, 0.55]} radius={0.08} position={[-2.45, 0.68, 0]} castShadow>
        <meshStandardMaterial color="#e6ebe7" roughness={0.45} />
      </RoundedBox>
      <group ref={arm} position={[-2.25, 1.04, 0]}>
        <RoundedBox args={[4.8, 0.15, 0.18]} radius={0.04} position={[2.35, 0, 0]} castShadow>
          <meshStandardMaterial color="#f1f4f1" roughness={0.4} />
        </RoundedBox>
        {[0.5, 1.55, 2.6, 3.65].map((x) => (
          <mesh key={x} position={[x, 0, 0.1]}>
            <boxGeometry args={[0.36, 0.16, 0.02]} />
            <meshBasicMaterial color="#9df4b7" />
          </mesh>
        ))}
      </group>
      <CameraPost />
      {phase === "scan" && <ScanField />}
    </group>
  );
}

function CameraPost() {
  return (
    <group position={[2.25, 0, 0.25]}>
      <mesh position={[0, 1.3, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.07, 2.6, 10]} />
        <meshStandardMaterial color="#303934" metalness={0.5} roughness={0.5} />
      </mesh>
      <group position={[-0.12, 2.42, 0.02]} rotation={[0, 0, -0.16]}>
        <RoundedBox args={[0.5, 0.23, 0.25]} radius={0.06} castShadow>
          <meshStandardMaterial color="#d9dedb" metalness={0.25} roughness={0.4} />
        </RoundedBox>
        <mesh position={[-0.25, 0, 0]} rotation-y={Math.PI / 2}>
          <cylinderGeometry args={[0.065, 0.065, 0.04, 16]} />
          <meshBasicMaterial color="#95fbb6" />
        </mesh>
      </group>
    </group>
  );
}

function ScanField() {
  const scan = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!scan.current) return;
    scan.current.position.z = 2.2 + Math.sin(clock.elapsedTime * 4) * 0.8;
  });

  return (
    <>
      <mesh ref={scan} rotation-x={-Math.PI / 2} position={[0, 0.05, 2.2]}>
        <planeGeometry args={[5.2, 0.12]} />
        <meshBasicMaterial color="#86f7ac" transparent opacity={0.8} />
      </mesh>
      <pointLight position={[0, 1.1, 2]} color="#8affb0" intensity={5} distance={5} />
    </>
  );
}

function ArrivalCar() {
  const phase = useExperienceStore((state) => state.phase);
  const car = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!car.current) return;
    const targetZ = phase === "arrival" ? 3.25 : phase === "scan" ? 2.25 : -4.8;
    car.current.position.z = THREE.MathUtils.lerp(
      car.current.position.z,
      targetZ,
      1 - Math.exp(-delta * (phase === "arrival" ? 0.6 : 1.25)),
    );
  });

  return (
    <group ref={car} position={[0, 0, 11]}>
      <Car color="#dce2de" />
    </group>
  );
}

function Car({ color = "#dce2de", scale = 1 }: { color?: string; scale?: number }) {
  return (
    <group scale={scale}>
      <RoundedBox args={[1.65, 0.42, 3.05]} radius={0.2} position={[0, 0.48, 0]} castShadow>
        <meshStandardMaterial color={color} metalness={0.48} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[1.38, 0.48, 1.5]} radius={0.17} position={[0, 0.83, -0.15]} castShadow>
        <meshStandardMaterial color="#1a2520" metalness={0.25} roughness={0.22} />
      </RoundedBox>
      {[-0.72, 0.72].flatMap((x) =>
        [-0.92, 0.92].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.28, z]} rotation-z={Math.PI / 2} castShadow>
            <cylinderGeometry args={[0.28, 0.28, 0.16, 18]} />
            <meshStandardMaterial color="#080a09" roughness={0.8} />
          </mesh>
        )),
      )}
      <mesh position={[-0.52, 0.47, -1.53]}>
        <boxGeometry args={[0.34, 0.1, 0.03]} />
        <meshBasicMaterial color="#ff645e" />
      </mesh>
      <mesh position={[0.52, 0.47, -1.53]}>
        <boxGeometry args={[0.34, 0.1, 0.03]} />
        <meshBasicMaterial color="#ff645e" />
      </mesh>
    </group>
  );
}

function WorldBuildings() {
  return (
    <group>
      <HomeWorld />
      <ResidenceWorld />
      <RetailWorld />
      <DecorativeCity />
    </group>
  );
}

function InteractiveEnvironment({
  id,
  position,
  children,
}: {
  id: EnvironmentId;
  position: [number, number, number];
  children: React.ReactNode;
}) {
  const phase = useExperienceStore((state) => state.phase);
  const chooseEnvironment = useExperienceStore((state) => state.chooseEnvironment);
  const [hovered, setHovered] = useState(false);
  const interactive = phase === "choose";
  useCursor(interactive && hovered);

  return (
    <group
      position={position}
      scale={interactive && hovered ? 1.035 : 1}
      onPointerOver={(event) => {
        event.stopPropagation();
        if (interactive) setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(event) => {
        event.stopPropagation();
        if (interactive) chooseEnvironment(id);
      }}
    >
      {children}
      {interactive && hovered && <pointLight position={[0, 3.5, 1]} color="#9effbd" intensity={8} distance={9} />}
    </group>
  );
}

function HomeWorld() {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const active = selectedEnvironment === "home";

  return (
    <InteractiveEnvironment id="home" position={[8, 0, -10]}>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[7.5, 0.22, 7.5]} />
        <meshStandardMaterial color="#26332a" roughness={0.92} />
      </mesh>
      <RoundedBox args={[4.9, 2.25, 3.7]} radius={0.12} position={[0.3, 1.2, -0.5]} castShadow>
        <meshStandardMaterial color="#d9ddd6" roughness={0.66} />
      </RoundedBox>
      <mesh position={[0.3, 2.78, -0.5]} rotation-y={Math.PI / 4} castShadow>
        <coneGeometry args={[3.1, 1.35, 4]} />
        <meshStandardMaterial color="#445047" roughness={0.8} />
      </mesh>
      <RoundedBox args={[2.05, 1.65, 0.15]} radius={0.05} position={[-0.7, 0.95, 1.39]}>
        <meshStandardMaterial
          color={selectedProblem === "automatic-access" ? "#a7f7bd" : "#707b73"}
          emissive={selectedProblem === "automatic-access" ? "#4fa969" : "#000000"}
          emissiveIntensity={active ? 0.35 : 0}
        />
      </RoundedBox>
      <mesh position={[2.1, 1.25, 1.4]}>
        <boxGeometry args={[0.95, 1.15, 0.1]} />
        <meshStandardMaterial color="#26312b" />
      </mesh>
      <mesh position={[0, 0.03, 3.4]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[3, 3.5]} />
        <meshStandardMaterial color="#39423d" roughness={0.95} />
      </mesh>

      {selectedProblem === "guest-access" && active && (
        <group position={[1.2, 0, 3.2]} rotation-y={Math.PI}>
          <Car color="#9eb2a5" scale={0.62} />
        </group>
      )}

      {selectedProblem === "ev-charging" && active && (
        <group position={[-2.4, 0, 2.2]}>
          <Charger />
          <pointLight position={[0, 1.2, 0]} color="#80ffad" intensity={4} distance={4} />
        </group>
      )}
    </InteractiveEnvironment>
  );
}

function ResidenceWorld() {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const active = selectedEnvironment === "residence";

  return (
    <InteractiveEnvironment id="residence" position={[0, 0, -14]}>
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[8, 0.2, 7]} />
        <meshStandardMaterial color="#202923" />
      </mesh>
      <RoundedBox args={[5.5, 7.3, 3.2]} radius={0.12} position={[0, 3.72, -1.35]} castShadow>
        <meshStandardMaterial color="#bfc8c1" roughness={0.72} />
      </RoundedBox>
      {[-1.75, 0, 1.75].flatMap((x) =>
        [0.4, 1.7, 3, 4.3, 5.6].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y + 0.5, 0.28]}>
            <boxGeometry args={[0.72, 0.52, 0.05]} />
            <meshStandardMaterial color="#e7f4e9" emissive="#d5f4dc" emissiveIntensity={0.18} />
          </mesh>
        )),
      )}
      <mesh position={[0, 0.04, 2.3]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[7.5, 3.2]} />
        <meshStandardMaterial color="#333a36" />
      </mesh>
      <ParkingBay x={-2.45} glow={active && selectedProblem === "protect-space"} />
      <ParkingBay x={0} glow={active && selectedProblem === "guest-access"} />
      <ParkingBay x={2.45} glow={active && selectedProblem === "ev-charging"} />
      {active && selectedProblem === "protect-space" && <ParkingLock position={[-2.45, 0.18, 2.4]} lowered />}
      {active && selectedProblem === "ev-charging" && <Charger position={[3.1, 0, 1.25]} />}
    </InteractiveEnvironment>
  );
}

function ParkingBay({ x, glow }: { x: number; glow?: boolean }) {
  return (
    <group position={[x, 0.055, 2.4]}>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.15, 2.75]} />
        <meshStandardMaterial
          color={glow ? "#4f765b" : "#303834"}
          emissive={glow ? "#55b871" : "#000000"}
          emissiveIntensity={glow ? 0.35 : 0}
        />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, 0]}>
        <ringGeometry args={[0.6, 0.63, 32, 1, 0, Math.PI]} />
        <meshBasicMaterial color="#e3e9e5" transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

function ParkingLock({ position, lowered = false }: { position: [number, number, number]; lowered?: boolean }) {
  const arm = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!arm.current) return;
    arm.current.rotation.x = THREE.MathUtils.lerp(
      arm.current.rotation.x,
      lowered ? 0.05 : -0.85,
      1 - Math.exp(-delta * 4),
    );
  });

  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.65, 0.08, 0.34]} />
        <meshStandardMaterial color="#adb7b0" metalness={0.55} roughness={0.42} />
      </mesh>
      <mesh ref={arm} position={[0, 0.3, 0.05]}>
        <boxGeometry args={[0.08, 0.62, 0.08]} />
        <meshStandardMaterial color="#a9f7be" />
      </mesh>
    </group>
  );
}

function RetailWorld() {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const active = selectedEnvironment === "retail";
  const guidance = active && selectedProblem === "parking-guidance";

  return (
    <InteractiveEnvironment id="retail" position={[-8.5, 0, -10]}>
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[9, 0.2, 8]} />
        <meshStandardMaterial color="#282f2b" />
      </mesh>
      <RoundedBox args={[6.8, 2.45, 3.1]} radius={0.12} position={[0, 1.34, -1.95]} castShadow>
        <meshStandardMaterial color="#cfd4cf" roughness={0.62} />
      </RoundedBox>
      <RoundedBox args={[3.5, 0.45, 0.2]} radius={0.08} position={[0, 2.3, -0.36]}>
        <meshStandardMaterial color="#7c8b81" />
      </RoundedBox>

      {[-2.7, -0.9, 0.9, 2.7].map((x, index) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.06, 1.9]}>
          <planeGeometry args={[1.42, 3.05]} />
          <meshStandardMaterial
            color={guidance && index === 2 ? "#4c7c59" : "#303834"}
            emissive={guidance && index === 2 ? "#5ecb78" : "#000000"}
            emissiveIntensity={guidance && index === 2 ? 0.45 : 0}
          />
        </mesh>
      ))}

      {active && selectedProblem === "reduce-queues" && (
        <group position={[0, 0, 4.2]}>
          <Car color="#ccd4cf" scale={0.42} />
          <group position={[1.8, 0, 1.5]}><Car color="#81938a" scale={0.42} /></group>
          <group position={[-1.8, 0, 2.8]}><Car color="#b9c1bc" scale={0.42} /></group>
        </group>
      )}

      {active && selectedProblem === "ev-charging" && (
        <group>
          <Charger position={[2.95, 0, 0.7]} />
          <Charger position={[1.15, 0, 0.7]} />
        </group>
      )}
    </InteractiveEnvironment>
  );
}

function Charger({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.38, 1.28, 0.32]} radius={0.08} position={[0, 0.65, 0]} castShadow>
        <meshStandardMaterial color="#e2e7e3" roughness={0.45} />
      </RoundedBox>
      <mesh position={[0, 0.82, 0.17]}>
        <boxGeometry args={[0.19, 0.31, 0.02]} />
        <meshBasicMaterial color="#85f6a9" />
      </mesh>
      <pointLight position={[0, 0.9, 0.45]} color="#85f6a9" intensity={2.5} distance={2.5} />
    </group>
  );
}

function DecorativeCity() {
  const blocks = [
    [-15, 1.4, -18, 3, 2.8, 4],
    [-11.5, 2.6, -19, 2.4, 5.2, 3],
    [12.5, 2, -18, 3.2, 4, 3],
    [16, 3.6, -20, 3, 7.2, 3.2],
    [5.5, 1.6, -24, 4, 3.2, 3],
    [-4.5, 2, -25, 3.4, 4, 3],
  ];

  return (
    <group>
      {blocks.map(([x, y, z, w, h, d], index) => (
        <RoundedBox key={index} args={[w, h, d]} radius={0.08} position={[x, y, z]}>
          <meshStandardMaterial color="#202823" roughness={0.9} />
        </RoundedBox>
      ))}
      {[-15, -11, -6, 5, 13, 17].map((x) => (
        <group key={x} position={[x, 0, -5 - Math.abs(x) * 0.32]}>
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.12, 0.17, 1.6, 9]} />
            <meshStandardMaterial color="#4a574e" />
          </mesh>
          <mesh position={[0, 1.9, 0]}>
            <sphereGeometry args={[0.85, 10, 8]} />
            <meshStandardMaterial color="#314b39" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
