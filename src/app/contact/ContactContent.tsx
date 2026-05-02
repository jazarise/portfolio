'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';
import { smartPlaceholder } from '@/lib/utils';
import { FaLinkedin, FaGithub, FaInstagram, FaDiscord, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { SiTryhackme, SiHackthebox } from 'react-icons/si';
import { Briefcase, Shield, Bug, MapPin, Clock, CheckCircle, Lock, Activity, Wifi, Terminal } from 'lucide-react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const THREAT_EVENTS = [
  { sev: 'INFO',  color: 'text-neon-cyan',   label: 'SSH handshake from 192.168.1.42 — key exchange OK' },
  { sev: 'WARN',  color: 'text-yellow-400',  label: 'Port scan detected: 443,80,22,8080 — origin 45.33.32.156' },
  { sev: 'OK',    color: 'text-emerald-400', label: 'TLS 1.3 session established — cipher AES-256-GCM' },
  { sev: 'INFO',  color: 'text-neon-cyan',   label: 'DNS lookup: tryhackme.com → 104.26.10.81' },
  { sev: 'WARN',  color: 'text-yellow-400',  label: 'Brute-force attempt blocked — IP rate limited' },
  { sev: 'OK',    color: 'text-emerald-400', label: 'PGP signature verified — message integrity confirmed' },
  { sev: 'INFO',  color: 'text-neon-purple', label: 'Payload analysis: no malicious byte sequences found' },
  { sev: 'OK',    color: 'text-emerald-400', label: 'Firewall rule #42 applied — ICMP flood dropped' },
  { sev: 'WARN',  color: 'text-yellow-400',  label: 'CVE-2024-1234 probed — patched, attack neutralised' },
  { sev: 'INFO',  color: 'text-neon-cyan',   label: 'OSINT scan completed — 0 exposed credentials found' },
];

// Each log entry gets a stable unique ID so React never confuses items
type LogEntry = { id: number; sev: string; color: string; label: string };

function ThreatFeed() {
  const [log, setLog]   = useState<LogEntry[]>([]);
  const [clock, setClock] = useState('');        // empty on SSR — set only in effect
  const counterRef = useRef(0);
  const idxRef     = useRef(0);

  useEffect(() => {
    // Initial clock + seed 3 entries
    setClock(new Date().toTimeString().slice(0, 8));
    const seed = THREAT_EVENTS.slice(0, 3).map(ev => ({
      ...ev,
      id: counterRef.current++,
    }));
    setLog(seed);
    idxRef.current = 3;

    // Tick: add one new entry every 2.5 s, keep max 7 visible
    const ticker = setInterval(() => {
      const src = THREAT_EVENTS[idxRef.current % THREAT_EVENTS.length];
      idxRef.current++;
      const entry: LogEntry = { ...src, id: counterRef.current++ };
      setLog(prev => [...prev.slice(-6), entry]);
      setClock(new Date().toTimeString().slice(0, 8));
    }, 2500);

    return () => clearInterval(ticker);
  }, []);

  return (
    <div className="mt-4 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md p-5 font-mono text-xs overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-neon-cyan via-emerald-400 to-neon-cyan opacity-40" />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
        <span className="flex items-center gap-2 text-gray-400 tracking-widest uppercase">
          <Activity className="w-3.5 h-3.5 text-neon-cyan" /> LIVE THREAT MONITOR
        </span>
        {/* clock only renders after mount — no hydration mismatch */}
        {clock && (
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Wifi className="w-3 h-3" />
            <span className="tabular-nums">{clock}</span>
          </span>
        )}
      </div>

      {/* Feed — stable keys mean no item ever re-mounts = no jumping */}
      <div className="space-y-1.5 min-h-[158px]">
        <AnimatePresence initial={false}>
          {log.map(ev => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex items-start gap-2 overflow-hidden"
            >
              <span className={`shrink-0 font-bold ${ev.color} w-[42px]`}>[{ev.sev}]</span>
              <span className="text-gray-400 leading-relaxed">{ev.label}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Blinking cursor */}
      <div className="flex items-center gap-1.5 mt-3 border-t border-white/10 pt-2">
        <Terminal className="w-3 h-3 text-neon-purple" />
        <span className="text-gray-600">root@jaiz:~$</span>
        <span className="w-1.5 h-3.5 bg-neon-cyan animate-[blink-caret_1s_step-end_infinite] inline-block" />
      </div>
    </div>
  );
}



const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('linkedin')) return <FaLinkedin className="w-5 h-5" />;
  if (p.includes('github')) return <FaGithub className="w-5 h-5" />;
  if (p.includes('instagram')) return <FaInstagram className="w-5 h-5" />;
  if (p.includes('discord')) return <FaDiscord className="w-5 h-5" />;
  if (p.includes('tryhackme')) return <SiTryhackme className="w-5 h-5" />;
  if (p.includes('hackthebox') || p.includes('htb')) return <SiHackthebox className="w-5 h-5" />;
  if (p.includes('twitter') || p.includes('x')) return <FaTwitter className="w-5 h-5" />;
  if (p.includes('email') || p.includes('mail')) return <FaEnvelope className="w-5 h-5" />;
  return <FaGithub className="w-5 h-5" />;
};

const getSocialHoverColor = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('linkedin')) return 'hover:border-[#0077b5]/40 hover:text-[#0077b5]';
  if (p.includes('github')) return 'hover:border-white/30 hover:text-white';
  if (p.includes('instagram')) return 'hover:border-pink-500/40 hover:text-pink-500';
  if (p.includes('discord')) return 'hover:border-[#5865F2]/40 hover:text-[#5865F2]';
  if (p.includes('tryhackme')) return 'hover:border-[#88cc14]/40 hover:text-[#88cc14]';
  if (p.includes('hackthebox') || p.includes('htb')) return 'hover:border-[#9fef00]/40 hover:text-[#9fef00]';
  if (p.includes('twitter') || p.includes('x')) return 'hover:border-[#1DA1F2]/40 hover:text-[#1DA1F2]';
  if (p.includes('email') || p.includes('mail')) return 'hover:border-neon-cyan/40 hover:text-neon-cyan';
  return 'hover:border-neon-purple/40 hover:text-neon-purple';
};

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactContent({ cfg, homeCfg, socialLinks = [] }: { cfg: any, homeCfg: any, socialLinks: any[] }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const markTouched = (k: string) => () => setTouched(t => ({ ...t, [k]: true }));

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setStatus('sent');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTouched({});
      setErrors({});
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputBase = 'w-full bg-dark-main/50 border rounded-lg px-4 py-3 text-white focus:outline-none transition-all font-mono text-sm placeholder:text-gray-600';
  const getFieldClass = (field: string) => {
    const hasError = touched[field] && errors[field as keyof FormErrors];
    return hasError ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : 'border-dark-border focus:border-neon-purple focus:shadow-[0_0_0_3px_rgba(168,85,247,0.1)]';
  };

  return (
    <div className="pt-24 min-h-screen">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple font-mono text-xs mb-6">
            // 05. CONNECT
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {smartPlaceholder(cfg.title, 'Open a Secure Channel')}
          </h1>
          <p className="text-gray-400 mb-12 max-w-xl">
            {smartPlaceholder(cfg.subtitle, 'Open to internships, red-team collaborations, and vulnerability disclosures. Drop a message — I will respond within 24h.')}
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* ── Form ── */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <GlassCard className="p-8 md:p-10 relative overflow-hidden">
              {/* Animated scanline */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_8px_var(--color-neon-cyan)] animate-[float_3s_ease-in-out_infinite]" />

              {status === 'sent' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
                    <CheckCircle className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-400 mb-2">Message Delivered</h3>
                  <p className="text-gray-400 text-sm font-mono">Your message was transmitted successfully. I&apos;ll respond within 24 hours.</p>
                  <button onClick={() => setStatus('idle')} className="mt-8 px-6 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-mono">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-mono text-[10px] text-gray-500 tracking-[0.15em] mb-2 uppercase">Name <span className="text-red-400">*</span></label>
                      <input
                        type="text" value={form.name} onChange={set('name')} onBlur={markTouched('name')}
                        placeholder="Your name"
                        aria-label="Your name"
                        className={`${inputBase} ${getFieldClass('name')}`}
                      />
                      {touched.name && errors.name && <p className="text-red-400 text-xs font-mono mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-gray-500 tracking-[0.15em] mb-2 uppercase">Email <span className="text-red-400">*</span></label>
                      <input
                        type="email" value={form.email} onChange={set('email')} onBlur={markTouched('email')}
                        placeholder="you@example.com"
                        aria-label="Your email address"
                        className={`${inputBase} ${getFieldClass('email')}`}
                      />
                      {touched.email && errors.email && <p className="text-red-400 text-xs font-mono mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-gray-500 tracking-[0.15em] mb-2 uppercase">Subject <span className="text-red-400">*</span></label>
                    <input
                      type="text" value={form.subject} onChange={set('subject')} onBlur={markTouched('subject')}
                      placeholder="Internship / Collaboration / Bug Report..."
                      aria-label="Message subject"
                      className={`${inputBase} ${getFieldClass('subject')}`}
                    />
                    {touched.subject && errors.subject && <p className="text-red-400 text-xs font-mono mt-1">{errors.subject}</p>}
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-gray-500 tracking-[0.15em] mb-2 uppercase">Message <span className="text-red-400">*</span></label>
                    <textarea
                      rows={6} value={form.message} onChange={set('message')} onBlur={markTouched('message')}
                      placeholder="Describe your project, opportunity, or question..."
                      aria-label="Your message"
                      className={`${inputBase} ${getFieldClass('message')} resize-none`}
                    />
                    {touched.message && errors.message && <p className="text-red-400 text-xs font-mono mt-1">{errors.message}</p>}
                  </div>

                  <AnimatePresence>
                    {status === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-950/30 border border-red-500/20 text-red-400 text-xs font-mono"
                      >
                        <span>✕</span> {errorMsg || 'Transmission failed. Please try again.'}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative group">
                    <motion.button
                      type="submit"
                      disabled={status === 'sending'}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl font-mono font-bold tracking-widest text-sm text-white transition-all
                        bg-gradient-to-r from-neon-purple/20 to-neon-cyan/10 border border-neon-purple/40
                        hover:border-neon-purple/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]
                        disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Send message"
                    >
                      {status === 'sending' ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          TRANSMITTING...
                        </span>
                      ) : (
                        'TRANSMIT SIGNAL →'
                      )}
                    </motion.button>
                    <p className="text-center text-[10px] font-mono text-gray-600 mt-2">Your message will be delivered securely</p>
                  </div>
                </form>
              )}
            </GlassCard>

            {/* Encryption terminal */}
            <div className="mt-8 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md p-6 font-mono text-xs overflow-hidden relative group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple opacity-60 animate-[pulse-glow_3s_ease-in-out_infinite]" />
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                <span className="text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-neon-purple" /> SECURE CHANNEL ESTABLISHED
                </span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> 2048-BIT RSA
                </span>
              </div>
              <div className="space-y-1.5 text-gray-500 opacity-70 group-hover:opacity-100 transition-opacity duration-500 select-none">
                <p className="text-neon-cyan">-----BEGIN PGP PUBLIC KEY BLOCK-----</p>
                <p>mQINBGB2xW8BEADJkF7pQ...</p>
                <motion.div
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <p className="blur-[1px]">uR6Q8hXmD1aT3yU7pL9kF4jW2vN5cC8b</p>
                  <p className="blur-[2px]">eM7rA9xZ1qT4vH5pL3kN8jF2wC6bX9e</p>
                  <p className="blur-[3px]">kF4jW2vN5cC8bM7rA9xZ1qT4vH5pL3k</p>
                </motion.div>
                <p>...9D3vL</p>
                <p className="text-neon-cyan">-----END PGP PUBLIC KEY BLOCK-----</p>
              </div>
            </div>

            {/* Threat activity feed */}
            <ThreatFeed />
          </Reveal>


          {/* ── Sidebar ── */}
          <Reveal delay={0.2} className="lg:col-span-2 space-y-5">
            {/* Why Contact Me */}
            <GlassCard className="p-6">
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Why Contact Me</div>
              <div className="space-y-4">
                {[
                  {
                    icon: Briefcase,
                    title: 'Internships',
                    desc: 'Seeking cybersecurity internships with hands-on red team or SOC experience.',
                    color: 'text-neon-cyan',
                    bg: 'bg-neon-cyan/10',
                    border: 'border-neon-cyan/25',
                    glow: 'shadow-[0_0_12px_rgba(34,211,238,0.15)]',
                    dot: 'bg-neon-cyan',
                  },
                  {
                    icon: Shield,
                    title: 'Security Collaboration',
                    desc: 'Open to joint research, CTF teams, and vulnerability disclosure.',
                    color: 'text-neon-purple',
                    bg: 'bg-neon-purple/10',
                    border: 'border-neon-purple/25',
                    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.15)]',
                    dot: 'bg-neon-purple',
                  },
                  {
                    icon: Bug,
                    title: 'Bug Bounty Work',
                    desc: 'Interested in bug bounty programs and responsible disclosure.',
                    color: 'text-amber-400',
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/25',
                    glow: 'shadow-[0_0_12px_rgba(245,158,11,0.15)]',
                    dot: 'bg-amber-400',
                  },
                ].map(item => (
                  <div key={item.title} className={`flex items-start gap-3 p-3 rounded-xl border ${item.border} ${item.bg} ${item.glow} transition-all hover:scale-[1.01]`}>
                    <div className={`w-9 h-9 rounded-lg ${item.bg} border ${item.border} flex items-center justify-center shrink-0 mt-0.5`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold ${item.color} font-mono tracking-wide`}>{item.title}</div>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Availability */}
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="relative flex w-3 h-3">
                  <span className="animate-ping absolute w-full h-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex w-3 h-3 rounded-full bg-emerald-400" />
                </span>
                <span className="font-mono text-xs text-emerald-400 tracking-widest">{homeCfg.availableForWork ? 'AVAILABLE FOR OPPORTUNITIES' : 'TEMPORARILY UNAVAILABLE'}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Currently open to <span className="text-white">internships</span>, <span className="text-white">red-team projects</span>, and <span className="text-white">freelance security audits</span>.
              </p>
            </GlassCard>

            {/* Social Links — fully clickable cards with brand hover */}
            <GlassCard className="p-6">
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Connect</div>
              <div className="space-y-2">
                {socialLinks.length === 0 ? <p className="text-sm text-gray-500 font-mono">No links configured.</p> : socialLinks.map(s => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${s.platform}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5
                      hover:bg-white/8 text-gray-400 transition-all group ${getSocialHoverColor(s.platform)}`}
                  >
                    <span className="transition-colors">{getSocialIcon(s.platform)}</span>
                    <span className="font-mono text-sm flex-1">{s.platform}</span>
                    <span className="text-gray-600 group-hover:text-current text-xs transition-colors">↗</span>
                  </a>
                ))}
              </div>
            </GlassCard>

            {/* Quick info */}
            <GlassCard className="p-6">
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Quick Info</div>
              <div className="space-y-3 font-mono text-sm">
                {[
                  { label: 'Location', val: homeCfg.location || 'Chennai, India', icon: MapPin,      valColor: 'text-neon-cyan' },
                  { label: 'Response', val: '< 24 hours',                          icon: Clock,       valColor: 'text-emerald-400' },
                  { label: 'Role',     val: homeCfg.role || 'Open for Hire',       icon: CheckCircle, valColor: 'text-neon-purple' },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <span className="text-gray-500 flex items-center gap-2"><r.icon className="w-3.5 h-3.5" /> {r.label}</span>
                    <span className={`font-semibold ${r.valColor}`}>{r.val}</span>
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
