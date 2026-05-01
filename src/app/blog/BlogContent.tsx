'use client';

import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';

// ─── Normalize DB post to display shape ──────────────────────────────────────
function normalize(p: any) {
  return {
    id:       p._id,
    title:    p.title,
    excerpt:  p.excerpt ?? '',
    slug:     p.slug ?? '',
    date:     p.createdAt
      ? new Date(p.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : '—',
    tags:     Array.isArray(p.tags) ? p.tags : [],
    coverImage: p.coverImage ?? null,
    videoUrl:   p.videoUrl ?? null,
  };
}

function BlogMedia({ src, videoUrl }: { src?: string; videoUrl?: string }) {
  if (!src && !videoUrl) return null;
  
  if (videoUrl) {
    const isYt = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    if (isYt) {
      const vidId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
      return (
        <iframe 
          className="w-full aspect-video object-cover rounded-xl mb-6 shadow-lg border border-white/5 pointer-events-none"
          src={`https://www.youtube.com/embed/${vidId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${vidId}`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      );
    }
    return <video src={videoUrl} autoPlay loop muted playsInline className="w-full aspect-video object-cover rounded-xl mb-6 shadow-lg border border-white/5" />;
  }
  
  if (src) return <img src={src} alt="Blog Cover" className="w-full aspect-video object-cover rounded-xl mb-6 shadow-lg border border-white/5" />;
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function BlogContent({ dbPosts = [], cfg = {} }: { dbPosts?: any[], cfg?: any }) {
  const allPosts = dbPosts.map(normalize);

  return (
    <div className="pt-24 min-h-screen">
      <section className="max-w-7xl mx-auto px-6 py-12">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple font-mono text-xs mb-6">
            // RESEARCH & WRITINGS
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {cfg.title || 'Security Insights'}
          </h1>
          <p className="text-gray-400 max-w-2xl mb-12">
            {cfg.subtitle || 'Write-ups, vulnerability analyses, CTF solutions and architectural thoughts on building secure robust systems.'}
          </p>
        </Reveal>

        {allPosts.length === 0 ? (
          <Reveal delay={0.1}>
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-6 opacity-20">◇</div>
              <h3 className="text-xl font-display font-bold text-white mb-3">No posts yet</h3>
              <p className="text-gray-500 font-mono text-sm max-w-md">
                Blog posts published from the admin dashboard will appear here automatically.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="flex flex-col gap-6">
            {allPosts.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.1}>
                <GlassCard className="p-8 group cursor-pointer hover:border-neon-purple/50 transition-all">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white group-hover:text-neon-pink transition-colors leading-snug cursor-pointer">
                      {post.title}
                    </h3>
                    <div className="text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block shrink-0 mt-1 cursor-pointer">
                      Read Article →
                    </div>
                  </div>

                  <BlogMedia src={post.coverImage} videoUrl={post.videoUrl} />

                  {post.excerpt && (
                    <p className="text-gray-400 leading-relaxed mb-6 max-w-4xl">{post.excerpt}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-gray-500">
                    <span>{post.date}</span>
                    {post.tags.length > 0 && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-dark-border" />
                        <div className="flex gap-2 flex-wrap">
                          {post.tags.map((tag: string) => (
                            <span key={tag} className="text-neon-purple">{tag}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
