<<<<<<< HEAD
=======

>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProfileModal from './ProfileModal';
import { useGlobal } from '@/lib/GlobalState';

const links = [
<<<<<<< HEAD
  { href: '/',            label: 'Home' },
  { href: '/about',       label: 'About' },
  { href: '/certificates',label: 'Certifications' },
  { href: '/projects',    label: 'Projects' },
  { href: '/blog',        label: 'Blog' },
  { href: '/contact',     label: 'Contact' },
];

export default function Navbar({ previewCfg }: { previewCfg?: any }) {
  const { navbarCfg: globalCfg } = useGlobal() || { navbarCfg: {} };
  const cfg = previewCfg || globalCfg;
=======
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

>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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
<<<<<<< HEAD
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
      scrolled ? 'bg-dark-glass backdrop-blur-xl border-b border-dark-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
=======
    <nav
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-dark-glass backdrop-blur-xl border-b border-dark-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        
        {/* Left Section */}
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
        <div className="flex items-center gap-3">
          <button
            onClick={() => setProfileOpen(true)}
            className="relative w-10 h-10 rounded-full group outline-none"
<<<<<<< HEAD
            aria-label="Open profile"
          >
            <img
              src={cfg?.brandImage || "/profile.jpg"}
              alt={cfg?.brandName || "Jaishanth M"}
              className="rounded-full relative object-cover w-full h-full border border-white/20 group-hover:scale-105 transition-transform duration-300 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            />
          </button>

          <Link href="/" className="font-display font-bold text-xl tracking-tighter text-white group hidden sm:flex">
            {(() => {
              const name = cfg?.brandName || "jaiz_sec";
              if (name.includes("_")) {
                const [first, ...rest] = name.split("_");
                return <>{first}<span className="text-neon-cyan group-hover:neon-text-glow transition-all">_{rest.join("_")}</span></>;
              }
              return <span className="group-hover:text-neon-cyan transition-all">{name}</span>;
=======
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
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
            })()}
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1 bg-dark-glass backdrop-blur-md border border-dark-border/50 rounded-full px-2 py-1.5">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
<<<<<<< HEAD
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === link.href
                  ? 'bg-neon-purple/15 text-white shadow-[inset_0_0_8px_rgba(168,85,247,0.2)] border border-neon-purple/25'
=======
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === link.href
                  ? 'bg-neon-purple/20 text-white shadow-[inset_0_0_10px_rgba(157,0,255,0.3)] border border-neon-purple/30'
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
<<<<<<< HEAD
              {pathname === link.href && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent rounded-full" />
              )}
=======
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
            </Link>
          ))}
        </div>

<<<<<<< HEAD
        <div className="hidden md:flex gap-3">
          <Link href="/projects" className="px-4 py-2.5 rounded-lg font-mono text-xs text-gray-400 border border-white/8 hover:bg-white/4 hover:text-white transition-all">
            View Security Work
          </Link>
          <Link href="/contact" className="neon-btn text-sm">
            {cfg?.ctaText || 'Available for Hire'} <span className="text-neon-cyan">↗</span>
=======
        {/* CTA Button */}
        <div className="hidden md:flex">
          <Link href="/contact" className="neon-btn text-sm">
            {config?.ctaText || 'Available for Hire'}{" "}
            <span className="text-neon-cyan">↗</span>
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
          </Link>
        </div>

        {/* Mobile Toggle */}
<<<<<<< HEAD
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={menuOpen ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
=======
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
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
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
<<<<<<< HEAD
                pathname === link.href ? 'bg-neon-purple/20 text-white border border-neon-purple/30' : 'text-gray-400'
=======
                pathname === link.href
                  ? 'bg-neon-purple/20 text-white border border-neon-purple/30'
                  : 'text-gray-400'
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

<<<<<<< HEAD
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
=======
      {/* Profile Modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
>>>>>>> 18fc3c3ca0143d3a92e906f6b9643fa76a46d93a
    </nav>
  );
}
