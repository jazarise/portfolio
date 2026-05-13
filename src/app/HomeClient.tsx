'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Reveal from '@/components/Reveal';
import Link from 'next/link';
import { smartPlaceholder } from '@/lib/utils';
import { useGlobal } from '@/lib/GlobalState';
import { Shield, Terminal, Bug, Network, Search, Lock, Fingerprint, Database } from 'lucide-react';
import { SiWireshark, SiBurpsuite, SiMetasploit, SiKalilinux, SiGnubash } from 'react-icons/si';

const SKILLS = [
  { label: 'Penetration Testing',  pct: 85, color: '#a855f7' },
  { label: 'Network Security',     pct: 80, color: '#22d3ee' },
  { label: 'VAPT & Threat Analysis',pct: 78, color: '#ec4899' },
  { label: 'Python / Scripting',   pct: 90, color: '#22c55e' },
  { label: 'Web App Security',     pct: 82, color: '#a855f7' },
  { label: 'Malware Analysis',     pct: 65, color: '#f97316' },
];

const TOOLS = [
  { name: 'Nmap',      icon: SiKalilinux, color: '#0E83CD' },
  { name: 'Burp Suite', icon: SiBurpsuite, color: '#FF6633' },
  { name: 'Wireshark', icon: SiWireshark, color: '#1679A7' },
  { name: 'Metasploit', icon: SiMetasploit,color: '#2596CD' },
  { name: 'Nessus',    icon: Shield,      color: '#00B6DE' },
  { name: 'John',      icon: Lock,        color: '#BA2133' },
  { name: 'Hydra',     icon: SiGnubash,   color: '#EA4335' },
  { name: 'SQLmap',    icon: Database,    color: '#CC2927' },
];

const DEFAULT_PLATFORMS = [
  { name: 'TryHackMe',   rank: 'Top 1%',   color: '#88cc14', href: 'https://tryhackme.com/p/jaishanth' },
  { name: 'Hack The Box', rank: 'Hacker',   color: '#9fef00', href: 'https://hackthebox.com' },
];

const WHAT_I_DO = [
  { icon: Shield, title: 'Offensive Security', desc: 'Penetration testing, vulnerability assessment, and exploit development across network and web application domains.' },
  { icon: Terminal, title: 'Security Research', desc: 'CTF competitions, TryHackMe/HTB lab environments, and real-world vulnerability analysis with documented writeups.' },
  { icon: Lock, title: 'Secure Development', desc: 'Building applications with security-first architecture — input validation, auth hardening, and threat modeling.' },
];

// Typing animation hook
function useTypingAnimation(text: string, speed = 60) {
  const [displayedText, setDisplayedText] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayedText, done };
}

export default function HomeClient({ cfg: previewCfg, projectCount = 0, certCount = 0 }: { cfg?: any; projectCount?: number; certCount?: number }) {
  const { homeCfg = {} } = useGlobal() || {};
  const cfg = previewCfg || homeCfg || {};

  // Parse dynamic skills using useMemo to prevent array reference changing on every render tick
  const skillsToUse = useMemo(() => {
    const parsed = (cfg.skills || '').split(';').map((s: string) => {
      const [label, pct] = s.split(',');
      return { label: label?.trim() || 'Unknown', pct: parseInt(pct) || 0, color: '#a855f7' };
    });
    return parsed.length > 0 && parsed[0].label !== 'Unknown' ? parsed : SKILLS;
  }, [cfg.skills]);

  // Parse dynamic platforms
  const platformsToUse = useMemo(() => {
    const parsed = (cfg.platforms || '').split(';').map((s: string) => {
      const [name, rank, color, href] = s.split(',');
      return { 
        name: name?.trim() || '', 
        rank: rank?.trim() || '', 
        color: color?.trim() || '#a855f7', 
        href: href?.trim() || '#' 
      };
    }).filter((p: any) => p.name);
    return parsed.length > 0 ? parsed : DEFAULT_PLATFORMS;
  }, [cfg.platforms]);

  const whoamiOutput = `${cfg.heading || 'Jaishanth M'} / ${cfg.subheading || 'Aspiring Red Teamer'}`;
  const { displayedText: typedWhoami, done: whoamiDone } = useTypingAnimation(whoamiOutput, 40);

  return (
    <div className="relative min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex items-center pt-24 pb-16 px-4 md:px-6 overflow-hidden">
        {/* Glows — reduced on mobile for performance */}
        <div className="absolute top-1/3 -right-40 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-neon-purple/10 rounded-full blur-[120px] -z-10 mix-blend-screen" />
        <div className="hidden md:block absolute bottom-1/4 -left-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[100px] -z-10 mix-blend-screen" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* LEFT */}
          <div className="flex flex-col gap-6 relative z-10">
            <Reveal>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-neon-purple/30 bg-neon-purple/8 backdrop-blur-md w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs font-mono font-medium tracking-wider text-emerald-400">
                  {cfg.availableForWork ? 'AVAILABLE FOR INTERNSHIPS' : 'CURRENTLY UNAVAILABLE'}
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold font-display leading-[1.05] tracking-tighter">
                {smartPlaceholder(cfg.heading, 'Jaishanth M').split(' ')[0]}{' '}
                <span className="neon-text neon-text-glow">{smartPlaceholder(cfg.heading, 'Jaishanth M').split(' ').slice(1).join(' ')}.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl md:text-2xl font-mono text-gray-300">Cybersecurity Student</h2>
                <span className="px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/25 text-neon-purple font-mono text-xs">
                  Aspiring Red Teamer
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="hidden md:flex flex-wrap gap-2">
                {['VAPT', 'Threat Analysis', 'Penetration Testing', 'Reconnaissance', 'Exploitation', 'Network Security'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-md bg-white/4 border border-white/6 text-gray-500 font-mono text-[10px] tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed">{smartPlaceholder(cfg.bio)}</p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <Link href="/projects" className="neon-btn group">
                  View Security Work <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link href="/contact" className="px-6 py-3 rounded-lg font-medium text-white bg-dark-glass border border-dark-border hover:bg-white/5 transition-all flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
                  Contact
                </Link>
                <a href={cfg.resumeUrl || "/resume.pdf"} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-lg font-mono text-xs text-gray-400 border border-white/8 hover:bg-white/4 transition-all">
                  Download CV ↓
                </a>
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={0.5}>
              <div className="flex flex-wrap gap-6 md:gap-10 mt-8 md:mt-10 pt-6 md:pt-8 border-t border-dark-border/40 relative">
                <div className="absolute top-0 left-0 w-24 h-px bg-gradient-to-r from-neon-purple to-transparent" />
                {[
                  { val: projectCount > 0 ? `${projectCount}+` : (cfg.statProjects || '0'), label: 'Projects', color: 'text-neon-purple' },
                  { val: certCount > 0 ? `${certCount}` : (cfg.statCerts || '0'), label: 'Certifications', color: 'text-neon-cyan' },
                  ...(platformsToUse.length > 0 ? [{ val: platformsToUse[0].rank, label: platformsToUse[0].name, color: 'text-neon-pink hidden md:block' }] : [])
                ].map(s => (
                  <div key={s.label}>
                    <div className={`text-3xl md:text-4xl font-display font-bold text-white mb-1 ${s.color} drop-shadow-[0_0_6px_currentColor]`}>{s.val}</div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT — Terminal with typing animation (hidden on mobile) */}
          <Reveal delay={0.3} className="relative z-10 hidden lg:block">
            <div className="glass-panel p-1 w-full relative group animate-[float_6s_ease-in-out_infinite]">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
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
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-neon-pink">❯</span>
                      <span className="text-neon-cyan">whoami</span>
                    </div>
                    <div className="pl-5 text-gray-300">
                      {typedWhoami}
                      {!whoamiDone && <span className="inline-block w-2 h-4 bg-neon-cyan ml-0.5 animate-pulse" />}
                    </div>
                  </div>
                  <Line cmd="cat /etc/focus" out={null} />
                  <ul className="pl-4 border-l-2 border-neon-purple/20 space-y-1 text-gray-400">
                    {['Penetration Testing & Red Teaming', 'Network Security & VAPT', 'CTF Competitions & OSINT'].map(p => (
                      <li key={p}><span className="text-neon-purple">→</span> {p}</li>
                    ))}
                  </ul>
                  <Line cmd="echo $LOCATION" out={cfg.location} outColor="text-emerald-400" />
                  <Line cmd="nmap -sV --top-ports 100 target" out="Scanning for open ports..." outColor="text-neon-cyan" />
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

      {/* ── WHAT I DO ──────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/6 text-neon-cyan font-mono text-xs mb-6">
            // 01. WHAT I DO
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-12">
            Security <span className="neon-text">Mindset</span>, Applied
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {WHAT_I_DO.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-neon-purple/30 hover:bg-white/[0.05] transition-all duration-300 group h-full">
                <div className="w-12 h-12 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center mb-5 group-hover:bg-neon-purple/15 transition-colors">
                  <item.icon className="w-6 h-6 text-neon-purple" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PROOF OF WORK ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/6 text-emerald-400 font-mono text-xs mb-6">
            // 02. PROOF OF WORK
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-12">
            Hands-On <span className="neon-text">Experience</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Platform Rankings */}
          <div className="space-y-4">
            <Reveal delay={0.1}>
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Platform Rankings</div>
            </Reveal>
            {platformsToUse.map((p: any, i: number) => (
              <Reveal key={p.name} delay={0.15 + i * 0.1}>
                <a href={p.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-6 py-5 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10 hover:border-white/25 hover:from-white/10 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--plat-color)] opacity-0 group-hover:opacity-10 transition-opacity" style={{ '--plat-color': p.color } as React.CSSProperties} />
                  <span className="font-display font-bold tracking-wide text-gray-300 group-hover:text-white transition-colors z-10">{p.name}</span>
                  <div className="flex items-center gap-3 z-10 bg-dark-main/50 px-3 py-1.5 rounded-lg border border-white/5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color, boxShadow: `0 0 6px ${p.color}` }} />
                    <span className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">{p.rank}</span>
                  </div>
                </a>
              </Reveal>
            ))}

            {/* Decorative System Status Panel — hidden on mobile for performance */}
            <Reveal delay={0.3}>
              <div className="hidden md:block mt-8 relative rounded-xl border border-neon-cyan/20 bg-[#040408]/60 backdrop-blur-sm overflow-hidden p-6 group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px] mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 blur-3xl -z-10 group-hover:bg-neon-cyan/20 transition-all duration-700"></div>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">System Active</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">127.0.0.1</span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'THREAT INTEL', val: 'SYNCED', color: 'text-cyan-400' },
                    { label: 'PACKET CAPTURE', val: 'SNIFFING', color: 'text-purple-400' },
                    { label: 'FIREWALL', val: 'ENFORCED', color: 'text-emerald-400' },
                    { label: 'DECRYPTION', val: 'OFFLINE', color: 'text-gray-500' }
                  ].map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs font-mono text-gray-400">{stat.label}</span>
                      <span className={`text-[10px] font-mono tracking-widest ${stat.color}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>

                {/* Simulated Waveform/Radar */}
                <div className="mt-6 h-12 w-full flex items-end gap-1 opacity-50">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      className="flex-1 bg-neon-cyan/50 rounded-t-sm"
                      animate={{ height: ['20%', '80%', '40%', '100%', '30%'] }}
                      transition={{ duration: 1.5 + Math.random(), repeat: Infinity, repeatType: 'mirror', delay: i * 0.05 }}
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Skills + Tools */}
          <div className="space-y-8">
            <Reveal delay={0.2}>
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Skill Domains</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skillsToUse.map((skill: any) => (
                  <div key={skill.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/8 hover:border-[var(--hover-color)] hover:bg-white/[0.05] transition-all group flex items-center gap-3" style={{ '--hover-color': skill.color + 'aa' } as React.CSSProperties}>
                    <span className="w-2 h-2 rounded-full shadow-[0_0_6px_currentColor] shrink-0" style={{ backgroundColor: skill.color, color: skill.color }} />
                    <span className="font-display font-semibold text-sm text-gray-300 group-hover:text-white transition-all">{skill.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Tactical Tools</div>
              <div className="grid grid-cols-2 gap-3">
                {TOOLS.map((t) => (
                  <div key={t.name} className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-[var(--tool-color)] hover:bg-white/[0.03] hover:-translate-y-1 transition-all duration-300 group" style={{ '--tool-color': t.color + '55' } as React.CSSProperties}>
                    <t.icon className="w-6 h-6 text-gray-500 transition-colors duration-300" style={{ color: 'var(--icon-color, #6b7280)' }} 
                      ref={(el: any) => {
                        if (el) {
                          el.parentElement.onmouseenter = () => el.style.setProperty('--icon-color', t.color);
                          el.parentElement.onmouseleave = () => el.style.setProperty('--icon-color', '#6b7280');
                        }
                      }}
                    />
                    <span className="text-[10px] font-mono text-gray-400 group-hover:text-white transition-colors text-center tracking-wider">{t.name}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-neon-purple/20 bg-gradient-to-br from-neon-purple/8 via-transparent to-neon-cyan/5 p-6 md:p-14 text-center">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/60 to-transparent" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon-purple/10 rounded-full blur-[80px] -z-10" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Let&apos;s Build Something <span className="neon-text">Secure</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Looking for a cybersecurity intern, red-team collaborator, or a developer who understands both offense and defense?
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact" className="neon-btn">Open a Secure Channel →</Link>
              <Link href="/projects" className="px-6 py-3 rounded-lg font-mono text-sm text-gray-400 border border-white/8 hover:bg-white/4 transition-all">
                View Security Work
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
