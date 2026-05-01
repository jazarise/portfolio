'use client';

import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';
import { smartPlaceholder } from '@/lib/utils';
<<<<<<< HEAD
import { Terminal, Shield, Network, Code, Search, Bug, Globe, Server, Cpu, Lock } from 'lucide-react';

const SKILLS_TOOLS = [
  { name: 'Linux',       icon: Terminal, color: '#f97316' },
  { name: 'Networking',  icon: Network,  color: '#22d3ee' },
  { name: 'Python',      icon: Code,     color: '#3b82f6' },
  { name: 'Burp Suite',  icon: Bug,      color: '#ef4444' },
  { name: 'Nmap',        icon: Search,   color: '#22c55e' },
  { name: 'Wireshark',   icon: Globe,    color: '#06b6d4' },
  { name: 'Metasploit',  icon: Shield,   color: '#a855f7' },
  { name: 'Nessus',      icon: Server,   color: '#f59e0b' },
  { name: 'Docker',      icon: Cpu,      color: '#3b82f6' },
  { name: 'Git',         icon: Code,     color: '#ef4444' },
  { name: 'John/Hashcat',icon: Lock,     color: '#ec4899' },
  { name: 'SQLmap',      icon: Terminal,  color: '#8b5cf6' },
];

const PROGRESS_ITEMS = [
  { label: 'TryHackMe Rooms Completed', value: '80+',   color: '#88cc14' },
  { label: 'CTF Challenges Solved',     value: '50+',   color: '#22d3ee' },
  { label: 'Security Tools Built',      value: '5+',    color: '#a855f7' },
  { label: 'Network Scans Performed',   value: '200+',  color: '#ef4444' },
];

=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
export default function AboutContent({ cfg, homeCfg }: { cfg: any, homeCfg: any }) {
  const parsedFocuses = (cfg.focuses || '').split(';').map((f: string) => {
    const [label, level] = f.split(',');
    return { label: label?.trim() || 'Unknown', level: level?.trim() || 'Unknown' };
  }).filter((f: any) => f.label !== 'Unknown');

  const loc = homeCfg?.location || '';
  const mail = homeCfg?.email || '';

  return (
    <div className="pt-24 min-h-screen">
<<<<<<< HEAD
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
=======
      <section className="max-w-7xl mx-auto px-6 py-12 text-center md:text-left">
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple font-mono text-xs mb-6">
            // 01. IDENTITY
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">
            Behind the <span className="neon-text">Terminal</span>
          </h1>
        </Reveal>

<<<<<<< HEAD
        {/* Bio — broken into subsections */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-20">
          <Reveal delay={0.1}>
            <div className="space-y-8">
              <div>
                <h3 className="font-display font-bold text-lg text-white mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-neon-purple" /> Security Mindset
                </h3>
                <p className="text-gray-400 leading-relaxed">{smartPlaceholder(cfg.p1)}</p>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white mb-3 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-neon-cyan" /> The Journey
                </h3>
                <p className="text-gray-400 leading-relaxed">{smartPlaceholder(cfg.p2)}</p>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white mb-3 flex items-center gap-2">
                  <Code className="w-5 h-5 text-neon-pink" /> Beyond Hacking
                </h3>
                <p className="text-gray-400 leading-relaxed">{smartPlaceholder(cfg.p3)}</p>
              </div>

=======
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal delay={0.1}>
            <div className="text-gray-400 space-y-6 text-lg leading-relaxed text-left">
              <p>{smartPlaceholder(cfg.p1)}</p>
              <p>{smartPlaceholder(cfg.p2)}</p>
              <p>{smartPlaceholder(cfg.p3)}</p>
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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
<<<<<<< HEAD
            <div className="absolute inset-0 bg-neon-purple/10 blur-[100px] -z-10 rounded-full mix-blend-screen" />
            <GlassCard className="p-8 border border-neon-purple/30 shadow-[0_0_30px_rgba(168,85,247,0.1)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/15 blur-3xl -z-10 group-hover:bg-neon-cyan/20 transition-colors" />
=======
            <div className="absolute inset-0 bg-neon-purple/20 blur-[100px] -z-10 rounded-full mix-blend-screen" />
            <GlassCard className="p-8 border border-neon-purple/40 shadow-[0_0_40px_rgba(157,0,255,0.15)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/20 blur-3xl -z-10 group-hover:bg-neon-cyan/30 transition-colors" />
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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
<<<<<<< HEAD

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
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
      </section>
    </div>
  );
}
