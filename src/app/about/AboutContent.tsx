'use client';

import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';
import { smartPlaceholder } from '@/lib/utils';
import { Terminal, Shield, Network, Code, Lock, Database, Users, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import { SiWireshark, SiBurpsuite, SiMetasploit, SiKalilinux, SiPython, SiLinux, SiDocker, SiGit } from 'react-icons/si';

const SKILLS_TOOLS = [
  { name: 'Linux',       icon: SiLinux,  color: '#f97316' },
  { name: 'Networking',  icon: Network,  color: '#22d3ee' },
  { name: 'Python',      icon: SiPython, color: '#3b82f6' },
  { name: 'Burp Suite',  icon: SiBurpsuite, color: '#ef4444' },
  { name: 'Nmap',        icon: SiKalilinux, color: '#22c55e' },
  { name: 'Wireshark',   icon: SiWireshark, color: '#06b6d4' },
  { name: 'Metasploit',  icon: SiMetasploit, color: '#a855f7' },
  { name: 'Nessus',      icon: Shield,   color: '#f59e0b' },
  { name: 'Docker',      icon: SiDocker, color: '#3b82f6' },
  { name: 'Git',         icon: SiGit,    color: '#ef4444' },
  { name: 'John/Hashcat',icon: Lock,     color: '#ec4899' },
  { name: 'SQLmap',      icon: Database, color: '#8b5cf6' },
];

const PROGRESS_ITEMS = [
  { label: 'TryHackMe Rooms Completed', value: '80+',   color: '#88cc14' },
  { label: 'CTF Challenges Solved',     value: '50+',   color: '#22d3ee' },
  { label: 'Security Tools Built',      value: '5+',    color: '#a855f7' },
  { label: 'Network Scans Performed',   value: '200+',  color: '#ef4444' },
];

export default function AboutContent({ cfg, homeCfg }: { cfg: any, homeCfg: any }) {
  const parsedFocuses = (cfg.focuses || '').split(';').map((f: string) => {
    const [label, level] = f.split(',');
    return { label: label?.trim() || 'Unknown', level: level?.trim() || 'Unknown' };
  }).filter((f: any) => f.label !== 'Unknown');

  const loc = homeCfg?.location || '';
  const mail = homeCfg?.email || '';

  return (
    <div className="pt-24 min-h-screen">
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Header */}
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple font-mono text-xs mb-6">
            // 01. IDENTITY
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">
            Behind the <span className="neon-text">Terminal</span>
          </h1>
        </Reveal>

        {/* Bio — broken into subsections */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
          <Reveal delay={0.1}>
            <div className="space-y-8">
              <div>
                <h3 className="font-display font-bold text-lg text-white mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-neon-purple" /> Identity & Education
                </h3>
                <p className="text-gray-300 leading-relaxed font-sans">{smartPlaceholder(cfg.p1)}</p>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white mb-3 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-neon-cyan" /> Security Mindset & Approach
                </h3>
                <p className="text-gray-300 leading-relaxed font-sans">{smartPlaceholder(cfg.p2)}</p>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-neon-pink" /> Technical Specializations
                </h3>
                <p className="text-gray-300 leading-relaxed font-sans">{smartPlaceholder(cfg.p3)}</p>
              </div>
              {cfg.p4 && (
                <div>
                  <h3 className="font-display font-bold text-lg text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-emerald-400" /> Practice & Career Goals
                  </h3>
                  <p className="text-gray-300 leading-relaxed font-sans">{cfg.p4}</p>
                </div>
              )}

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
            <div className="absolute inset-0 bg-neon-purple/10 blur-[100px] -z-10 rounded-full mix-blend-screen" />
            <GlassCard className="p-8 border border-neon-purple/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/15 blur-3xl -z-10 group-hover:bg-neon-cyan/20 transition-colors" />
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

        {/* Skills & Tools Grid */}
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/6 text-neon-cyan font-mono text-xs mb-6">
            // SKILLS & TOOLS
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
            Technical <span className="neon-text">Arsenal</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-20">
          {SKILLS_TOOLS.map((tool, i) => (
            <Reveal key={tool.name} delay={i * 0.03}>
              <div className="flex flex-col items-center justify-center gap-3 py-5 px-3 rounded-xl bg-white/[0.03] border border-white/8 hover:border-[var(--tool-color)] hover:bg-white/[0.06] hover:-translate-y-1 transition-all duration-300 group"
                style={{ '--tool-color': tool.color + '80' } as React.CSSProperties}>
                <tool.icon className="w-7 h-7 text-gray-500 group-hover:text-[var(--tool-active)]  transition-colors" style={{ '--tool-active': tool.color } as React.CSSProperties} />
                <span className="text-xs font-mono text-gray-400 group-hover:text-white transition-colors text-center tracking-wider">{tool.name}</span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Real-World Progress */}
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/6 text-emerald-400 font-mono text-xs mb-6">
            // REAL-WORLD PROGRESS
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
            Lab <span className="neon-text">Metrics</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PROGRESS_ITEMS.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.1}>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/8 text-center hover:border-[var(--item-color)] transition-all group"
                style={{ '--item-color': item.color + '60' } as React.CSSProperties}>
                <div className="text-4xl font-display font-bold mb-2" style={{ color: item.color }}>{item.value}</div>
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{item.label}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Collaborate + Idea to Break ──────────────────────── */}
        <Reveal>
          <div className="grid md:grid-cols-2 gap-5 mt-16">
            <div className="relative overflow-hidden rounded-2xl border border-neon-purple/25 bg-gradient-to-br from-neon-purple/8 via-transparent to-neon-violet/5 p-7 group hover:border-neon-purple/45 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />
              <div className="w-11 h-11 rounded-2xl bg-neon-purple/12 border border-neon-purple/25 flex items-center justify-center mb-5">
                <Users className="w-5 h-5 text-neon-purple" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3">Want to collaborate?</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                I&apos;m happy to chat about internships, CTFs, or security research. Let&apos;s build something secure together.
              </p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm font-medium text-white bg-neon-purple/15 border border-neon-purple/35 hover:bg-neon-purple/25 hover:border-neon-purple/60 transition-all">
                Reach out →
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-neon-cyan/25 bg-gradient-to-br from-neon-cyan/6 via-transparent to-emerald-500/4 p-7 group hover:border-neon-cyan/45 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
              <div className="w-11 h-11 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/25 flex items-center justify-center mb-5">
                <Lightbulb className="w-5 h-5 text-neon-cyan" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3">Have an idea to break?</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Always up for red-team tooling, vulnerability research, or CTF collaboration.
              </p>
              <Link href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm font-medium text-white bg-neon-cyan/10 border border-neon-cyan/30 hover:bg-neon-cyan/18 hover:border-neon-cyan/55 transition-all">
                <Terminal className="w-4 h-4" /> Let&apos;s talk →
              </Link>
            </div>
          </div>
        </Reveal>

      </section>
    </div>
  );
}
