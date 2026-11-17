"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, OrbitControls, Float } from "@react-three/drei";
import { useRef, useState } from "react";
import type * as THREE from "three";

function Sculpture({ shape, paused }: { shape: number; paused: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, d) => {
    if (mesh.current && !paused) mesh.current.rotation.y += d * 0.25;
  });
  return (
    <Float speed={paused ? 0 : 1.6} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={mesh} scale={1.35}>
        <icosahedronGeometry args={[1, 64]} />
        <MeshDistortMaterial
          color="#FF6B47"
          roughness={0.25}
          metalness={0.35}
          distort={0.1 + shape * 0.55}
          speed={paused ? 0 : 1.2 + shape * 2.5}
        />
      </mesh>
      <mesh scale={2.35}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#C7CED1" wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  );
}

export default function ThreeLab({ paused }: { paused: boolean }) {
  const [shape, setShape] = useState(0.35);
  return (
    <div className="lab lab--three" data-cursor="drag" data-cursor-label="Drag">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 1.75]}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} color="#ffffff" />
        <pointLight position={[-4, -2, -3]} intensity={30} color="#FF6B47" />
        <pointLight position={[4, -3, 2]} intensity={14} color="#C7CED1" />
        <Sculpture shape={shape} paused={paused} />
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.7} />
      </Canvas>
      <label className="lab__control">
        <span className="mono">Shape</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={shape}
          onChange={(e) => setShape(Number(e.target.value))}
          aria-label="Change the sculpture's shape"
        />
        <output className="mono">{Math.round(shape * 100)}</output>
      </label>
    </div>
  );
}
