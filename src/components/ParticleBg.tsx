'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  z: number;
}

const COLORS = [
  'rgba(168, 85, 247,',  // neon-purple
  'rgba(34, 211, 238,',  // neon-cyan
  'rgba(16, 185, 129,',  // emerald/green
  'rgba(236, 72, 153,',  // neon-pink (rare)
];

function pickColor() {
  const r = Math.random();
  if (r < 0.42) return COLORS[0];
  if (r < 0.75) return COLORS[1];
  if (r < 0.92) return COLORS[2];
  return COLORS[3];
}

function initParticles(count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() < 0.7 ? 1.5 : Math.random() < 0.85 ? 2.5 : 3.5,
    color: pickColor(),
    alpha: 0.1 + Math.random() * 0.6,
    twinkleSpeed: 0.2 + Math.random() * 0.8,
    twinkleOffset: Math.random() * Math.PI * 2,
    z: Math.random() * 2, // simulated depth
  }));
}

export default function ParticleBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    let particles: Particle[] = [];
    let raf = 0;
    let t = 0;
    let hidden = false;
    
    // Mouse interaction
    let mouseX = -1000;
    let mouseY = -1000;
    
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    
    const onMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    const COUNT = Math.min(150, Math.floor((w * h) / 9000));

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w;
      canvas!.height = h;
      particles = initParticles(COUNT, w, h);
    }

    function drawMatrixGrid(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
      const gridSize = 60;
      const perspectiveOffset = Math.sin(t * 0.2) * 10;
      
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.03)'; // Very faint purple grid
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      // Vertical lines
      for (let x = (t * 10) % gridSize; x < w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x + perspectiveOffset, h);
      }
      
      // Horizontal lines
      for (let y = (t * 5) % gridSize; y < h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y + perspectiveOffset * 0.5);
      }
      ctx.stroke();
    }

    function draw() {
      if (hidden) { raf = requestAnimationFrame(draw); return; }
      
      // Cyber trailing effect
      ctx!.fillStyle = 'rgba(5, 5, 8, 0.25)'; // Clear with trailing
      ctx!.fillRect(0, 0, w, h);
      
      t += 0.016;

      drawMatrixGrid(ctx!, w, h, t);

      for (const p of particles) {
        // Depth-based movement
        const speedMult = 1 + p.z * 0.5;
        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;
        
        // Wrap around
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Mouse interaction: move away and glow when close
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distSq = dx * dx + dy * dy;
        const interactionRadius = 150;
        let interactionGlow = 0;
        
        if (distSq < interactionRadius * interactionRadius) {
          const dist = Math.sqrt(distSq);
          const force = (interactionRadius - dist) / interactionRadius;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
          interactionGlow = force * 0.8; // Extra brightness
        }

        const twinkle = 0.5 + 0.5 * Math.sin(t * p.twinkleSpeed + p.twinkleOffset);
        let alpha = p.alpha * (0.3 + 0.7 * twinkle) + interactionGlow;
        alpha = Math.min(1, alpha); // Cap at 1

        const displaySize = p.size * (1 + p.z * 0.3) + interactionGlow * 2;

        ctx!.fillStyle = `${p.color}${alpha.toFixed(2)})`;
        
        // Draw cyber-dots (some squares, some circles based on depth)
        if (p.z > 1.5) {
          // Crosshair / plus sign for foremost particles
          ctx!.fillRect(p.x - displaySize/2, p.y - 0.5, displaySize, 1);
          ctx!.fillRect(p.x - 0.5, p.y - displaySize/2, 1, displaySize);
        } else if (p.z > 0.8) {
          // Sharp squares
          ctx!.fillRect(p.x, p.y, displaySize, displaySize);
        } else {
          // Soft circles for background
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, displaySize / 2, 0, Math.PI * 2);
          ctx!.fill();
        }
        
        // Draw connecting lines if particles are close to each other
        if (p.z > 1.0) { // Only foreground particles connect
          for (const other of particles) {
            if (p === other || other.z <= 1.0) continue;
            const odx = p.x - other.x;
            const ody = p.y - other.y;
            const odistSq = odx * odx + ody * ody;
            if (odistSq < 8000) {
              const lineAlpha = (1 - Math.sqrt(odistSq) / Math.sqrt(8000)) * 0.15;
              ctx!.strokeStyle = `${p.color}${lineAlpha.toFixed(2)})`;
              ctx!.lineWidth = 0.5;
              ctx!.beginPath();
              ctx!.moveTo(p.x, p.y);
              ctx!.lineTo(other.x, other.y);
              ctx!.stroke();
            }
          }
        }
      }

      // Add mouse glow effect
      if (mouseX > 0 && mouseY > 0) {
        const gradient = ctx!.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 300);
        gradient.addColorStop(0, 'rgba(34, 211, 238, 0.05)'); // cyan glow
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.02)'); // purple glow
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx!.fillStyle = gradient;
        ctx!.fillRect(0, 0, w, h);
      }

      raf = requestAnimationFrame(draw);
    }

    const onVis = () => { hidden = document.hidden; };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', resize, { passive: true });

    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
