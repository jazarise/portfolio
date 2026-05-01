'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface EmptyStateProps {
  type: 'projects' | 'certs' | 'blog' | 'social' | 'messages' | string;
}

const QUOTES: Record<string, { icon: string; quotes: string[]; subtitle: string }> = {
  projects: {
    icon: '⬡',
    subtitle: 'Your project arsenal is empty',
    quotes: [
      '"No projects yet — but the attack surface is growing."',
      '"Every exploit starts with a single line of code."',
      '"The best security tools are the ones you build yourself."',
      '"Build it. Break it. Secure it. Repeat."',
    ],
  },
  certs: {
    icon: '◎',
    subtitle: 'No certifications on record',
    quotes: [
      '"Certifications prove you can walk the walk."',
      '"Every badge earned is a vulnerability understood."',
      '"Knowledge without proof is just a hypothesis."',
      '"Your next cert is one exam away from reality."',
    ],
  },
  blog: {
    icon: '◇',
    subtitle: 'No posts published yet',
    quotes: [
      '"Security is not a product, but a process." — Bruce Schneier',
      '"Document the exploit, share the knowledge, secure the future."',
      '"The pen is mightier than the payload."',
      '"Write the writeup the next hacker wishes existed."',
    ],
  },
  social: {
    icon: '◉',
    subtitle: 'No social links configured',
    quotes: [
      '"Hack the system, but secure the future."',
      '"Your network is your net worth — even in cybersecurity."',
      '"Connect, collaborate, compromise (ethically)."',
      '"A hacker without a network is just a lonely terminal."',
    ],
  },
  messages: {
    icon: '✉',
    subtitle: 'Inbox zero achieved',
    quotes: [
      '"No signals intercepted. All channels clear."',
      '"The quietest inbox is the most suspicious one."',
      '"Silence on the wire... for now."',
      '"Zero messages. Zero vulnerabilities. Zero downtime."',
    ],
  },
};

const DEFAULT = {
  icon: '◈',
  subtitle: 'Nothing here yet',
  quotes: [
    '"Security is not a product, but a process."',
    '"The only truly secure system is one that is powered off."',
    '"Hack the system, but secure the future."',
  ],
};

export default function EmptyState({ type }: EmptyStateProps) {
  const config = QUOTES[type] || DEFAULT;

  // Pick a random quote, memoized per mount
  const quote = useMemo(() => {
    return config.quotes[Math.floor(Math.random() * config.quotes.length)];
  }, [config.quotes]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center py-20 px-6"
    >
      {/* Glowing Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 rounded-full blur-2xl opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(157,0,255,0.4) 0%, transparent 70%)' }} />
        <div className="relative text-6xl opacity-25 select-none"
          style={{ filter: 'drop-shadow(0 0 12px rgba(157,0,255,0.3))' }}>
          {config.icon}
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="font-mono text-sm text-gray-500 mb-4 tracking-wide"
      >
        {config.subtitle}
      </motion.p>

      {/* Quote */}
      <motion.blockquote
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="max-w-md text-center"
      >
        <p className="text-gray-600 text-sm italic leading-relaxed font-mono"
          style={{ textShadow: '0 0 20px rgba(157,0,255,0.1)' }}>
          {quote}
        </p>
      </motion.blockquote>

      {/* Decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-8 w-24 h-px origin-center"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(157,0,255,0.3), transparent)' }}
      />

      {/* Scan line effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-4 text-[10px] font-mono tracking-[0.25em] text-gray-700 uppercase"
      >
        ▹ awaiting data ◃
      </motion.div>
    </motion.div>
  );
}
