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
      dot.style.background = 'var(--purple)';
      dot.style.boxShadow = '0 0 20px var(--purple), 0 0 60px rgba(176,48,255,.4)';
      dot.style.width = '14px';
      dot.style.height = '14px';
      ringEl.style.width = '52px';
      ringEl.style.height = '52px';
      ringEl.style.borderColor = 'rgba(176,48,255,.5)';
    };

    const onLeaveInteractive = () => {
      dot.style.background = 'var(--blue)';
      dot.style.boxShadow = '0 0 15px var(--blue), 0 0 40px rgba(0,212,255,.4)';
      dot.style.width = '10px';
      dot.style.height = '10px';
      ringEl.style.width = '36px';
      ringEl.style.height = '36px';
      ringEl.style.borderColor = 'rgba(0,212,255,.5)';
    };

    document.addEventListener('mousemove', onMove);
    animate();

    const attachHovers = () => {
      document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
        el.addEventListener('mouseenter', onEnterInteractive);
        el.addEventListener('mouseleave', onLeaveInteractive);
      });
    };

    attachHovers();
    const observer = new MutationObserver(attachHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', width: 10, height: 10, borderRadius: '50%',
        background: 'var(--blue)', pointerEvents: 'none', zIndex: 99999,
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 15px var(--blue), 0 0 40px rgba(0,212,255,.4)',
        mixBlendMode: 'screen',
        transition: 'width .2s, height .2s, background .2s, box-shadow .2s',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', width: 36, height: 36, borderRadius: '50%',
        border: '1px solid rgba(0,212,255,.5)', pointerEvents: 'none', zIndex: 99998,
        transform: 'translate(-50%, -50%)',
        transition: 'width .3s, height .3s, border-color .3s',
      }} />
    </>
  );
}
