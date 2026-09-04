'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const dot = dotRef.current;
    const ringEl = ringRef.current;
    if (!dot || !ringEl) return;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      dot.style.left = e.clientX + 'px';
      dot.style.top = e.clientY + 'px';
    };

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      ringEl.style.left = ring.current.x + 'px';
      ringEl.style.top = ring.current.y + 'px';
      requestAnimationFrame(animate);
    };

    const onEnterInteractive = () => {
      dot.style.background = '#b030ff';
      dot.style.boxShadow = '0 0 20px #b030ff, 0 0 60px rgba(176,48,255,.4)';
      dot.style.width = '14px';
      dot.style.height = '14px';
      ringEl.style.width = '52px';
      ringEl.style.height = '52px';
      ringEl.style.borderColor = 'rgba(176,48,255,.5)';
    };

    const onLeaveInteractive = () => {
      dot.style.background = '#00d4ff';
      dot.style.boxShadow = '0 0 15px #00d4ff, 0 0 40px rgba(0,212,255,.4)';
      dot.style.width = '10px';
      dot.style.height = '10px';
      ringEl.style.width = '36px';
      ringEl.style.height = '36px';
      ringEl.style.borderColor = 'rgba(0,212,255,.5)';
    };

    document.addEventListener('mousemove', onMove);
    animate();

    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.('a, button, [role="button"]')) {
        onEnterInteractive();
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest?.('a, button, [role="button"]')) {
        onLeaveInteractive();
      }
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  return (
    <div className="hidden md:block">
      <div ref={dotRef} style={{
        position: 'fixed', width: 10, height: 10, borderRadius: '50%',
        background: '#00d4ff', pointerEvents: 'none', zIndex: 99999,
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 15px #00d4ff, 0 0 40px rgba(0,212,255,.4)',
        mixBlendMode: 'screen',
        transition: 'width .2s, height .2s, background .2s, box-shadow .2s',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', width: 36, height: 36, borderRadius: '50%',
        border: '1px solid rgba(0,212,255,.5)', pointerEvents: 'none', zIndex: 99998,
        transform: 'translate(-50%, -50%)',
        transition: 'width .3s, height .3s, border-color .3s',
      }} />
    </div>
  );
}
