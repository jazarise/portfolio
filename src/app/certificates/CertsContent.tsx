'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';
import { smartPlaceholder } from '@/lib/utils';


// ─── Normalize a raw DB cert to display shape ─────────────────────────────────
function normalize(c: any) {
  return {
    id:         c._id,
    title:      c.title,
    issuer:     c.issuer,
    date:       c.date ?? '—',
    verifyUrl:  c.verifyUrl ?? null,
    image:      c.image ?? null,
    techStack:  Array.isArray(c.techStack) ? c.techStack : [],
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CertsContent({ dbCerts = [], cfg = {} }: { dbCerts?: any[], cfg?: any }) {
  const allCerts = dbCerts.map(normalize);
  const [selected, setSelected] = useState<ReturnType<typeof normalize> | null>(null);

  return (
    <div className="pt-24 min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple font-mono text-xs mb-6">
            // EXPERTISE & CREDENTIALS
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {smartPlaceholder(cfg.title, 'Certifications & Skills')}
          </h1>
          <p className="text-gray-400 max-w-2xl mb-12">
            {smartPlaceholder(cfg.subtitle, 'Validated expertise across cybersecurity, networking, and cloud platforms. Click any credential to view details.')}
          </p>
        </Reveal>

        {allCerts.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-6 opacity-20">◎</div>
              <h3 className="text-xl font-display font-bold text-white mb-3">No certifications yet</h3>
              <p className="text-gray-500 font-mono text-sm max-w-md">
                Certifications added from the admin dashboard will appear here automatically.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCerts.map((cert, i) => (
              <Reveal key={cert.id} delay={i * 0.1}>
                <div onClick={() => setSelected(cert)} className="cursor-pointer h-full">
                  <GlassCard className="flex flex-col h-full group overflow-hidden">
                    {/* Image or placeholder */}
                    <div className="relative w-full h-44 border-b border-white/5 overflow-hidden">
                      {cert.image ? (
                        <img
                          loading="lazy"
                          src={cert.image}
                          alt={cert.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-dark-main flex items-center justify-center text-5xl">📜</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-panel to-transparent" />
                    </div>

                    <div className="p-6 pt-4 flex-1 flex flex-col">
                      <h3 className="font-display text-lg font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors leading-snug">
                        {cert.title}
                      </h3>
                      <div className="text-sm font-mono text-gray-400 mb-1">{cert.issuer}</div>
                      <div className="text-xs font-mono text-neon-purple mb-4">{cert.date}</div>

                      {cert.techStack.length > 0 && (
                        <div className="mt-auto pt-4 border-t border-dark-border/50">
                          <div className="flex flex-wrap gap-2">
                            {cert.techStack.map((tech: string) => (
                              <span key={tech} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-md text-gray-300">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="bg-dark-panel border border-neon-purple/50 rounded-2xl max-w-3xl w-full p-2 text-center shadow-[0_0_50px_rgba(157,0,255,0.3)] relative"
            >
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all z-10">
                ✕
              </button>
              <div className="p-6">
                <h2 className="font-display text-2xl font-bold text-white mb-2">{selected.title}</h2>
                <p className="font-mono text-gray-400 mb-6 flex justify-center gap-4 text-sm">
                  <span>{selected.issuer}</span>
                  <span className="text-neon-purple">•</span>
                  <span>{selected.date}</span>
                </p>
                {(selected as any).videoUrl ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 mb-6 bg-black">
                    <video src={(selected as any).videoUrl} autoPlay loop muted playsInline className="w-full h-full object-contain" />
                  </div>
                ) : selected.image ? (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/10 mb-6 bg-black">
                    <img src={selected.image} alt={selected.title} className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="text-6xl mb-6 py-12 border border-white/5 rounded-lg bg-white/5">📜</div>
                )}
                {selected.verifyUrl && (
                  <a href={selected.verifyUrl} target="_blank" rel="noopener noreferrer" className="neon-btn inline-block">
                    Verify / View Official ↗
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
