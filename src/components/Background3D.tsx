'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useEffect, Suspense } from 'react';
import * as THREE from 'three';

// Reduced from 1500 → 400 for massive perf gain
const PARTICLE_COUNT = 400;

function Particles() {
  const meshRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    const col = new Float32Array(PARTICLE_COUNT * 3);
    const palette = [
      [0, 0.83, 1],
      [0.69, 0.19, 1],
      [0, 1, 0.53],
      [1, 0.18, 0.6],
    ];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = Math.random() * 100 - 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 15;
      const p = palette[Math.floor(Math.random() * 4)];
      const br = 0.3 + Math.random() * 0.7;
      col[i * 3] = p[0] * br;
      col[i * 3 + 1] = p[1] * br;
      col[i * 3 + 2] = p[2] * br;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.y = t * 0.025;
    meshRef.current.rotation.x = t * 0.012;
    (meshRef.current.material as THREE.PointsMaterial).opacity =
      0.45 + Math.sin(t * 0.3) * 0.12;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.4} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function FloatingShape({
  geometry,
  color,
  position,
  speed,
}: {
  geometry: THREE.BufferGeometry;
  color: string;
  position: [number, number, number];
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const rx = useMemo(() => (0.002 + Math.random() * 0.002) * (Math.random() > 0.5 ? 1 : -1), []);
  const ry = useMemo(() => (0.002 + Math.random() * 0.003) * (Math.random() > 0.5 ? 1 : -1), []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x += rx;
    meshRef.current.rotation.y += ry;
    meshRef.current.position.y = position[1] + Math.sin(t * speed + offset) * 3;
  });

  return (
    <mesh ref={meshRef} position={position} geometry={geometry}>
      <meshBasicMaterial color={color} wireframe transparent opacity={0.12} />
    </mesh>
  );
}

function SceneContent() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Proper cleanup with useEffect
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.x +=
      (-mouse.current.y * 0.05 - groupRef.current.rotation.x) * 0.02;
    groupRef.current.rotation.y +=
      (mouse.current.x * 0.05 - groupRef.current.rotation.y) * 0.02;
  });

  const shapes = useMemo(
    () => [
      {
        geo: new THREE.IcosahedronGeometry(6, 0),
        color: '#00d4ff',
        pos: [28, 10, -22] as [number, number, number],
        speed: 0.35,
      },
      {
        geo: new THREE.OctahedronGeometry(5, 0),
        color: '#b030ff',
        pos: [-26, 16, -22] as [number, number, number],
        speed: 0.3,
      },
      {
        geo: new THREE.TetrahedronGeometry(4, 0),
        color: '#00ff88',
        pos: [16, -22, -22] as [number, number, number],
        speed: 0.4,
      },
    ],
    []
  );

  return (
    <group ref={groupRef}>
      <Particles />
      {shapes.map((s, i) => (
        <FloatingShape key={i} geometry={s.geo} color={s.color} position={s.pos} speed={s.speed} />
      ))}
    </group>
  );
}

export default function Background3D() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 50], fov: 60 }}
        dpr={[1, 1.2]} // capped lower than 1.5 previously
        gl={{ alpha: true, antialias: false, powerPreference: 'low-power' }}
        frameloop="always"
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
