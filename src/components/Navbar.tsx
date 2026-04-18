
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProfileModal from './ProfileModal';
import { useGlobal } from '@/lib/GlobalState';

const links = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/certificates', label: 'Certifications' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

type NavbarProps = {
  cfg?: {
    brandPrefix?: string;
    brandName?: string;
    brandImage?: string;
    ctaText?: string;
  };
  previewCfg?: any;
};

export default function Navbar({ cfg, previewCfg }: NavbarProps) {
  const { navbarCfg: globalCfg } = useGlobal() || { navbarCfg: {} };

  // ✅ Single source config priority
  const config = cfg || previewCfg || globalCfg;

  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-glass backdrop-blur-xl border-b border-dark-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setProfileOpen(true)}
            className="relative w-10 h-10 rounded-full group outline-none"
          >
            <img
              src={config?.brandImage || "/profile.jpg"}
              alt={config?.brandName || "Jaishanth M"}
              className="rounded-full object-cover w-full h-full border border-white/20 group-hover:scale-105 transition-transform duration-300 shadow-[0_0_10px_rgba(157,0,255,0.6)]"
            />
          </button>

          <Link
            href="/"
            className="font-display font-bold text-xl tracking-tighter text-white group hidden sm:flex"
          >
            {(() => {
              const name = config?.brandName || "jaiz_sec";
              if (name.includes("_")) {
                const [first, ...rest] = name.split("_");
                return (
                  <>
                    {first}
                    <span className="text-neon-cyan group-hover:neon-text-glow transition-all">
                      _{rest.join("_")}
                    </span>
                  </>
                );
              }
              return (
                <span className="group-hover:text-neon-cyan transition-all">
                  {name}
                </span>
              );
            })()}
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1 bg-dark-glass backdrop-blur-md border border-dark-border/50 rounded-full px-2 py-1.5">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === link.href
                  ? 'bg-neon-purple/20 text-white shadow-[inset_0_0_10px_rgba(157,0,255,0.3)] border border-neon-purple/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex">
          <Link href="/contact" className="neon-btn text-sm">
            {config?.ctaText || 'Available for Hire'}{" "}
            <span className="text-neon-cyan">↗</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d={
                menuOpen
                  ? "M18 6L6 18M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-dark-main border-b border-dark-border p-6 flex flex-col gap-4 shadow-2xl">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-lg font-medium p-3 rounded-xl ${
                pathname === link.href
                  ? 'bg-neon-purple/20 text-white border border-neon-purple/30'
                  : 'text-gray-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </nav>
  );
}
