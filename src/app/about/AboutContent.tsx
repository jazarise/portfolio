'use client';

import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';
import { smartPlaceholder } from '@/lib/utils';
export default function AboutContent({ cfg, homeCfg }: { cfg: any, homeCfg: any }) {
  const parsedFocuses = (cfg.focuses || '').split(';').map((f: string) => {
    const [label, level] = f.split(',');
    return { label: label?.trim() || 'Unknown', level: level?.trim() || 'Unknown' };
  }).filter((f: any) => f.label !== 'Unknown');

  const loc = homeCfg?.location || '';
  const mail = homeCfg?.email || '';

  return (
    <div className="pt-24 min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-12 text-center md:text-left">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple font-mono text-xs mb-6">
            // 01. IDENTITY
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">
            Behind the <span className="neon-text">Terminal</span>
          </h1>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal delay={0.1}>
            <div className="text-gray-400 space-y-6 text-lg leading-relaxed text-left">
              <p>{smartPlaceholder(cfg.p1)}</p>
              <p>{smartPlaceholder(cfg.p2)}</p>
              <p>{smartPlaceholder(cfg.p3)}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                {[loc, mail].filter(Boolean).map(item => (
                  <span key={item} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 font-mono text-xs text-gray-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="relative">
            <div className="absolute inset-0 bg-neon-purple/20 blur-[100px] -z-10 rounded-full mix-blend-screen" />
            <GlassCard className="p-8 border border-neon-purple/40 shadow-[0_0_40px_rgba(157,0,255,0.15)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/20 blur-3xl -z-10 group-hover:bg-neon-cyan/30 transition-colors" />
              <h3 className="font-display font-bold text-2xl text-white mb-6 flex items-center gap-3">
                <span className="text-neon-pink">⚡</span> Core Focus
              </h3>
              <div className="space-y-4 font-mono text-sm">
                {parsedFocuses.map((item: any) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-dark-border pb-3">
                    <span className="text-gray-300">{item.label}</span>
                    <span className="text-neon-cyan opacity-70">{item.level}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
