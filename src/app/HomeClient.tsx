'use client';

import { motion } from 'framer-motion';
import Reveal from '@/components/Reveal';
import Link from 'next/link';
import { smartPlaceholder } from '@/lib/utils';
import { useGlobal } from '@/lib/GlobalState';

const SKILLS = [
  { label: 'Penetration Testing',  pct: 85, color: '#9d00ff' },
  { label: 'Network Security',     pct: 80, color: '#00d4ff' },
  { label: 'VAPT & Threat Analysis',pct: 78, color: '#ff0080' },
  { label: 'Python / Scripting',   pct: 90, color: '#00ff88' },
  { label: 'Web App Security',     pct: 82, color: '#9d00ff' },
  { label: 'Malware Analysis',     pct: 65, color: '#ff6600' },
];

const TOOLS = [
  { name: 'Nmap',      icon: '🔍' },
  { name: 'Burp Suite',icon: '🕷' },
  { name: 'Wireshark', icon: '🌊' },
  { name: 'Metasploit',icon: '💥' },
  { name: 'Nessus',    icon: '🛡' },
  { name: 'John',      icon: '🔓' },
  { name: 'Hydra',     icon: '🐉' },
  { name: 'SQLmap',    icon: '💉' },
];

const DEFAULT_PLATFORMS = [
  { name: 'TryHackMe',   rank: 'Top 1%',   color: '#88cc14', href: 'https://tryhackme.com/p/jaishanth' },
  { name: 'Hack The Box', rank: 'Hacker',   color: '#9fef00', href: 'https://hackthebox.com' },
];

export default function HomeClient({ cfg: previewCfg }: { cfg?: any }) {
  const { homeCfg = {} } = useGlobal() || {};
  const cfg = previewCfg || homeCfg || {};

  // Parse dynamic skills
  const parsedSkills = (cfg.skills || '').split(';').map((s: string) => {
    const [label, pct] = s.split(',');
    return { label: label?.trim() || 'Unknown', pct: parseInt(pct) || 0, color: '#9d00ff' };
  });
  const skillsToUse = parsedSkills.length > 0 && parsedSkills[0].label !== 'Unknown' ? parsedSkills : SKILLS;

  // Parse dynamic platforms (Format: "TryHackMe,75%,#88cc14,url; HackerRank,Hacker,#00EA64,url")
  const parsedPlatforms = (cfg.platforms || '').split(';').map((s: string) => {
    const [name, rank, color, href] = s.split(',');
    return { 
      name: name?.trim() || '', 
      rank: rank?.trim() || '', 
      color: color?.trim() || '#9d00ff', 
      href: href?.trim() || '#' 
    };
  }).filter((p: any) => p.name);
  const platformsToUse = parsedPlatforms.length > 0 ? parsedPlatforms : DEFAULT_PLATFORMS;

  return (
    <div className="relative min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex items-center pt-24 pb-16 px-6 overflow-hidden">
        {/* Glows */}
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-neon-purple/15 rounded-full blur-[120px] -z-10 mix-blend-screen" />
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-neon-cyan/8 rounded-full blur-[100px] -z-10 mix-blend-screen" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT */}
          <div className="flex flex-col gap-6 relative z-10">
            <Reveal>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-neon-purple/30 bg-neon-purple/8 backdrop-blur-md w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan" />
                </span>
                <span className="text-xs font-mono font-medium tracking-wider text-neon-cyan">
                  {cfg.availableForWork ? 'OPEN TO OPPORTUNITIES' : 'CURRENTLY UNAVAILABLE'}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-6xl md:text-8xl font-bold font-display leading-[1.05] tracking-tighter">
                {smartPlaceholder(cfg.heading, 'Jaishanth M').split(' ')[0]}{' '}
                <span className="neon-text neon-text-glow">{smartPlaceholder(cfg.heading, 'Jaishanth M').split(' ').slice(1).join(' ')}.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl md:text-2xl font-mono text-gray-300">{smartPlaceholder(cfg.tagline)}</h2>
                <span className="px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/25 text-neon-purple font-mono text-xs">
                  Ethical Hacker
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="flex flex-wrap gap-2">
                {['VAPT', 'Threat Analysis', 'Penetration Testing', 'Reconnaissance', 'Exploitation', 'Network Security'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-white/4 border border-white/6 text-gray-500 font-mono text-[10px] tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-lg text-gray-400 max-w-xl leading-relaxed">{smartPlaceholder(cfg.bio)}</p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <Link href="/projects" className="neon-btn group">
                  View Projects <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link href="/contact" className="px-6 py-3 rounded-lg font-medium text-white bg-dark-glass border border-dark-border hover:bg-white/5 transition-all flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
                  Contact
                </Link>
                <a href="/resume.pdf" target="_blank" className="px-6 py-3 rounded-lg font-mono text-xs text-gray-400 border border-white/8 hover:bg-white/4 transition-all">
                  Download CV ↓
                </a>
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={0.5}>
              <div className="flex flex-wrap gap-10 mt-10 pt-8 border-t border-dark-border/40 relative">
                <div className="absolute top-0 left-0 w-24 h-px bg-gradient-to-r from-neon-purple to-transparent" />
                {[
                  { val: cfg.statProjects || '15+', label: 'Projects', color: 'text-neon-purple' },
                  { val: cfg.statCerts || '6',    label: 'Certifications', color: 'text-neon-cyan' },
                  ...(platformsToUse.length > 0 ? [{ val: platformsToUse[0].rank, label: platformsToUse[0].name, color: 'text-neon-pink' }] : [])
                ].map(s => (
                  <div key={s.label}>
                    <div className={`text-4xl font-display font-bold text-white mb-1 ${s.color} drop-shadow-[0_0_8px_currentColor]`}>{s.val}</div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT — Terminal */}
          <Reveal delay={0.3} className="relative z-10">
            <div className="glass-panel p-1 w-full relative group animate-[float_6s_ease-in-out_infinite]">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/8 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
              <div className="bg-[#040408]/95 rounded-xl overflow-hidden border border-white/4 relative z-10">
                {/* Terminal header */}
                <div className="bg-[#0a0a12] border-b border-white/5 px-4 py-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="text-xs font-mono text-gray-600">root@{cfg.brandHandle || 'jaishanthm'}:~#</div>
                  <div className="w-16" />
                </div>
                {/* Terminal body */}
                <div className="p-6 font-mono text-sm space-y-3.5 text-gray-300 leading-relaxed">
                  <Line cmd="whoami" out={`${cfg.heading || 'Jaishanth M'} / ${cfg.subheading || 'Ethical Hacker'}`} />
                  <Line cmd="cat /etc/passions" out={null} />
                  <ul className="pl-4 border-l-2 border-neon-purple/20 space-y-1 text-gray-400">
                    {['Penetration Testing & Exploitation', 'Cryptography & Reverse Engineering', 'CTF Competitions & OSINT'].map(p => (
                      <li key={p}><span className="text-neon-purple">→</span> {p}</li>
                    ))}
                  </ul>
                  <Line cmd="echo $LOCATION" out={cfg.location} outColor="text-emerald-400" />
                  <Line cmd="nmap -sV localhost" out="Scanning for open ports..." outColor="text-neon-cyan" />
                  <div className="flex gap-2 pl-0">
                    <span className="text-neon-pink">❯</span>
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }}
                      className="w-2 h-4 bg-white inline-block" />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SKILLS ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/6 text-neon-cyan font-mono text-xs mb-6">
            // 02. CAPABILITIES
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-12">
            Security <span className="neon-text">Arsenal</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Skill Domains Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillsToUse.map((skill: any, i: number) => (
              <Reveal key={skill.label} delay={i * 0.05}>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[var(--hover-color)] hover:bg-white/[0.07] transition-all group flex flex-col gap-2" style={{ '--hover-color': skill.color + 'aa' } as React.CSSProperties}>
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: skill.color, color: skill.color }} />
                    <span className="font-display font-bold text-white tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">{skill.label}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Tools + Platforms */}
          <div className="space-y-8">
            <Reveal delay={0.2}>
              <div>
                <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Tactical Tools</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TOOLS.map((t, i) => (
                    <div key={t.name} className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-neon-cyan/40 hover:bg-neon-cyan/5 hover:-translate-y-1 transition-all duration-300 group shadow-[0_4px_20px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]">
                      <span className="text-3xl filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">{t.icon}</span>
                      <span className="text-[10px] font-mono text-gray-400 group-hover:text-white transition-colors text-center tracking-wider">{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div>
                <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Platform Rankings</div>
                <div className="space-y-3">
                  {platformsToUse.map((p: any) => (
                    <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between px-6 py-4 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10 hover:border-white/25 hover:from-white/10 transition-all duration-300 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--plat-color)] opacity-0 group-hover:opacity-10 transition-opacity" style={{ '--plat-color': p.color } as React.CSSProperties} />
                      <span className="font-display font-bold tracking-wide text-gray-300 group-hover:text-white transition-colors z-10">{p.name}</span>
                      <div className="flex items-center gap-3 z-10 bg-dark-main/50 px-3 py-1.5 rounded-lg border border-white/5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }} />
                        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">{p.rank}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-neon-purple/20 bg-gradient-to-br from-neon-purple/8 via-transparent to-neon-cyan/5 p-10 md:p-14 text-center">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/60 to-transparent" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon-purple/15 rounded-full blur-[80px] -z-10" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Let&apos;s Build Something <span className="neon-text">Secure</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Looking for a cybersecurity intern, red-team collaborator, or a developer who understands both offense and defense?
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact" className="neon-btn">Open a Secure Channel →</Link>
              <Link href="/projects" className="px-6 py-3 rounded-lg font-mono text-sm text-gray-400 border border-white/8 hover:bg-white/4 transition-all">
                View Work
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function Line({ cmd, out, outColor = 'text-gray-400' }: { cmd: string; out: string | null; outColor?: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-neon-pink">❯</span>
        <span className="text-neon-cyan">{cmd.split(' ')[0]}</span>
        {cmd.includes(' ') && <span className="text-gray-500">{cmd.slice(cmd.indexOf(' '))}</span>}
      </div>
      {out && <div className={`pl-5 ${outColor}`}>{out}</div>}
    </div>
  );
}
