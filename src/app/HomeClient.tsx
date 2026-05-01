'use client';

import { motion } from 'framer-motion';
<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
import Reveal from '@/components/Reveal';
import Link from 'next/link';
import { smartPlaceholder } from '@/lib/utils';
import { useGlobal } from '@/lib/GlobalState';
<<<<<<< HEAD
import { Shield, Terminal, Bug, Network, Search, Lock, Fingerprint, Cpu } from 'lucide-react';

const SKILLS = [
  { label: 'Penetration Testing',  pct: 85, color: '#a855f7' },
  { label: 'Network Security',     pct: 80, color: '#22d3ee' },
  { label: 'VAPT & Threat Analysis',pct: 78, color: '#ec4899' },
  { label: 'Python / Scripting',   pct: 90, color: '#22c55e' },
  { label: 'Web App Security',     pct: 82, color: '#a855f7' },
  { label: 'Malware Analysis',     pct: 65, color: '#f97316' },
];

const TOOLS = [
  { name: 'Nmap',      icon: Search },
  { name: 'Burp Suite', icon: Bug },
  { name: 'Wireshark', icon: Network },
  { name: 'Metasploit', icon: Terminal },
  { name: 'Nessus',    icon: Shield },
  { name: 'John',      icon: Lock },
  { name: 'Hydra',     icon: Fingerprint },
  { name: 'SQLmap',    icon: Cpu },
=======

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
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
];

const DEFAULT_PLATFORMS = [
  { name: 'TryHackMe',   rank: 'Top 1%',   color: '#88cc14', href: 'https://tryhackme.com/p/jaishanth' },
  { name: 'Hack The Box', rank: 'Hacker',   color: '#9fef00', href: 'https://hackthebox.com' },
];

<<<<<<< HEAD
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

=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
export default function HomeClient({ cfg: previewCfg }: { cfg?: any }) {
  const { homeCfg = {} } = useGlobal() || {};
  const cfg = previewCfg || homeCfg || {};

  // Parse dynamic skills
  const parsedSkills = (cfg.skills || '').split(';').map((s: string) => {
    const [label, pct] = s.split(',');
<<<<<<< HEAD
    return { label: label?.trim() || 'Unknown', pct: parseInt(pct) || 0, color: '#a855f7' };
  });
  const skillsToUse = parsedSkills.length > 0 && parsedSkills[0].label !== 'Unknown' ? parsedSkills : SKILLS;

  // Parse dynamic platforms
=======
    return { label: label?.trim() || 'Unknown', pct: parseInt(pct) || 0, color: '#9d00ff' };
  });
  const skillsToUse = parsedSkills.length > 0 && parsedSkills[0].label !== 'Unknown' ? parsedSkills : SKILLS;

  // Parse dynamic platforms (Format: "TryHackMe,75%,#88cc14,url; HackerRank,Hacker,#00EA64,url")
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  const parsedPlatforms = (cfg.platforms || '').split(';').map((s: string) => {
    const [name, rank, color, href] = s.split(',');
    return { 
      name: name?.trim() || '', 
      rank: rank?.trim() || '', 
<<<<<<< HEAD
      color: color?.trim() || '#a855f7', 
=======
      color: color?.trim() || '#9d00ff', 
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
      href: href?.trim() || '#' 
    };
  }).filter((p: any) => p.name);
  const platformsToUse = parsedPlatforms.length > 0 ? parsedPlatforms : DEFAULT_PLATFORMS;

<<<<<<< HEAD
  const whoamiOutput = `${cfg.heading || 'Jaishanth M'} / ${cfg.subheading || 'Aspiring Red Teamer'}`;
  const { displayedText: typedWhoami, done: whoamiDone } = useTypingAnimation(whoamiOutput, 40);

=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
  return (
    <div className="relative min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex items-center pt-24 pb-16 px-6 overflow-hidden">
<<<<<<< HEAD
        {/* Glows — reduced intensity */}
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] -z-10 mix-blend-screen" />
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[100px] -z-10 mix-blend-screen" />
=======
        {/* Glows */}
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-neon-purple/15 rounded-full blur-[120px] -z-10 mix-blend-screen" />
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-neon-cyan/8 rounded-full blur-[100px] -z-10 mix-blend-screen" />
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT */}
          <div className="flex flex-col gap-6 relative z-10">
            <Reveal>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-neon-purple/30 bg-neon-purple/8 backdrop-blur-md w-fit">
                <span className="relative flex h-2 w-2">
<<<<<<< HEAD
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-xs font-mono font-medium tracking-wider text-emerald-400">
                  {cfg.availableForWork ? 'AVAILABLE FOR INTERNSHIPS' : 'CURRENTLY UNAVAILABLE'}
=======
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan" />
                </span>
                <span className="text-xs font-mono font-medium tracking-wider text-neon-cyan">
                  {cfg.availableForWork ? 'OPEN TO OPPORTUNITIES' : 'CURRENTLY UNAVAILABLE'}
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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
<<<<<<< HEAD
                <h2 className="text-xl md:text-2xl font-mono text-gray-300">Cybersecurity Student</h2>
                <span className="px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/25 text-neon-purple font-mono text-xs">
                  Aspiring Red Teamer
=======
                <h2 className="text-xl md:text-2xl font-mono text-gray-300">{smartPlaceholder(cfg.tagline)}</h2>
                <span className="px-3 py-1 rounded-full bg-neon-purple/10 border border-neon-purple/25 text-neon-purple font-mono text-xs">
                  Ethical Hacker
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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
<<<<<<< HEAD
                  View Security Work <span className="group-hover:translate-x-1 transition-transform">→</span>
=======
                  View Projects <span className="group-hover:translate-x-1 transition-transform">→</span>
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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
<<<<<<< HEAD
                    <div className={`text-4xl font-display font-bold text-white mb-1 ${s.color} drop-shadow-[0_0_6px_currentColor]`}>{s.val}</div>
=======
                    <div className={`text-4xl font-display font-bold text-white mb-1 ${s.color} drop-shadow-[0_0_8px_currentColor]`}>{s.val}</div>
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

<<<<<<< HEAD
          {/* RIGHT — Terminal with typing animation */}
          <Reveal delay={0.3} className="relative z-10">
            <div className="glass-panel p-1 w-full relative group animate-[float_6s_ease-in-out_infinite]">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
=======
          {/* RIGHT — Terminal */}
          <Reveal delay={0.3} className="relative z-10">
            <div className="glass-panel p-1 w-full relative group animate-[float_6s_ease-in-out_infinite]">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/8 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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
<<<<<<< HEAD
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
=======
                  <Line cmd="whoami" out={`${cfg.heading || 'Jaishanth M'} / ${cfg.subheading || 'Ethical Hacker'}`} />
                  <Line cmd="cat /etc/passions" out={null} />
                  <ul className="pl-4 border-l-2 border-neon-purple/20 space-y-1 text-gray-400">
                    {['Penetration Testing & Exploitation', 'Cryptography & Reverse Engineering', 'CTF Competitions & OSINT'].map(p => (
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
                      <li key={p}><span className="text-neon-purple">→</span> {p}</li>
                    ))}
                  </ul>
                  <Line cmd="echo $LOCATION" out={cfg.location} outColor="text-emerald-400" />
<<<<<<< HEAD
                  <Line cmd="nmap -sV --top-ports 100 target" out="Scanning for open ports..." outColor="text-neon-cyan" />
=======
                  <Line cmd="nmap -sV localhost" out="Scanning for open ports..." outColor="text-neon-cyan" />
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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

<<<<<<< HEAD
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
=======
      {/* ── SKILLS ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/6 text-neon-cyan font-mono text-xs mb-6">
            // 02. CAPABILITIES
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-12">
            Security <span className="neon-text">Arsenal</span>
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 items-start">
<<<<<<< HEAD
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
=======
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
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
              </Reveal>
            ))}
          </div>

<<<<<<< HEAD
          {/* Skills + Tools */}
          <div className="space-y-8">
            <Reveal delay={0.2}>
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Skill Domains</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skillsToUse.map((skill: any, i: number) => (
                  <div key={skill.label} className="p-4 rounded-xl bg-white/[0.03] border border-white/8 hover:border-[var(--hover-color)] hover:bg-white/[0.05] transition-all group flex items-center gap-3" style={{ '--hover-color': skill.color + 'aa' } as React.CSSProperties}>
                    <span className="w-2 h-2 rounded-full shadow-[0_0_6px_currentColor] shrink-0" style={{ backgroundColor: skill.color, color: skill.color }} />
                    <span className="font-display font-semibold text-sm text-gray-300 group-hover:text-white transition-all">{skill.label}</span>
                  </div>
                ))}
=======
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
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
              </div>
            </Reveal>

            <Reveal delay={0.3}>
<<<<<<< HEAD
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Tactical Tools</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TOOLS.map((t) => (
                  <div key={t.name} className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl bg-gradient-to-b from-white/5 to-white/[0.02] border border-white/10 hover:border-neon-cyan/30 hover:bg-neon-cyan/5 hover:-translate-y-1 transition-all duration-300 group">
                    <t.icon className="w-6 h-6 text-gray-500 group-hover:text-neon-cyan transition-colors" />
                    <span className="text-[10px] font-mono text-gray-400 group-hover:text-white transition-colors text-center tracking-wider">{t.name}</span>
                  </div>
                ))}
=======
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
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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
<<<<<<< HEAD
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon-purple/10 rounded-full blur-[80px] -z-10" />
=======
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon-purple/15 rounded-full blur-[80px] -z-10" />
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Let&apos;s Build Something <span className="neon-text">Secure</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Looking for a cybersecurity intern, red-team collaborator, or a developer who understands both offense and defense?
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact" className="neon-btn">Open a Secure Channel →</Link>
              <Link href="/projects" className="px-6 py-3 rounded-lg font-mono text-sm text-gray-400 border border-white/8 hover:bg-white/4 transition-all">
<<<<<<< HEAD
                View Security Work
=======
                View Work
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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
