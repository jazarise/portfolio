'use client';

import Link from 'next/link';
import { useGlobal } from '@/lib/GlobalState';
import { FaLinkedin, FaGithub, FaInstagram, FaDiscord, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { SiTryhackme, SiHackthebox } from 'react-icons/si';

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

const getHoverColor = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('linkedin')) return 'hover:text-[#0077b5] hover:border-[#0077b5]/30';
  if (p.includes('github')) return 'hover:text-white hover:border-white/30';
  if (p.includes('instagram')) return 'hover:text-pink-500 hover:border-pink-500/30';
  if (p.includes('discord')) return 'hover:text-[#5865F2] hover:border-[#5865F2]/30';
  if (p.includes('tryhackme')) return 'hover:text-[#88cc14] hover:border-[#88cc14]/30';
  if (p.includes('hackthebox') || p.includes('htb')) return 'hover:text-[#9fef00] hover:border-[#9fef00]/30';
  if (p.includes('twitter') || p.includes('x')) return 'hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30';
  if (p.includes('email') || p.includes('mail')) return 'hover:text-neon-cyan hover:border-neon-cyan/30';
  return 'hover:text-neon-purple hover:border-neon-purple/30';
};

export default function Footer({ previewCfg, previewSocials }: { previewCfg?: any, previewSocials?: any[] }) {
  const { navbarCfg, footerCfg: globalCfg, socialLinks: globalSocials } = useGlobal() || { navbarCfg: {}, footerCfg: {}, socialLinks: [] };
  const cfg = previewCfg || globalCfg;
  const socialLinks = previewSocials || globalSocials;
  
  return (
    <footer className="border-t border-dark-border bg-dark-main relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/3 blur-[100px] -z-10 rounded-full" />
      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="font-display font-bold text-xl tracking-tighter text-white group">
              {(() => {
                // FORCE FOOTER TO USE NAVBAR CONFIG FOR PERFECT SYNC
                const name = navbarCfg?.brandName || "jaiz_sec";
                if (name.includes("_")) {
                  const [first, ...rest] = name.split("_");
                  return <>{first}<span className="text-neon-cyan group-hover:text-neon-pink transition-all">_{rest.join("_")}</span></>;
                }
                return <span className="text-neon-cyan">{name}</span>;
              })()}
            </Link>
            <p className="font-mono text-xs text-gray-500">
              {cfg?.copyrightText || `Cybersecurity Student & Aspiring Red Teamer © ${new Date().getFullYear()}`}
            </p>
          </div>

          {/* Social Links with proper icons */}
          <div className="flex items-center gap-1">
            {socialLinks.map((link: any) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${link.platform}`}
                className={`group flex items-center justify-center w-10 h-10 rounded-xl
                  bg-white/5 border border-white/5
                  hover:bg-white/10
                  text-gray-500
                  transition-all duration-200 ${getHoverColor(link.platform)}`}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </div>

          {/* Quick nav */}
          <div className="flex gap-5 flex-wrap justify-center">
            {['/', '/projects', '/certificates', '/blog', '/contact'].map((href, i) => {
              const labels = ['Home', 'Projects', 'Certs', 'Blog', 'Contact'];
              return (
                <Link key={href} href={href} className="font-mono text-xs text-gray-500 hover:text-neon-cyan transition-colors">
                  {labels[i]}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
