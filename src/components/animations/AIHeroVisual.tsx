'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Environment, Sphere } from '@react-three/drei';

function DataConstellation() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  
  const particleCount = 200;
  
  const { positions, colors, connections } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const colorPalette = [
      new THREE.Color('#00E5FF'), // Cyan
      new THREE.Color('#2293EE'), // Blue
      new THREE.Color('#10B981'), // Emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      // Create a swirling galaxy/brain-like shape
      const r = Math.random() * 3 + 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }

    // Create connections for lines (nodes close to each other)
    const conn = [];
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < 1.2) {
          conn.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
        }
      }
    }

    return { 
      positions: pos, 
      colors: col, 
      connections: new Float32Array(conn) 
    };
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current && linesRef.current) {
      // Gentle rotation
      pointsRef.current.rotation.y += delta * 0.1;
      pointsRef.current.rotation.x += delta * 0.05;
      linesRef.current.rotation.y += delta * 0.1;
      linesRef.current.rotation.x += delta * 0.05;

      // Mouse interactive parallax
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = (state.pointer.y * Math.PI) / 8;
      
      pointsRef.current.rotation.x += (targetY - pointsRef.current.rotation.x) * 0.05;
      pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.05;
      linesRef.current.rotation.x += (targetY - linesRef.current.rotation.x) * 0.05;
      linesRef.current.rotation.y += (targetX - linesRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <group>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Connections (Neural Links) */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[connections, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#00E5FF"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Central Core Glow */}
      <Sphere args={[0.5, 32, 32]}>
        <meshBasicMaterial 
          color="#00E5FF" 
          transparent 
          opacity={0.1} 
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
    </group>
  );
}

export default function AIHeroVisual() {
  return (
    <div className="absolute inset-0 w-full h-full z-0">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-cyan-900/20 via-transparent to-transparent opacity-60 pointer-events-none" />
      
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 2]}>
        <color attach="background" args={['#050A0F']} />
        <ambientLight intensity={1} />
        <DataConstellation />
        {/* Allows user to subtly rotate the brain/constellation */}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI - Math.PI / 3}
        />
      </Canvas>

      {/* Decorative Overlay UI */}
      <div className="absolute top-8 right-8 pointer-events-none">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.2em]">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#00E5FF]" />
          NEURAL LINK: STABLE
        </div>
      </div>
      
      <div className="absolute bottom-8 left-8 pointer-events-none">
        <div className="text-nexus-text-dim font-mono text-[9px] tracking-[0.3em] leading-relaxed">
          MODEL: TRANSFORMER-XL<br/>
          DATA_STREAM: OPTIMAL<br/>
          PARAMS: 175B
        </div>
      </div>
    </div>
  );
}
