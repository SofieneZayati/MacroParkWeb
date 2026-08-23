"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

export function HomeArchitecture({ garageOpen }: { garageOpen: boolean }) {
  const garageDoor = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!garageDoor.current) return;
    garageDoor.current.position.y = THREE.MathUtils.damp(
      garageDoor.current.position.y,
      garageOpen ? 2.35 : 0.98,
      4.4,
      delta,
    );
  });

  return (
    <group>
      <SitePad size={[8.4, 8.2]} color="#26352b" />

      <mesh rotation-x={-Math.PI / 2} position={[-0.8, 0.035, 2.65]} receiveShadow>
        <planeGeometry args={[3.35, 4.45]} />
        <meshStandardMaterial color="#3d4541" roughness={0.92} />
      </mesh>

      <mesh rotation-x={-Math.PI / 2} position={[2.65, 0.04, 2.35]} receiveShadow>
        <planeGeometry args={[1.45, 4.6]} />
        <meshStandardMaterial color="#b7b7ac" roughness={0.9} />
      </mesh>

      <RoundedBox args={[3.35, 2.75, 3.6]} radius={0.09} position={[-0.9, 1.42, -0.8]} castShadow>
        <meshStandardMaterial color="#dedfd9" roughness={0.63} />
      </RoundedBox>
      <RoundedBox args={[2.35, 2.05, 3.2]} radius={0.08} position={[1.78, 1.06, -0.68]} castShadow>
        <meshStandardMaterial color="#bcc2bd" roughness={0.58} />
      </RoundedBox>
      <RoundedBox args={[1.05, 3.05, 3.72]} radius={0.055} position={[-2.02, 1.55, -0.78]} castShadow>
        <meshStandardMaterial color="#5a625d" roughness={0.76} />
      </RoundedBox>

      <mesh position={[-0.78, 2.83, -0.72]}>
        <boxGeometry args={[3.8, 0.16, 3.95]} />
        <meshStandardMaterial color="#c9cdc8" roughness={0.66} />
      </mesh>
      <mesh position={[1.78, 2.13, -0.68]}>
        <boxGeometry args={[2.6, 0.12, 3.45]} />
        <meshStandardMaterial color="#aeb5af" roughness={0.62} />
      </mesh>

      <group position={[-0.82, 0, 1.035]}>
        <RoundedBox args={[2.08, 1.62, 0.08]} radius={0.035} position={[0, 0.98, 0]}>
          <meshStandardMaterial color="#151a18" roughness={0.78} />
        </RoundedBox>
        <group ref={garageDoor} position={[0, 0.98, 0.06]}>
          <RoundedBox args={[1.94, 1.5, 0.07]} radius={0.025} castShadow>
            <meshStandardMaterial color="#727a75" metalness={0.28} roughness={0.46} />
          </RoundedBox>
          {[-0.48, 0, 0.48].map((y) => (
            <mesh key={y} position={[0, y, 0.043]}>
              <boxGeometry args={[1.82, 0.018, 0.008]} />
              <meshBasicMaterial color="#a3aaa5" transparent opacity={0.55} />
            </mesh>
          ))}
        </group>
        <mesh position={[1.19, 1.24, 0.07]}>
          <boxGeometry args={[0.09, 0.09, 0.025]} />
          <meshStandardMaterial
            color={garageOpen ? "#9df4b7" : "#8c958f"}
            emissive={garageOpen ? "#4fc36d" : "#000000"}
            emissiveIntensity={garageOpen ? 1.1 : 0}
          />
        </mesh>
      </group>

      <RoundedBox args={[1.24, 1.5, 0.06]} radius={0.04} position={[1.58, 1.22, 0.95]}>
        <meshStandardMaterial color="#1a2924" metalness={0.22} roughness={0.16} />
      </RoundedBox>
      <mesh position={[1.58, 1.22, 0.99]}>
        <boxGeometry args={[0.035, 1.34, 0.015]} />
        <meshBasicMaterial color="#728b7d" transparent opacity={0.55} />
      </mesh>

      <RoundedBox args={[0.82, 1.5, 0.08]} radius={0.035} position={[2.45, 0.87, 0.9]}>
        <meshStandardMaterial color="#27312d" roughness={0.5} />
      </RoundedBox>
      <mesh position={[2.2, 2.22, 0.65]}>
        <boxGeometry args={[2.15, 0.16, 1.15]} />
        <meshStandardMaterial color="#818b84" metalness={0.22} roughness={0.54} />
      </mesh>

      <Planter position={[-3.25, 0, -0.25]} length={1.9} />
      <Planter position={[3.15, 0, -1.55]} length={2.2} />
      <SiteTree position={[3.1, 0, -2.6]} scale={0.78} />
      <PathLight position={[2.9, 0, 1.2]} />
      <PathLight position={[2.9, 0, 2.75]} />
      <PathLight position={[2.9, 0, 4.05]} />
    </group>
  );
}

export function ResidenceArchitecture() {
  return (
    <group>
      <SitePad size={[9.1, 8]} color="#222c26" />

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.04, 2.35]} receiveShadow>
        <planeGeometry args={[8.35, 3.65]} />
        <meshStandardMaterial color="#343b37" roughness={0.93} />
      </mesh>

      <RoundedBox args={[3.6, 7.25, 3.15]} radius={0.1} position={[-1.8, 3.68, -1.55]} castShadow>
        <meshStandardMaterial color="#c8cdc8" roughness={0.69} />
      </RoundedBox>
      <RoundedBox args={[3.15, 5.75, 3.15]} radius={0.1} position={[1.82, 2.93, -1.52]} castShadow>
        <meshStandardMaterial color="#aeb6b0" roughness={0.68} />
      </RoundedBox>
      <RoundedBox args={[0.82, 7.55, 3.3]} radius={0.055} position={[0.08, 3.83, -1.6]} castShadow>
        <meshStandardMaterial color="#4e5852" roughness={0.74} />
      </RoundedBox>

      <FacadeWindows xValues={[-2.75, -1.8, -0.85]} yValues={[1.1, 2.35, 3.6, 4.85, 6.1]} z={0.055} />
      <FacadeWindows xValues={[0.95, 1.82, 2.68]} yValues={[1.05, 2.25, 3.45, 4.65]} z={0.055} warm />

      {[1.75, 3.05, 4.35, 5.65].map((y) => (
        <mesh key={y} position={[-1.8, y, 0.16]}>
          <boxGeometry args={[3.1, 0.08, 0.5]} />
          <meshStandardMaterial color="#7f8982" roughness={0.58} />
        </mesh>
      ))}

      <group position={[0.08, 0, 0.12]}>
        <RoundedBox args={[1.42, 1.72, 0.1]} radius={0.04} position={[0, 0.9, 0]}>
          <meshStandardMaterial color="#18251f" metalness={0.2} roughness={0.18} />
        </RoundedBox>
        <mesh position={[0, 1.88, 0.34]}>
          <boxGeometry args={[2.2, 0.16, 0.82]} />
          <meshStandardMaterial color="#68746c" metalness={0.28} roughness={0.46} />
        </mesh>
        <mesh position={[0, 1.89, 0.75]}>
          <boxGeometry args={[1.2, 0.045, 0.03]} />
          <meshStandardMaterial color="#a5efb8" emissive="#376e47" emissiveIntensity={0.65} />
        </mesh>
      </group>

      <Planter position={[-3.75, 0, -2.65]} length={1.7} />
      <Planter position={[3.72, 0, -2.35]} length={1.75} />
      <SiteTree position={[-3.75, 0, -3.05]} scale={0.72} />
      <SiteTree position={[3.78, 0, -2.9]} scale={0.68} />
      <PathLight position={[-3.75, 0, 1.1]} />
      <PathLight position={[3.75, 0, 1.1]} />
    </group>
  );
}

export function RetailArchitecture() {
  return (
    <group>
      <SitePad size={[10, 8.8]} color="#29322d" />

      <mesh rotation-x={-Math.PI / 2} position={[0, 0.04, 2.25]} receiveShadow>
        <planeGeometry args={[9.25, 4.45]} />
        <meshStandardMaterial color="#333a36" roughness={0.94} />
      </mesh>

      <RoundedBox args={[7.7, 2.45, 3.35]} radius={0.1} position={[0, 1.3, -2.05]} castShadow>
        <meshStandardMaterial color="#d2d5d1" roughness={0.61} />
      </RoundedBox>
      <mesh position={[0, 2.58, -2.02]}>
        <boxGeometry args={[8.15, 0.16, 3.65]} />
        <meshStandardMaterial color="#aeb6b0" roughness={0.56} />
      </mesh>
      <mesh position={[0, 2.2, -0.34]}>
        <boxGeometry args={[7.6, 0.48, 0.16]} />
        <meshStandardMaterial color="#66736b" metalness={0.18} roughness={0.45} />
      </mesh>

      {[-2.75, -1.65, -0.55, 0.55, 1.65, 2.75].map((x) => (
        <RoundedBox key={x} args={[0.92, 1.3, 0.06]} radius={0.025} position={[x, 1.18, -0.34]}>
          <meshStandardMaterial color="#1a2a24" metalness={0.22} roughness={0.15} />
        </RoundedBox>
      ))}
      {[-2.2, -1.1, 1.1, 2.2].map((x) => (
        <mesh key={`mullion-${x}`} position={[x, 1.18, -0.3]}>
          <boxGeometry args={[0.035, 1.18, 0.025]} />
          <meshBasicMaterial color="#7d8d84" transparent opacity={0.62} />
        </mesh>
      ))}

      <RoundedBox args={[1.35, 1.75, 0.09]} radius={0.04} position={[0, 1.03, -0.27]}>
        <meshStandardMaterial color="#16251f" metalness={0.24} roughness={0.14} />
      </RoundedBox>
      <mesh position={[0, 2.25, -0.2]}>
        <boxGeometry args={[2.65, 0.34, 0.12]} />
        <meshStandardMaterial color="#26322c" roughness={0.46} />
      </mesh>
      <mesh position={[-0.35, 2.25, -0.13]} rotation-z={Math.PI / 4}>
        <boxGeometry args={[0.16, 0.16, 0.035]} />
        <meshStandardMaterial color="#9bf2b5" emissive="#3d7f50" emissiveIntensity={0.75} />
      </mesh>

      <mesh position={[0, 1.82, 0.08]}>
        <boxGeometry args={[6.7, 0.1, 0.92]} />
        <meshStandardMaterial color="#707b74" metalness={0.3} roughness={0.44} />
      </mesh>
      {[-2.9, -1.45, 0, 1.45, 2.9].map((x) => (
        <mesh key={`column-${x}`} position={[x, 0.88, 0.22]} castShadow>
          <cylinderGeometry args={[0.055, 0.065, 1.7, 12]} />
          <meshStandardMaterial color="#68736c" metalness={0.38} roughness={0.48} />
        </mesh>
      ))}

      <Crosswalk position={[0, 0.065, 0.95]} />
      <Planter position={[-4.25, 0, -1.7]} length={2.2} />
      <Planter position={[4.25, 0, -1.7]} length={2.2} />
      <SiteTree position={[-4.2, 0, -2.25]} scale={0.72} />
      <SiteTree position={[4.2, 0, -2.25]} scale={0.72} />
      <ParkingLight position={[-4.05, 0, 2.6]} />
      <ParkingLight position={[4.05, 0, 2.6]} />
    </group>
  );
}

function SitePad({ size, color }: { size: [number, number]; color: string }) {
  return (
    <RoundedBox args={[size[0], 0.22, size[1]]} radius={0.1} position={[0, 0.11, 0]} receiveShadow>
      <meshStandardMaterial color={color} roughness={0.94} />
    </RoundedBox>
  );
}

function FacadeWindows({
  xValues,
  yValues,
  z,
  warm = false,
}: {
  xValues: number[];
  yValues: number[];
  z: number;
  warm?: boolean;
}) {
  return (
    <>
      {xValues.flatMap((x) =>
        yValues.map((y) => (
          <RoundedBox key={`${x}-${y}`} args={[0.62, 0.48, 0.045]} radius={0.025} position={[x, y, z]}>
            <meshStandardMaterial
              color={warm ? "#d5e5d9" : "#24332c"}
              emissive={warm ? "#cbe8d2" : "#1c3326"}
              emissiveIntensity={warm ? 0.13 : 0.08}
              metalness={0.12}
              roughness={0.2}
            />
          </RoundedBox>
        )),
      )}
    </>
  );
}

function Planter({ position, length }: { position: [number, number, number]; length: number }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.68, 0.34, length]} radius={0.07} position={[0, 0.17, 0]} castShadow>
        <meshStandardMaterial color="#616a64" roughness={0.82} />
      </RoundedBox>
      {[-0.34, 0.34].map((z) => (
        <mesh key={z} position={[0, 0.52, z * Math.min(length, 2)]}>
          <sphereGeometry args={[0.36, 10, 8]} />
          <meshStandardMaterial color="#36503d" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function SiteTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 1.55, 9]} />
        <meshStandardMaterial color="#515a52" roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <icosahedronGeometry args={[0.78, 1]} />
        <meshStandardMaterial color="#35513e" roughness={1} />
      </mesh>
      <mesh position={[0.38, 1.72, 0.08]} castShadow>
        <icosahedronGeometry args={[0.48, 1]} />
        <meshStandardMaterial color="#3c5944" roughness={1} />
      </mesh>
    </group>
  );
}

function PathLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.035, 0.05, 0.56, 10]} />
        <meshStandardMaterial color="#39413d" metalness={0.42} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.12, 0.05, 0.12]} />
        <meshStandardMaterial color="#d9ffe2" emissive="#8edaa2" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function ParkingLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.045, 0.065, 3.1, 10]} />
        <meshStandardMaterial color="#414a45" metalness={0.5} roughness={0.46} />
      </mesh>
      <mesh position={[0, 3.08, 0]} rotation-z={0.08}>
        <boxGeometry args={[0.76, 0.08, 0.22]} />
        <meshStandardMaterial color="#b9c0bb" metalness={0.35} roughness={0.4} />
      </mesh>
      <pointLight position={[0, 2.95, 0.15]} color="#deeee2" intensity={1.2} distance={4.6} />
    </group>
  );
}

function Crosswalk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-1.25, -0.75, -0.25, 0.25, 0.75, 1.25].map((x) => (
        <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0, 0]}>
          <planeGeometry args={[0.28, 1.15]} />
          <meshBasicMaterial color="#d7ddd9" transparent opacity={0.32} />
        </mesh>
      ))}
    </group>
  );
}
