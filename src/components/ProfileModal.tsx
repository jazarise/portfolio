'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useGlobal } from '@/lib/GlobalState';
import { FaLinkedin, FaGithub, FaInstagram, FaDiscord, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { SiTryhackme, SiHackthebox } from 'react-icons/si';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getSocialIcon = (platform: string) => {
  const p = platform.toLowerCase();
  
  if (p.includes('linkedin')) return <FaLinkedin className="w-full h-full group-hover:text-[#0077b5] transition-colors" />;
  if (p.includes('github')) return <FaGithub className="w-full h-full group-hover:text-white transition-colors" />;
  if (p.includes('instagram')) return <FaInstagram className="w-full h-full group-hover:text-pink-500 transition-colors" />;
  if (p.includes('discord')) return <FaDiscord className="w-full h-full group-hover:text-[#5865F2] transition-colors" />;
  if (p.includes('tryhackme')) return <SiTryhackme className="w-full h-full group-hover:text-[#88cc14] transition-colors" />;
  if (p.includes('hackthebox') || p.includes('htb')) return <SiHackthebox className="w-full h-full group-hover:text-[#9fef00] transition-colors" />;
  if (p.includes('twitter') || p.includes('x')) return <FaTwitter className="w-full h-full group-hover:text-[#1DA1F2] transition-colors" />;
  if (p.includes('email') || p.includes('mail')) return <FaEnvelope className="w-full h-full group-hover:text-neon-cyan transition-colors" />;
  
  return <span className="w-full h-full text-center tracking-tighter" style={{ fontFamily: 'sans-serif' }}>🔗</span>;
};

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { socialLinks = [], navbarCfg = {}, homeCfg = {} } = useGlobal() || {};

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="bg-dark-panel border border-neon-purple/50 rounded-2xl w-full max-w-sm p-6 relative overflow-hidden shadow-[0_0_50px_rgba(157,0,255,0.2)]"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 blur-[50px] -z-10 rounded-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-cyan/20 blur-[50px] -z-10 rounded-full" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center mb-6 pt-4">
              <div className="relative mb-4 group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan opacity-70 group-hover:opacity-100 blur transition-opacity duration-300"></div>
                <Image 
                  src={navbarCfg.brandImage || "/profile.jpg"} 
                  alt="Jaishanth" 
                  width={96} 
                  height={96} 
                  className="rounded-full relative object-cover border-2 border-dark-main h-24 w-24 shadow-[0_0_15px_rgba(157,0,255,0.5)]"
                />
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-1">{homeCfg.heading || 'Jaishanth M'}</h2>
              <p className="font-mono text-neon-cyan text-xs tracking-widest mb-3 uppercase">{homeCfg.tagline || 'CYBERSECURITY ENTHUSIAST'}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <FaEnvelope className="w-3 h-3" /> Status: <span className={homeCfg.availableForWork ? 'text-emerald-400' : 'text-red-400'}>{homeCfg.availableForWork ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((link: any) => (
                <a
                  key={link.name || link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all group"
                >
                  <div className="text-gray-400 w-5 h-5 flex items-center justify-center">
                    {getSocialIcon(link.platform)}
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white">{link.platform}</span>
                </a>
              ))}
              {socialLinks.length === 0 && (
                <div className="col-span-2 text-center text-xs font-mono text-gray-500 py-4">No social links added yet.</div>
              )}
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
