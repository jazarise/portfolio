'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from '@/components/Reveal';
import GlassCard from '@/components/GlassCard';
import { smartPlaceholder } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactContent({ cfg, homeCfg, socialLinks = [] }: { cfg: any, homeCfg: any, socialLinks: any[] }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputBase = 'w-full bg-dark-main/50 border rounded-lg px-4 py-3 text-white focus:outline-none transition-all font-mono text-sm placeholder:text-gray-600';

  return (
    <div className="pt-24 min-h-screen">
      <section className="max-w-6xl mx-auto px-6 py-12">
        <Reveal>
          <div className="inline-block px-4 py-1 rounded-full border border-neon-purple/30 bg-neon-purple/10 text-neon-purple font-mono text-xs mb-6">
            // 05. CONNECT
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            {smartPlaceholder(cfg.title, 'Establish SECURE CHANNEL')}
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
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_10px_var(--color-neon-cyan)] animate-[float_3s_ease-in-out_infinite]" />

              {status === 'sent' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
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
                    </div>
                  </div>

                  <div>
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
                </form>
              )}
            </GlassCard>
          </Reveal>

          {/* ── Sidebar ── */}
          <Reveal delay={0.2} className="lg:col-span-2 space-y-5">
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

            {/* Social Links */}
            <GlassCard className="p-6">
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Connect</div>
              <div className="space-y-2">
                {socialLinks.length === 0 ? <p className="text-sm text-gray-500 font-mono">No links configured.</p> : socialLinks.map(s => (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/5
                      hover:border-neon-purple/30 hover:bg-neon-purple/5 text-gray-400 hover:text-white
                      transition-all group"
                  >
                    <span className="text-gray-500 group-hover:text-neon-purple transition-colors text-lg" style={{ fontFamily: 'sans-serif' }}>{s.icon || '🔗'}</span>
                    <span className="font-mono text-sm">{s.platform}</span>
                    <span className="ml-auto text-gray-600 group-hover:text-neon-cyan text-xs">↗</span>
                  </a>
                ))}
              </div>
            </GlassCard>

            {/* Quick info */}
            <GlassCard className="p-6">
              <div className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">// Quick Info</div>
              <div className="space-y-3 font-mono text-sm">
                {[
                  { label: 'Location', val: homeCfg.location || 'Unknown location', icon: '📍' },
                  { label: 'Response', val: '< 24 hours',        icon: '⚡' },
                  { label: 'Role',     val: homeCfg.role || 'Open for Hire',     icon: '✅' },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-gray-500">{r.icon} {r.label}</span>
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
