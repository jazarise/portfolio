'use client';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';
import ProjectVideoPlayer from '@/components/ProjectVideoPlayer';
import { smartPlaceholder } from '@/lib/utils';
import { FaGithub } from 'react-icons/fa';
import { ExternalLink } from 'lucide-react';

// ─── Icon helpers ─────────────────────────────────────────────────────────────
function ProjectMedia({ src, videoUrl, category, cover = false }: { src?: string; videoUrl?: string; category?: string; cover?: boolean }) {
  if (videoUrl) {
    const isYt = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    if (isYt) {
      const vidId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
      return (
        <iframe 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src={`https://www.youtube.com/embed/${vidId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${vidId}`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      );
    }
    return <video src={videoUrl} autoPlay loop muted playsInline className={`relative z-10 w-full h-full ${cover ? 'object-cover' : 'object-contain'}`} />;
  }
  if (src) return <Image src={src} fill sizes="(max-width: 768px) 100vw, 500px" alt="Project Media" className={`relative z-10 ${cover ? 'object-cover' : 'object-contain scale-75'}`} />;
  
  const icons: Record<string, string> = {
    'SECURITY TOOL': '🔍', 'SECURITY APP': '🔐', 'ML + SECURITY': '🧠',
    'WEB APP': '🌐', 'EXPLOIT': '💥', 'AUTOMATION': '⚙',
  };
  return <div className="text-6xl absolute inset-0 flex items-center justify-center pointer-events-none animate-[float_4s_ease-in-out_infinite] z-10">{icons[category?.toUpperCase() ?? ''] ?? '🚀'}</div>;
}

// ─── Normalize a raw DB project to the display shape ──────────────────────────
function normalize(p: any) {
  return {
    id:       p._id,
    featured: p.featured ?? false,
    category: p.category ?? 'PROJECT',
    title:    p.title,
    desc:     p.description,
    longDesc: p.longDescription ?? p.description,
    tags:     Array.isArray(p.tags) ? p.tags : [],
    metrics:  Array.isArray(p.metrics) ? p.metrics : [],
    github:   p.githubUrl ?? null,
    demo:     p.liveUrl ?? null,
    youtube:  p.youtubeUrl ?? null,
    iconSrc:  p.imageUrl ?? p.iconSvg ?? null,
    videoUrl: p.videoUrl ?? null,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ProjectsContent({ dbProjects = [], cfg = {} }: { dbProjects?: any[], cfg?: any }) {
  const allProjects = dbProjects.map(normalize);
  // Sort: featured first, then security-focused categories
  const sortedProjects = [...allProjects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    const secCategories = ['security tool', 'security app', 'exploit', 'automation'];
    const aIsSec = secCategories.includes(a.category.toLowerCase());
    const bIsSec = secCategories.includes(b.category.toLowerCase());
    if (aIsSec && !bIsSec) return -1;
    if (!aIsSec && bIsSec) return 1;
    return 0;
  });

  const [selected, setSelected] = useState<ReturnType<typeof normalize> | null>(null);

  return (
    <div className="pt-24 min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple font-mono text-xs mb-6">
            // 03. WORK & ARCHITECTURE
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {smartPlaceholder(cfg.title, 'Security Projects & Tools')}
          </h1>
          <p className="text-gray-400 max-w-2xl mb-12">
            {smartPlaceholder(cfg.subtitle, 'Security tools, offensive utilities, and applications built with a security-first mindset.')}
          </p>
        </Reveal>

        {sortedProjects.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-6 opacity-20">◻</div>
              <h3 className="text-xl font-display font-bold text-white mb-3">No projects yet</h3>
              <p className="text-gray-500 font-mono text-sm max-w-md">
                Projects added from the admin dashboard will appear here automatically.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {sortedProjects.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.1}>
                <div onClick={() => setSelected(project)} className="cursor-pointer h-full">
                  <GlassCard className="h-full flex flex-col hover:-translate-y-2 transition-transform duration-300">
                    {project.featured && (
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full border border-neon-purple/50 bg-neon-purple/20 text-[10px] font-mono tracking-widest text-neon-purple font-bold">
                        FEATURED
                      </div>
                    )}
                    <div className="relative h-48 w-full bg-dark-main border-b border-dark-border flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent z-20 pointer-events-none" />
                      <ProjectMedia src={project.iconSrc ?? undefined} videoUrl={project.videoUrl ?? undefined} category={project.category} cover />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="text-[10px] font-mono tracking-widest text-neon-purple mb-2">{project.category}</div>
                      <h3 className="text-xl font-display font-bold text-white mb-3">{project.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1">{project.desc}</p>
                      
                      {/* Metrics */}
                      {project.metrics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.metrics.map((m: string, idx: number) => (
                            <span key={idx} className="text-[10px] px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-400 font-mono">
                              {m}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-md text-gray-300">{tag}</span>
                          ))}
                          {project.tags.length > 3 && <span className="text-xs text-gray-500 font-mono">+{project.tags.length - 3}</span>}
                        </div>
                        <div className="flex gap-2">
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                              className="p-2 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all text-gray-400 hover:text-white"
                              aria-label="View source code on GitHub">
                              <FaGithub className="w-4 h-4" />
                            </a>
                          )}
                          {project.demo && (
                            <a href={project.demo} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                              className="p-2 rounded-lg border border-neon-purple/30 hover:border-neon-purple/60 hover:bg-neon-purple/10 transition-all text-neon-purple"
                              aria-label="View live demo">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {/* YouTube Demo Integration */}
                      {project.youtube && (
                        <div onClick={e => e.stopPropagation()}>
                          <ProjectVideoPlayer youtubeUrl={project.youtube} />
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
              className="bg-dark-panel border border-neon-purple/50 rounded-2xl max-w-2xl w-full text-left shadow-[0_0_40px_rgba(168,85,247,0.2)] relative overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-[45%] bg-black border-r border-dark-border flex items-center justify-center relative overflow-hidden h-64 md:h-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent z-20 pointer-events-none" />
                <ProjectMedia src={selected.iconSrc ?? undefined} videoUrl={selected.videoUrl ?? undefined} category={selected.category} />
              </div>
              <div className="md:w-[55%] p-8 max-h-[85vh] overflow-y-auto">
                <div className="text-[10px] font-mono tracking-widest text-neon-purple mb-2">{selected.category}</div>
                <h2 className="font-display text-2xl font-bold text-white mb-4">{selected.title}</h2>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">{selected.longDesc}</p>

                {/* Metrics in modal */}
                {selected.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selected.metrics.map((m: string, idx: number) => (
                      <span key={idx} className="text-xs px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-400 font-mono">
                        {m}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-8">
                  {selected.tags.map((tag: string, i: number) => (
                    <span key={i} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-md text-gray-300">{tag}</span>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    {selected.github && (
                      <a href={selected.github} target="_blank" rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-lg border border-dark-border bg-white/5 hover:bg-white/10 text-white text-sm transition-all flex items-center gap-2">
                        <FaGithub className="w-4 h-4" /> Source Code
                      </a>
                    )}
                    {selected.demo && (
                      <a href={selected.demo} target="_blank" rel="noopener noreferrer" className="neon-btn text-sm py-2.5">
                        <ExternalLink className="w-4 h-4" /> Live Preview
                      </a>
                    )}
                  </div>
                  {/* YouTube Demo Integration */}
                  {selected.youtube && (
                    <ProjectVideoPlayer youtubeUrl={selected.youtube} />
                  )}
                </div>
              </div>
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                aria-label="Close modal">
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
