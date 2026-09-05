'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import Reveal from '@/components/Reveal';
import Link from 'next/link';
import { smartPlaceholder } from '@/lib/utils';
import { useGlobal } from '@/lib/GlobalState';
import { Shield, Terminal, Lock, Users, Lightbulb, Quote } from 'lucide-react';
import {
  SiWireshark, SiBurpsuite, SiMetasploit, SiGnubash,
  SiMysql
} from 'react-icons/si';
import { FaNetworkWired } from 'react-icons/fa';

export interface GithubStats {
  username: string;
  repos: number;
  followers: number;
  lastActiveLabel: string;
  active: boolean;
  dailyActivity: number[];
}

const SKILLS = [
  { label: 'Penetration Testing',   pct: 85, color: '#a855f7' },
  { label: 'Network Security',      pct: 80, color: '#22d3ee' },
  { label: 'VAPT & Threat Analysis',pct: 78, color: '#ec4899' },
  { label: 'Python / Scripting',    pct: 90, color: '#22c55e' },
  { label: 'Web App Security',      pct: 82, color: '#a855f7' },
  { label: 'Malware Analysis',      pct: 65, color: '#f97316' },
];

const TOOLS = [
  { name: 'Nmap',       icon: FaNetworkWired, color: '#0E83CD' },
  { name: 'Burp Suite', icon: SiBurpsuite, color: '#FF6633' },
  { name: 'Wireshark',  icon: SiWireshark, color: '#1679A7' },
  { name: 'Metasploit', icon: SiMetasploit,color: '#2596CD' },
  { name: 'Nessus',     icon: Shield,      color: '#00B6DE' },
  { name: 'John',       icon: Lock,        color: '#BA2133' },
  { name: 'Hydra',      icon: SiGnubash,   color: '#EA4335' },
  { name: 'SQLmap',     icon: SiMysql,     color: '#CC2927' },
];

const DEFAULT_PLATFORMS = [
  { name: 'Bugcrowd',   rank: 'Researcher', color: '#f37023', href: 'https://bugcrowd.com/jaishanth' },
  { name: 'TryHackMe',  rank: 'Top 1%',      color: '#88cc14', href: 'https://tryhackme.com/p/jaishanth' },
  { name: 'HackerRank', rank: 'Hacker',      color: '#00ea64', href: 'https://hackerrank.com' },
];

const DEFAULT_TESTIMONIALS = [
  { quote: 'One of the few students who treats security as a discipline, not a checklist — his VAPT writeups are methodical enough to hand to a client as-is.', name: 'Faculty Advisor', role: 'Dept. of Cybersecurity' },
  { quote: 'Sharp under pressure in CTFs. He finds the overlooked attack path while everyone else is stuck on the obvious one.', name: 'Teammate', role: 'CTF & Security Research Team' },
  { quote: 'Built tooling for us that saved real recon time — clean code, clear docs, shipped on schedule.', name: 'Project Collaborator', role: 'FlowZint' },
];

const WHAT_I_DO = [
  { icon: Shield,   title: 'Offensive Security',  desc: 'Penetration testing, vulnerability assessment, and exploit development across network and web application domains.' },
  { icon: Terminal, title: 'Security Research',   desc: 'CTF competitions, TryHackMe/HTB lab environments, and real-world vulnerability analysis with documented writeups.' },
  { icon: Lock,     title: 'Secure Development',  desc: 'Building applications with security-first architecture — input validation, auth hardening, and threat modeling.' },
];

function useTypingAnimation(text: string, speed = 40) {
  const [displayedText, setDisplayedText] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayedText(''); setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) { setDisplayedText(text.slice(0, i + 1)); i++; }
      else { setDone(true); clearInterval(interval); }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return { displayedText, done };
}

export default function HomeClient({ cfg: previewCfg, projectCount = 0, certCount = 0, githubStats = null }: { cfg?: any; projectCount?: number; certCount?: number; githubStats?: GithubStats | null }) {
  const { homeCfg = {} } = useGlobal() || {};
  const cfg = previewCfg || homeCfg || {};

  const skillsToUse = useMemo(() => {
    const raw = (cfg.skills || '').trim();
    if (!raw) return SKILLS;
    const parsed = raw.split(';').map((s: string) => {
      const [label, pct] = s.split(',');
      return { label: label?.trim() || '', pct: parseInt(pct) || 0, color: '#a855f7' };
    }).filter((s: any) => s.label);
    return parsed.length > 0 ? parsed : SKILLS;
  }, [cfg.skills]);

  const platformsToUse = useMemo(() => {
    const parsed = (cfg.platforms || '').split(';').map((s: string) => {
      const [name, rank, color, href] = s.split(',');
      return { name: name?.trim() || '', rank: rank?.trim() || '', color: color?.trim() || '#a855f7', href: href?.trim() || '#' };
    }).filter((p: any) => p.name);
    return parsed.length > 0 ? parsed : DEFAULT_PLATFORMS;
  }, [cfg.platforms]);

  const testimonialsToUse = useMemo(() => {
    const raw = (cfg.testimonials || '').trim();
    if (!raw) return DEFAULT_TESTIMONIALS;
    const parsed = raw.split(';').map((s: string) => {
      const [quote, name, role] = s.split(',');
      return { quote: quote?.trim() || '', name: name?.trim() || '', role: role?.trim() || '' };
    }).filter((t: any) => t.quote && t.name);
    return parsed.length > 0 ? parsed : DEFAULT_TESTIMONIALS;
  }, [cfg.testimonials]);

  const fullName = smartPlaceholder(cfg.heading, 'Jaishanth');
  const whoamiOutput = `${fullName} / ${cfg.subheading || 'Offensive Security Student'}`;
  const { displayedText: typedWhoami, done: whoamiDone } = useTypingAnimation(whoamiOutput, 40);

  return (
    <div className="relative min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-[100svh] flex items-center pt-20 pb-12 px-4 md:px-6 overflow-hidden">
        <div className="absolute top-1/3 -right-32 w-[280px] md:w-[500px] h-[280px] md:h-[500px] bg-neon-purple/12 rounded-full blur-[100px] -z-10 mix-blend-screen" />
        <div className="hidden md:block absolute bottom-1/4 -left-32 w-80 h-80 bg-neon-cyan/6 rounded-full blur-[90px] -z-10 mix-blend-screen" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          {/* LEFT */}
          <div className="flex flex-col gap-5 relative z-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/8 backdrop-blur-md w-fit animate-fade-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-xs font-mono font-medium tracking-wider text-emerald-300">
                {cfg.availableForWork ? 'AVAILABLE FOR INTERNSHIPS' : 'CURRENTLY UNAVAILABLE'}
              </span>
            </div>

            {/* Full name — instant LCP render without JS animation delay */}
            <h1 className="font-bold font-display leading-[1.0] tracking-tighter whitespace-normal sm:whitespace-nowrap break-words animate-fade-up" style={{ fontSize: 'clamp(1.8rem, 8.5vw, 5.5rem)' }}>
              {fullName.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="neon-text neon-text-glow">{fullName.split(' ').slice(-1)[0]}.</span>
            </h1>

            <div className="flex items-center gap-3 flex-wrap animate-fade-up">
              <h2 className="text-base md:text-xl font-mono text-gray-300">Offensive Security Student</h2>
              <span className="px-3 py-1 rounded-full bg-neon-purple/12 border border-neon-purple/25 text-neon-purple font-mono text-xs">
                Building toward Red Team
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 animate-fade-up">
              {['VAPT', 'Pen Testing', 'Recon', 'Exploitation', 'Net Sec'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-md bg-white/[0.05] border border-white/10 text-gray-400 font-mono text-[10px] tracking-wider">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-sm md:text-base text-gray-300 max-w-xl leading-relaxed animate-fade-up">
              {smartPlaceholder(
                cfg.bio,
                'I find the gaps attackers exploit before they do. Hands-on in pentesting labs, CTFs, and network security, turning it into documented, real-world findings — not just certificates.'
              )}
            </p>

            <Reveal delay={0.4}>
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 mt-1">
                <Link href="/projects" className="neon-btn group text-sm w-full sm:w-auto text-center justify-center">
                  View Security Work <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Link>
                <Link href="/contact" className="px-5 py-2.5 rounded-lg font-medium text-white bg-white/5 border border-white/10 hover:bg-white/8 transition-all flex items-center justify-center gap-2 text-sm w-full sm:w-auto text-center">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
                  Contact
                </Link>
                <a href={cfg.resumeUrl || '/resume.pdf'} target="_blank" rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-lg font-mono text-xs text-gray-400 border border-white/8 hover:bg-white/5 hover:text-gray-200 transition-all text-center w-full sm:w-auto">
                  Download CV ↓
                </a>
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={0.5}>
              <div className="flex flex-wrap gap-6 md:gap-10 mt-6 pt-6 border-t border-white/8 relative">
                <div className="absolute top-0 left-0 w-20 h-px bg-gradient-to-r from-neon-purple to-transparent" />
                {[
                  { val: projectCount > 0 ? `${projectCount}+` : (cfg.statProjects || '15+'), label: 'Projects', color: 'text-neon-purple' },
                  { val: certCount > 0 ? `${certCount}` : (cfg.statCerts || '6'), label: 'Certifications', color: 'text-neon-cyan' },
                  ...(platformsToUse.length > 0 ? [{ val: platformsToUse[0].rank, label: platformsToUse[0].name, color: 'text-neon-pink', hiddenMobile: true }] : [])
                ].map(s => (
                  <div key={s.label} className={(s as any).hiddenMobile ? 'hidden sm:block' : ''}>
                    <div className={`text-2xl md:text-4xl font-display font-bold mb-1 ${s.color} drop-shadow-[0_0_8px_currentColor]`}>{s.val}</div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT — Terminal (desktop only) */}
          <Reveal delay={0.3} className="relative z-10 hidden lg:block">
            <div className="glass-panel p-1 w-full relative group animate-[float_6s_ease-in-out_infinite]">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700 rounded-xl" />
              <div className="bg-[#040408]/95 rounded-xl overflow-hidden border border-white/4 relative z-10">
                <div className="bg-[#0a0a12] border-b border-white/5 px-4 py-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="text-xs font-mono text-gray-600">root@{cfg.brandHandle || 'jaishanthm'}:~#</div>
                  <div className="w-16" />
                </div>
                <div className="p-6 font-mono text-sm space-y-3.5 text-gray-300 leading-relaxed">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-neon-pink">❯</span>
                      <span className="text-neon-cyan">whoami</span>
                    </div>
                    <div className="pl-5 text-gray-200">
                      {typedWhoami}
                      {!whoamiDone && <span className="inline-block w-2 h-4 bg-neon-cyan ml-0.5 animate-pulse" />}
                    </div>
                  </div>
                  <Line cmd="cat /etc/focus" out={null} />
                  <ul className="pl-4 border-l-2 border-neon-purple/25 space-y-1 text-gray-400">
                    {['Penetration Testing & Red Teaming', 'Network Security & VAPT', 'CTF Competitions & OSINT'].map(p => (
                      <li key={p}><span className="text-neon-purple">→</span> {p}</li>
                    ))}
                  </ul>
                  <Line cmd="echo $LOCATION" out={cfg.location || 'MCET, Pollachi, Tamil Nadu, India'} outColor="text-emerald-300" />
                  <Line cmd="nmap -sV --top-ports 100 target" out="Scanning for open ports..." outColor="text-neon-cyan" />
                  <div className="flex gap-2">
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

      {/* ── WHAT I DO ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-cyan/35 bg-neon-cyan/8 text-neon-cyan font-mono text-xs mb-5">
            // 01. WHAT I DO
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-10">
            Security <span className="neon-text">Mindset</span>, Applied
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {WHAT_I_DO.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.1}>
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-neon-purple/40 hover:bg-white/[0.06] transition-all duration-300 group h-full">
                <div className="w-11 h-11 rounded-xl bg-neon-purple/12 border border-neon-purple/25 flex items-center justify-center mb-5 group-hover:bg-neon-purple/20 transition-colors">
                  <item.icon className="w-5 h-5 text-neon-purple" />
                </div>
                <h3 className="font-display font-bold text-base text-white mb-2.5">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-16">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-pink/35 bg-neon-pink/8 text-neon-pink font-mono text-xs mb-5">
            // What people say
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-10">
            Trusted by <span className="neon-text">Mentors & Collaborators</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonialsToUse.map((t: any, i: number) => (
            <Reveal key={t.name + i} delay={i * 0.1}>
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-neon-pink/30 hover:bg-white/[0.06] transition-all duration-300 h-full flex flex-col">
                <Quote className="w-6 h-6 text-neon-pink/50 mb-4 shrink-0" />
                <p className="text-sm text-gray-300 leading-relaxed mb-6 grow">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  {t.role && <div className="text-xs font-mono text-gray-500 tracking-wide">{t.role}</div>}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-16">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-emerald-500/35 bg-emerald-500/8 text-emerald-300 font-mono text-xs mb-5">
            // 02. PROOF OF WORK
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-10">
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
                  className="flex items-center justify-between px-5 py-4 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/10 hover:border-white/25 hover:from-white/8 transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--plat-color)] opacity-0 group-hover:opacity-10 transition-opacity" style={{ '--plat-color': p.color } as React.CSSProperties} />
                  <span className="font-display font-bold tracking-wide text-gray-200 group-hover:text-white transition-colors z-10 text-sm md:text-base">{p.name}</span>
                  <div className="flex items-center gap-2 z-10 bg-dark-main/60 px-3 py-1.5 rounded-lg border border-white/8">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color, boxShadow: `0 0 6px ${p.color}` }} />
                    <span className="font-mono text-xs font-semibold uppercase tracking-widest text-gray-200 group-hover:text-white transition-colors">{p.rank}</span>
                  </div>
                </a>
              </Reveal>
            ))}

            {/* System Status — desktop only */}
            <Reveal delay={0.3}>
              <div className="hidden md:block mt-6 relative rounded-xl border border-neon-cyan/20 bg-[#040408]/70 backdrop-blur-sm overflow-hidden p-5 group">
                <div className="absolute top-0 right-0 w-28 h-28 bg-neon-cyan/8 blur-3xl -z-10 group-hover:bg-neon-cyan/15 transition-all duration-700" />
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${githubStats ? (githubStats.active ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-gray-500') : 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]'}`} />
                    <span className="text-xs font-mono text-emerald-300 tracking-widest uppercase">
                      {githubStats ? 'GitHub Activity' : 'System Active'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500">
                    {githubStats ? `@${githubStats.username}` : '127.0.0.1'}
                  </span>
                </div>
                <div className="space-y-3.5">
                  {(githubStats ? [
                    { label: 'PUBLIC REPOS',  val: String(githubStats.repos),          color: 'text-cyan-300' },
                    { label: 'FOLLOWERS',     val: String(githubStats.followers),      color: 'text-purple-300' },
                    { label: 'LAST COMMIT',   val: githubStats.lastActiveLabel.toUpperCase(), color: 'text-emerald-300' },
                    { label: 'STATUS',        val: githubStats.active ? 'ACTIVE' : 'IDLE', color: githubStats.active ? 'text-emerald-300' : 'text-gray-500' },
                  ] : [
                    { label: 'THREAT INTEL',    val: 'SYNCED',   color: 'text-cyan-300' },
                    { label: 'PACKET CAPTURE',  val: 'SNIFFING', color: 'text-purple-300' },
                    { label: 'FIREWALL',        val: 'ENFORCED', color: 'text-emerald-300' },
                    { label: 'DECRYPTION',      val: 'OFFLINE',  color: 'text-gray-500' }
                  ]).map((stat, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-white/6 pb-2.5">
                      <span className="text-xs font-mono text-gray-400">{stat.label}</span>
                      <span className={`text-[10px] font-mono tracking-widest font-semibold ${stat.color}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 h-10 w-full flex items-end gap-0.5">
                  {githubStats ? (
                    githubStats.dailyActivity.map((count, i) => {
                      const max = Math.max(...githubStats.dailyActivity, 1);
                      const pct = Math.max(8, Math.round((count / max) * 100));
                      return (
                        <div key={i} title={`${count} event${count === 1 ? '' : 's'}`}
                          className="flex-1 bg-neon-cyan/40 rounded-t-sm transition-all" style={{ height: `${pct}%` }} />
                      );
                    })
                  ) : (
                    Array.from({ length: 28 }).map((_, i) => {
                      const duration = 1.5 + (((i * 7 + 3) % 10) / 10);
                      return (
                        <motion.div
                          key={i}
                          className="flex-1 bg-neon-cyan/40 rounded-t-sm"
                          animate={{ height: ['15%', '85%', '35%', '100%', '25%'] }}
                          transition={{ duration, repeat: Infinity, repeatType: 'mirror', delay: i * 0.04 }}
                        />
                      );
                    })
                  )}
                </div>
                {githubStats && (
                  <div className="mt-2 text-[9px] font-mono text-gray-600 tracking-wide">last 14 days · public activity</div>
                )}
              </div>
            </Reveal>
          </div>

          {/* Skills + Tools */}
          <div className="space-y-8">
            <Reveal delay={0.2}>
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Skill Domains</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {skillsToUse.map((skill: any) => (
                  <div key={skill.label}
                    className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 hover:border-[var(--hover-color)] hover:bg-white/[0.06] transition-all group flex items-center gap-3"
                    style={{ '--hover-color': skill.color + 'aa' } as React.CSSProperties}>
                    <span className="w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor]" style={{ backgroundColor: skill.color, color: skill.color }} />
                    <span className="font-mono text-xs text-gray-300 group-hover:text-white transition-all">{skill.label}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Tactical Tools</div>
              <div className="grid grid-cols-2 gap-2.5">
                {TOOLS.map((t) => (
                  <div key={t.name}
                    className="flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-[var(--tool-color)] hover:bg-white/[0.04] hover:-translate-y-0.5 transition-all duration-300 group"
                    style={{ '--tool-color': t.color + '60' } as React.CSSProperties}>
                    <t.icon aria-label={`${t.name} security tool icon`} title={t.name} className="w-6 h-6 text-gray-500 group-hover:text-[var(--tool-icon-color)] transition-colors duration-300" style={{ '--tool-icon-color': t.color } as React.CSSProperties} />
                    <span className="text-[10px] font-mono text-gray-400 group-hover:text-white transition-colors text-center tracking-wider">{t.name}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── WANT TO COLLABORATE ──────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {/* Want to Collaborate */}
            <div className="relative overflow-hidden rounded-2xl border border-neon-purple/25 bg-gradient-to-br from-neon-purple/8 via-transparent to-neon-violet/5 p-7 md:p-8 group hover:border-neon-purple/45 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/50 to-transparent" />
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-neon-purple/10 rounded-full blur-[60px] -z-10" />
              <div className="w-12 h-12 rounded-2xl bg-neon-purple/12 border border-neon-purple/25 flex items-center justify-center mb-5">
                <Users className="w-6 h-6 text-neon-purple" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3">Want to collaborate?</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                I&apos;m happy to chat about internships, CTFs, or security research. Let&apos;s build something secure together.
              </p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm font-medium text-white bg-neon-purple/15 border border-neon-purple/35 hover:bg-neon-purple/25 hover:border-neon-purple/60 transition-all">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
                Reach out →
              </Link>
            </div>

            {/* Have an Idea to Break */}
            <div className="relative overflow-hidden rounded-2xl border border-neon-cyan/25 bg-gradient-to-br from-neon-cyan/6 via-transparent to-emerald-500/4 p-7 md:p-8 group hover:border-neon-cyan/45 transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
              <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-neon-cyan/8 rounded-full blur-[60px] -z-10" />
              <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/25 flex items-center justify-center mb-5">
                <Lightbulb className="w-6 h-6 text-neon-cyan" />
              </div>
              <h3 className="font-display font-bold text-xl text-white mb-3">Have an idea to break?</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                I&apos;m always up for collaborating on red-team tooling, vulnerability research, or CTF challenges.
              </p>
              <Link href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-sm font-medium text-white bg-neon-cyan/10 border border-neon-cyan/30 hover:bg-neon-cyan/18 hover:border-neon-cyan/55 transition-all">
                <Terminal className="w-4 h-4" />
                Let&apos;s talk →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-20 md:pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-neon-purple/20 bg-gradient-to-br from-neon-purple/8 via-transparent to-neon-cyan/5 p-7 md:p-14 text-center">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-purple/60 to-transparent" />
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-neon-purple/10 rounded-full blur-[80px] -z-10" />
            <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-4">
              Let&apos;s Build Something <span className="neon-text">Secure</span>
            </h2>
            <p className="text-gray-300 max-w-lg mx-auto mb-8 text-sm md:text-base">
              Looking for a cybersecurity intern, red-team collaborator, or a developer who understands both offense and defense?
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link href="/contact" className="neon-btn">Open a Secure Channel →</Link>
              <Link href="/projects" className="px-6 py-3 rounded-lg font-mono text-sm text-gray-300 border border-white/10 hover:bg-white/5 transition-all">
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
