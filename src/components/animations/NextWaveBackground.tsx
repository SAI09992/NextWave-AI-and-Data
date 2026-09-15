'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Embers({ count = 2000 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random positions, velocities, and scales
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 20 - 10;
      
      const speed = 0.01 + Math.random() * 0.02;
      const scale = 0.5 + Math.random() * 1.5;
      const wobbleSpeed = Math.random() * 0.02;
      const wobbleSize = Math.random() * 0.05;
      
      temp.push({ x, y, z, speed, scale, wobbleSpeed, wobbleSize, timeOffset: Math.random() * 100 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      // Move up
      particle.y += particle.speed;
      if (particle.y > 20) particle.y = -20;
      
      // Wobble horizontally
      const currentWobble = Math.sin(state.clock.elapsedTime * particle.wobbleSpeed + particle.timeOffset) * particle.wobbleSize;
      particle.x += currentWobble;

      dummy.position.set(particle.x, particle.y, particle.z);
      
      // Twinkle scale
      const twinkle = Math.sin(state.clock.elapsedTime * 2 + particle.timeOffset) * 0.5 + 0.5;
      dummy.scale.setScalar(particle.scale * (0.5 + twinkle * 0.5));
      
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <circleGeometry args={[0.03, 8]} />
      <meshBasicMaterial 
        color="#ff3300" 
        transparent 
        opacity={0.6} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

export default function NextWaveBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-[#050202]">
      {/* Deep red/gold radial glow behind the particles */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/40 via-[#050202] to-[#050202]" />
      
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} dpr={[1, 2]}>
        <Embers count={1500} />
      </Canvas>
    </div>
  );
}
