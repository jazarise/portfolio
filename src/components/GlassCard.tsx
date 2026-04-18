'use client';

import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // Optional glow override, defaults to neon-purple
  hover?: boolean;
  delay?: number;
}

export default function GlassCard({ children, className = '', glowColor, hover = true, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? {
        y: -5,
        boxShadow: `0 15px 35px ${glowColor ? glowColor : 'rgba(157, 0, 255, 0.2)'}`,
        borderColor: glowColor ? glowColor.replace('0.2)', '0.5)') : 'rgba(157, 0, 255, 0.5)',
      } : {}}
      className={`glass-panel transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}
