'use client';

import React, { useEffect, useRef } from 'react';

export default function NextWaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    
    // Config
    const PARTICLE_COUNT = 80;
    const CONNECT_DISTANCE = 150;
    const BASE_SPEED = 0.3;

    // Scroll tracking
    let scrollY = 0;
    let targetScrollY = 0;
    let scrollVelocity = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    class Particle {
      x: number;
      y: number;
      baseY: number; // For tracking actual position before scroll offset
      vx: number;
      vy: number;
      radius: number;
      color: string;
      parallaxFactor: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.baseY = Math.random() * h;
        this.y = this.baseY;
        this.vx = (Math.random() - 0.5) * BASE_SPEED;
        this.vy = (Math.random() - 0.5) * BASE_SPEED;
        this.radius = Math.random() * 1.5 + 0.5;
        // The parallax factor determines how much this particle moves when scrolling (depth)
        this.parallaxFactor = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '#00E5FF' : '#10B981';
      }

      update(w: number, h: number, currentScroll: number, scrollVel: number) {
        this.x += this.vx;
        this.baseY += this.vy;

        // Add turbulence based on scroll speed
        if (Math.abs(scrollVel) > 1) {
          this.x += (Math.random() - 0.5) * (scrollVel * 0.05);
          this.baseY += (Math.random() - 0.5) * (scrollVel * 0.05);
        }

        // Wrap around edges for infinite flow (based on base position)
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.baseY < -h) this.baseY = h;
        if (this.baseY > h * 2) this.baseY = 0;

        // Apply scroll parallax offset
        // As you scroll down, particles move up at different speeds based on depth
        this.y = this.baseY - (currentScroll * this.parallaxFactor);
        
        // Wrap actual Y for rendering
        if (this.y < -100) this.baseY += h + 200;
        if (this.y > h + 100) this.baseY -= h + 200;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        // Add subtle glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      if (particles.length === 0) {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          particles.push(new Particle(width, height));
        }
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < CONNECT_DISTANCE) {
            // Opacity based on distance + turbulence from scroll
            const scrollInterference = Math.min(Math.abs(scrollVelocity) * 0.005, 0.5);
            let opacity = 1 - (distance / CONNECT_DISTANCE) - scrollInterference;
            if (opacity < 0) opacity = 0;
            
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, `${p1.color}${Math.floor(opacity * 40).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${p2.color}${Math.floor(opacity * 40).toString(16).padStart(2, '0')}`);
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth scroll interpolation
      scrollVelocity = targetScrollY - scrollY;
      scrollY += scrollVelocity * 0.1; // Smooth easing

      particles.forEach(p => {
        p.update(width, height, scrollY, scrollVelocity);
        p.draw(ctx);
      });
      
      drawConnections();

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 bg-[#030712] overflow-hidden">
      {/* 1. Ambient Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-900/10 blur-[120px] mix-blend-screen" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-900/10 blur-[120px] mix-blend-screen" />
      
      {/* 2. Abstract Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00E5FF08_1px,transparent_1px),linear-gradient(to_bottom,#00E5FF08_1px,transparent_1px)] bg-[size:64px_64px] opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

      {/* 3. Live Canvas Particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100vw', height: '100vh' }}
      />
    </div>
  );
}
