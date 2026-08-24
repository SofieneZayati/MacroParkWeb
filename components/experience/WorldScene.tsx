"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useCursor } from "@react-three/drei";
import * as THREE from "three";
import {
  type EnvironmentId,
  useExperienceStore,
} from "./useExperienceStore";
import { EntranceKit } from "./EntranceKit";
import { EVCharger } from "./ParkingHardware";
import { PremiumVehicle } from "./PremiumVehicle";
import { HomeAccessSequence } from "./HomeAccessSequence";
import { HomeGuestSequence } from "./HomeGuestSequence";
import { HomeChargingSequence } from "./HomeChargingSequence";
import {
  HomeArchitecture,
  ResidenceArchitecture,
  RetailArchitecture,
} from "./EnvironmentArchitecture";

type CameraTarget = {
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
};

const CAMERA: Record<string, CameraTarget> = {
  arrival: { position: [0, 3.1, 14], lookAt: [0, 0.8, 1], fov: 42 },
  scan: { position: [3.8, 2.3, 7.2], lookAt: [0, 0.7, 1], fov: 39 },
  reveal: { position: [0, 10.5, 20], lookAt: [0, 0.7, -8], fov: 47 },
  choose: { position: [0, 12, 21], lookAt: [0, 0.4, -9], fov: 44 },
  home: { position: [13.2, 6.25, -0.45], lookAt: [8, 1.25, -9.2], fov: 38 },
  residence: { position: [7.25, 7.45, -3.7], lookAt: [0, 1.55, -12.7], fov: 39 },
  retail: { position: [-14.4, 7.25, -0.25], lookAt: [-8.25, 0.95, -8.7], fov: 39 },
};

const PROBLEM_CAMERA: Record<string, CameraTarget> = {
  "home:automatic-access": {
    position: [12.3, 4.35, -2.55],
    lookAt: [7.35, 0.9, -6.95],
    fov: 36,
  },
  "home:guest-access": {
    position: [13.25, 4.8, -1.95],
    lookAt: [9.1, 0.82, -6.35],
    fov: 37,
  },
  "home:ev-charging": {
    position: [13.1, 5.65, -1.65],
    lookAt: [7.55, 1.18, -7.35],
    fov: 39,
  },
  "retail:parking-guidance": {
    position: [-13.55, 4.95, -2.15],
    lookAt: [-9.65, 0.32, -7.18],
    fov: 35,
  },
};

const MOBILE_CAMERA: Partial<Record<string, CameraTarget>> = {
  home: { position: [11.9, 8.7, 1.6], lookAt: [8, 1.75, -9.5], fov: 50 },
  residence: { position: [6.65, 9.2, -2.35], lookAt: [0, 2.15, -12.6], fov: 49 },
  retail: { position: [-12.9, 8.65, 1.2], lookAt: [-8.5, 1.8, -8.8], fov: 49 },
};

const MOBILE_PROBLEM_CAMERA: Record<string, CameraTarget> = {
  "home:automatic-access": {
    position: [10.95, 7.5, 0.75],
    lookAt: [7.45, 1.25, -7.55],
    fov: 47,
  },
  "home:guest-access": {
    position: [11.45, 7.75, 1.15],
    lookAt: [8.7, 1.18, -6.95],
    fov: 48,
  },
  "home:ev-charging": {
    position: [11.4, 8.15, 1.05],
    lookAt: [7.75, 1.55, -7.3],
    fov: 50,
  },
  "retail:parking-guidance": {
    position: [-12.35, 7.25, 0.15],
    lookAt: [-9.45, 0.72, -7.25],
    fov: 47,
  },
};

export function WorldScene() {
  const phase = useExperienceStore((state) => state.phase);
  const showArrivalInfrastructure = ["arrival", "scan", "reveal", "choose"].includes(phase);

  return (
    <>
      <color attach="background" args={["#0a0e0c"]} />
      <fog attach="fog" args={["#0a0e0c", 19, 58]} />
      <ambientLight intensity={0.72} />
      <directionalLight
        castShadow
        position={[9, 14, 9]}
        intensity={2.45}
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-near={1}
        shadow-camera-far={42}
      />
      <hemisphereLight args={["#dcefe2", "#172019", 0.9]} />

      <CameraRig phase={phase} />
      <Ground />
      <Road />
      {showArrivalInfrastructure && <EntranceKit />}
      {showArrivalInfrastructure && <ArrivalCar />}
      <WorldBuildings />
    </>
  );
}

function CameraRig({ phase }: { phase: string }) {
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const lookAt = useRef(new THREE.Vector3(0, 0.8, 1));
  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, size }, delta) => {
    const problemKey = selectedProblem ? `${phase}:${selectedProblem}` : null;
    const problemTarget = problemKey ? PROBLEM_CAMERA[problemKey] : undefined;
    const mobileProblemTarget = problemKey ? MOBILE_PROBLEM_CAMERA[problemKey] : undefined;
    const mobileTarget = size.width <= 760 ? mobileProblemTarget ?? MOBILE_CAMERA[phase] : undefined;
    const target = mobileTarget ?? problemTarget ?? CAMERA[phase] ?? CAMERA.choose;
    targetPosition.set(...target.position);
    targetLookAt.set(...target.lookAt);

    const ease = 1 - Math.exp(-delta * 2.2);
    camera.position.lerp(targetPosition, ease);
    lookAt.current.lerp(targetLookAt, ease);

    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.damp(camera.fov, target.fov, 2.7, delta);
      camera.updateProjectionMatrix();
    }

    camera.lookAt(lookAt.current);
  });

  return null;
}

function Ground() {
  return (
    <>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.035, -8]} receiveShadow>
        <planeGeometry args={[56, 60]} />
        <meshStandardMaterial color="#131915" roughness={0.97} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, -9]}>
        <circleGeometry args={[25, 56]} />
        <meshStandardMaterial color="#19221c" roughness={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.005, -8]}>
        <ringGeometry args={[18.5, 24.5, 56]} />
        <meshBasicMaterial color="#26332b" transparent opacity={0.12} />
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
      {[-3.25, 3.25].map((x) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.018, 5]}>
          <planeGeometry args={[0.05, 31]} />
          <meshBasicMaterial color="#bec8c1" transparent opacity={0.16} />
        </mesh>
      ))}
    </group>
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
      <PremiumVehicle color="#dce2de" />
    </group>
  );
}

function WorldBuildings() {
  const phase = useExperienceStore((state) => state.phase);
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const showAll =
    selectedEnvironment === null || ["arrival", "scan", "reveal", "choose"].includes(phase);

  return (
    <group>
      {(showAll || selectedEnvironment === "home") && <HomeWorld />}
      {(showAll || selectedEnvironment === "residence") && <ResidenceWorld />}
      {(showAll || selectedEnvironment === "retail") && <RetailWorld />}
      {showAll && <DecorativeCity />}
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
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const interactive = phase === "choose";
  useCursor(interactive && hovered);

  useFrame((_, delta) => {
    if (!group.current) return;
    const targetScale = interactive && hovered ? 1.028 : 1;
    const next = THREE.MathUtils.damp(group.current.scale.x, targetScale, 6, delta);
    if (Math.abs(next - group.current.scale.x) > 0.0001) group.current.scale.setScalar(next);
  });

  return (
    <group
      ref={group}
      position={position}
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
      {interactive && hovered && (
        <pointLight position={[0, 3.6, 1]} color="#9effbd" intensity={5.4} distance={8} />
      )}
    </group>
  );
}

function HomeWorld() {
  const selectedEnvironment = useExperienceStore((state) => state.selectedEnvironment);
  const selectedProblem = useExperienceStore((state) => state.selectedProblem);
  const guestAccessPreview = useExperienceStore((state) => state.guestAccessPreview);
  const solarEnabled = useExperienceStore((state) => state.solarEnabled);
  const active = selectedEnvironment === "home";
  const automaticAccessActive = active && selectedProblem === "automatic-access";
  const guestAccessActive = active && selectedProblem === "guest-access";
  const [garageAuthorized, setGarageAuthorized] = useState(false);

  useEffect(() => {
    if (!automaticAccessActive) setGarageAuthorized(false);
  }, [automaticAccessActive]);

  return (
    <InteractiveEnvironment id="home" position={[8, 0, -10]}>
      <HomeArchitecture garageOpen={automaticAccessActive && garageAuthorized} />

      {automaticAccessActive && (
        <HomeAccessSequence onRecognized={() => setGarageAuthorized(true)} />
      )}

      {guestAccessActive && (
        <HomeGuestSequence allowed={guestAccessPreview === "active"} />
      )}

      {selectedProblem === "ev-charging" && active && (
        <HomeChargingSequence solarEnabled={solarEnabled} />
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
      <ResidenceArchitecture />
      <ParkingBay x={-2.45} glow={active && selectedProblem === "protect-space"} />
      <ParkingBay x={0} glow={active && ["guest-access", "reservations"].includes(selectedProblem ?? "")} />
      <ParkingBay x={2.45} glow={active && selectedProblem === "ev-charging"} />
    </InteractiveEnvironment>
  );
}

function ParkingBay({ x, glow }: { x: number; glow?: boolean }) {
  return (
    <group position={[x, 0.065, 2.35]}>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[2.12, 2.92]} />
        <meshStandardMaterial
          color={glow ? "#456c51" : "#303834"}
          emissive={glow ? "#4eac65" : "#000000"}
          emissiveIntensity={glow ? 0.34 : 0}
        />
      </mesh>
      {[-1.02, 1.02].map((xLine) => (
        <mesh key={xLine} rotation-x={-Math.PI / 2} position={[xLine, 0.012, 0]}>
          <planeGeometry args={[0.035, 2.72]} />
          <meshBasicMaterial color="#dce2de" transparent opacity={0.32} />
        </mesh>
      ))}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, -1.36]}>
        <planeGeometry args={[2.05, 0.035]} />
        <meshBasicMaterial color="#dce2de" transparent opacity={0.32} />
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
      <RetailArchitecture />

      {[-2.7, -0.9, 0.9, 2.7].map((x, index) => (
        <RetailBay key={x} x={x} active={guidance && index === 1} />
      ))}

      {guidance && <GuidedRetailVehicle />}

      {active && selectedProblem === "reduce-queues" && (
        <group position={[-1.15, 0, 4.0]} rotation-y={0.04}>
          <PremiumVehicle color="#ccd4cf" scale={0.42} lightsOn={false} />
          <group position={[2.05, 0, 1.5]}>
            <PremiumVehicle color="#81938a" scale={0.42} lightsOn={false} />
          </group>
          <group position={[-1.65, 0, 2.75]}>
            <PremiumVehicle color="#b9c1bc" scale={0.42} lightsOn={false} />
          </group>
        </group>
      )}

      {active && selectedProblem === "ev-charging" && (
        <group>
          <EVCharger position={[2.95, 0, 0.62]} />
          <EVCharger position={[1.15, 0, 0.62]} />
        </group>
      )}
    </InteractiveEnvironment>
  );
}

function GuidedRetailVehicle() {
  const group = useRef<THREE.Group>(null);
  const progress = useRef(0);
  const point = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-3.75, 0, 6.35),
        new THREE.Vector3(-3.2, 0, 5.35),
        new THREE.Vector3(-2.45, 0, 4.45),
        new THREE.Vector3(-1.55, 0, 3.4),
        new THREE.Vector3(-0.9, 0, 2.45),
      ]),
    [],
  );

  useFrame((_, delta) => {
    if (!group.current) return;

    progress.current = Math.min(1, progress.current + delta * 0.55);
    const t = THREE.MathUtils.smoothstep(progress.current, 0, 1);
    curve.getPointAt(t, point);
    curve.getTangentAt(Math.min(1, t + 0.001), tangent).normalize();

    group.current.position.copy(point);
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      Math.atan2(-tangent.x, -tangent.z),
      7,
      delta,
    );
  });

  return (
    <group ref={group} position={[-3.75, 0, 6.35]}>
      <PremiumVehicle color="#d4ddd7" scale={0.46} lightsOn={false} />
    </group>
  );
}

function RetailBay({ x, active }: { x: number; active: boolean }) {
  return (
    <group position={[x, 0.066, 2.45]}>
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1.46, 3.15]} />
        <meshStandardMaterial
          color={active ? "#477153" : "#303834"}
          emissive={active ? "#58c66f" : "#000000"}
          emissiveIntensity={active ? 0.45 : 0}
        />
      </mesh>
      {[-0.72, 0.72].map((line) => (
        <mesh key={line} rotation-x={-Math.PI / 2} position={[line, 0.012, 0]}>
          <planeGeometry args={[0.025, 3]} />
          <meshBasicMaterial color="#dce2de" transparent opacity={0.28} />
        </mesh>
      ))}
      {active && <pointLight position={[0, 0.8, 0]} color="#8ff2aa" intensity={1.4} distance={2.8} />}
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
            <cylinderGeometry args={[0.12, 0.17, 1.6, 7]} />
            <meshStandardMaterial color="#4a574e" />
          </mesh>
          <mesh position={[0, 1.9, 0]}>
            <icosahedronGeometry args={[0.85, 0]} />
            <meshStandardMaterial color="#314b39" roughness={1} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
