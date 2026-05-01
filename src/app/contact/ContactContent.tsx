'use client';

<<<<<<< HEAD
import { useState } from 'react';
=======
import { useState, useRef } from 'react';
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';
import { smartPlaceholder } from '@/lib/utils';
<<<<<<< HEAD
import { FaLinkedin, FaGithub, FaInstagram, FaDiscord, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { SiTryhackme, SiHackthebox } from 'react-icons/si';
import { Briefcase, Shield, Bug, MapPin, Clock, CheckCircle } from 'lucide-react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

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

=======

type Status = 'idle' | 'sending' | 'sent' | 'error';

>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
export default function ContactContent({ cfg, homeCfg, socialLinks = [] }: { cfg: any, homeCfg: any, socialLinks: any[] }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
<<<<<<< HEAD
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

<<<<<<< HEAD
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

=======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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
<<<<<<< HEAD
      setTouched({});
      setErrors({});
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputBase = 'w-full bg-dark-main/50 border rounded-lg px-4 py-3 text-white focus:outline-none transition-all font-mono text-sm placeholder:text-gray-600';
<<<<<<< HEAD
  const getFieldClass = (field: string) => {
    const hasError = touched[field] && errors[field as keyof FormErrors];
    return hasError ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : 'border-dark-border focus:border-neon-purple focus:shadow-[0_0_0_3px_rgba(168,85,247,0.1)]';
  };
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a

  return (
    <div className="pt-24 min-h-screen">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple font-mono text-xs mb-6">
            // 05. CONNECT
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
<<<<<<< HEAD
            {smartPlaceholder(cfg.title, 'Open a Secure Channel')}
=======
            {smartPlaceholder(cfg.title, 'Establish SECURE CHANNEL')}
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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
<<<<<<< HEAD
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_8px_var(--color-neon-cyan)] animate-[float_3s_ease-in-out_infinite]" />
=======
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_10px_var(--color-neon-cyan)] animate-[float_3s_ease-in-out_infinite]" />
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a

              {status === 'sent' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
<<<<<<< HEAD
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
=======
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 text-4xl shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-400 mb-2">Secure Channel Established</h3>
                  <p className="text-gray-400 text-sm font-mono">Message transmitted successfully. I&apos;ll be in touch soon.</p>
                  <button onClick={() => setStatus('idle')} className="mt-8 px-6 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-mono">
                    Send another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block font-mono text-[10px] text-gray-500 tracking-[0.15em] mb-2 uppercase">Name *</label>
                      <input
                        type="text" required value={form.name} onChange={set('name')}
                        placeholder="Your name"
                        className={`${inputBase} border-dark-border focus:border-neon-purple focus:shadow-[0_0_0_3px_rgba(157,0,255,0.1)]`}
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-[10px] text-gray-500 tracking-[0.15em] mb-2 uppercase">Email *</label>
                      <input
                        type="email" required value={form.email} onChange={set('email')}
                        placeholder="you@example.com"
                        className={`${inputBase} border-dark-border focus:border-neon-cyan focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)]`}
                      />
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
                    </div>
                  </div>

                  <div>
<<<<<<< HEAD
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
=======
                    <label className="block font-mono text-[10px] text-gray-500 tracking-[0.15em] mb-2 uppercase">Subject *</label>
                    <input
                      type="text" required value={form.subject} onChange={set('subject')}
                      placeholder="Internship / Collaboration / Bug Report..."
                      className={`${inputBase} border-dark-border focus:border-neon-pink focus:shadow-[0_0_0_3px_rgba(255,0,128,0.1)]`}
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] text-gray-500 tracking-[0.15em] mb-2 uppercase">Encrypted Message *</label>
                    <textarea
                      required rows={6} value={form.message} onChange={set('message')}
                      placeholder="Describe your project, opportunity, or question..."
                      className={`${inputBase} border-dark-border focus:border-neon-purple focus:shadow-[0_0_0_3px_rgba(157,0,255,0.1)] resize-none`}
                    />
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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

<<<<<<< HEAD
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
=======
                  <motion.button
                    type="submit"
                    disabled={status === 'sending'}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl font-mono font-bold tracking-widest text-sm text-white transition-all
                      bg-gradient-to-r from-neon-purple/20 to-neon-cyan/10 border border-neon-purple/40
                      hover:border-neon-purple/80 hover:shadow-[0_0_25px_rgba(157,0,255,0.25)]
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        ENCRYPTING & TRANSMITTING...
                      </span>
                    ) : (
                      'TRANSMIT SIGNAL →'
                    )}
                  </motion.button>
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
                </form>
              )}
            </GlassCard>
          </Reveal>

          {/* ── Sidebar ── */}
          <Reveal delay={0.2} className="lg:col-span-2 space-y-5">
<<<<<<< HEAD
            {/* Why Contact Me */}
            <GlassCard className="p-6">
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Why Contact Me</div>
              <div className="space-y-4">
                {[
                  { icon: Briefcase, title: 'Internships', desc: 'Seeking cybersecurity internships with hands-on red team or SOC experience.' },
                  { icon: Shield, title: 'Security Collaboration', desc: 'Open to joint research, CTF teams, and vulnerability disclosure.' },
                  { icon: Bug, title: 'Bug Bounty Work', desc: 'Interested in bug bounty programs and responsible disclosure.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-neon-purple" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{item.title}</div>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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

<<<<<<< HEAD
            {/* Social Links — fully clickable cards with brand hover */}
=======
            {/* Social Links */}
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
            <GlassCard className="p-6">
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Connect</div>
              <div className="space-y-2">
                {socialLinks.length === 0 ? <p className="text-sm text-gray-500 font-mono">No links configured.</p> : socialLinks.map(s => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
<<<<<<< HEAD
                    aria-label={`Visit ${s.platform}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5
                      hover:bg-white/8 text-gray-400 transition-all group ${getSocialHoverColor(s.platform)}`}
                  >
                    <span className="transition-colors">{getSocialIcon(s.platform)}</span>
                    <span className="font-mono text-sm flex-1">{s.platform}</span>
                    <span className="text-gray-600 group-hover:text-current text-xs transition-colors">↗</span>
=======
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5
                      hover:border-neon-purple/30 hover:bg-neon-purple/5 text-gray-400 hover:text-white
                      transition-all group"
                  >
                    <span className="text-gray-500 group-hover:text-neon-purple transition-colors text-lg" style={{ fontFamily: 'sans-serif' }}>{s.icon || '🔗'}</span>
                    <span className="font-mono text-sm">{s.platform}</span>
                    <span className="ml-auto text-gray-600 group-hover:text-neon-cyan text-xs">↗</span>
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
                  </a>
                ))}
              </div>
            </GlassCard>

            {/* Quick info */}
            <GlassCard className="p-6">
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Quick Info</div>
              <div className="space-y-3 font-mono text-sm">
                {[
<<<<<<< HEAD
                  { label: 'Location', val: homeCfg.location || 'Unknown location', icon: MapPin },
                  { label: 'Response', val: '< 24 hours',        icon: Clock },
                  { label: 'Role',     val: homeCfg.role || 'Open for Hire',     icon: CheckCircle },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-gray-500 flex items-center gap-2"><r.icon className="w-3.5 h-3.5" /> {r.label}</span>
=======
                  { label: 'Location', val: homeCfg.location || 'Unknown location', icon: '📍' },
                  { label: 'Response', val: '< 24 hours',        icon: '⚡' },
                  { label: 'Role',     val: homeCfg.role || 'Open for Hire',     icon: '✅' },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-gray-500">{r.icon} {r.label}</span>
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
                    <span className="text-gray-200">{r.val}</span>
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
