'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGlobal } from '@/lib/GlobalState';
import RadialOrbitalTimeline from './ui/radial-orbital-timeline';
import { Shield, Terminal, Lock, Code, Database, Bug, GraduationCap, Certificate } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { profileCfg = {}, navbarCfg = {} } = useGlobal() || {};

  // Fallback data if none exists in DB
  const defaultTimelineData = [
    {
      id: 1,
      title: "Penetration Tester",
      date: "Present",
      content: "Conducting vulnerability assessments and penetration testing on web applications and network infrastructure.",
      category: "Role",
      iconName: "Shield",
      relatedIds: [2],
      status: "in-progress" as const,
      energy: 90,
    },
    {
      id: 2,
      title: "Ethical Hacker",
      date: "2023",
      content: "Participating in Bug Bounties and CTF competitions. Exploiting vulnerabilities in secure environments.",
      academy: "TryHackMe / HackTheBox",
      link: "https://tryhackme.com/p/jaishanth",
      category: "Role",
      iconName: "Terminal",
      relatedIds: [1, 3],
      status: "completed" as const,
      energy: 85,
    },
    {
      id: 3,
      title: "Security Researcher",
      date: "2024",
      content: "Analyzing malware behavior, writing custom exploit scripts in Python, and studying advanced persistent threats.",
      category: "Role",
      iconName: "Bug",
      relatedIds: [2],
      status: "pending" as const,
      energy: 60,
    }
  ];

  const timelineData = profileCfg.timelineNodes && profileCfg.timelineNodes.length > 0
    ? profileCfg.timelineNodes
    : defaultTimelineData;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center overflow-hidden"
          onClick={onClose}
        >
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-8 z-[110] w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/40 hover:scale-110 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            ✕
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300, delay: 0.1 }}
            onClick={e => e.stopPropagation()}
            className="w-full h-full flex items-center justify-center"
          >
            <RadialOrbitalTimeline 
              timelineData={timelineData} 
              profileImage={profileCfg.profileImage || navbarCfg.brandImage} 
              rotationSpeed={profileCfg.rotationSpeed || 5}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
