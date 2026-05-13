'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ProfileModal from './ProfileModal';
import { useGlobal } from '@/lib/GlobalState';

const links = [
  { href: '/',            label: 'Home',    icon: '◈' },
  { href: '/about',       label: 'About',   icon: '◇' },
  { href: '/certificates',label: 'Certs',   icon: '◎' },
  { href: '/projects',    label: 'Projects', icon: '◻' },
  { href: '/blog',        label: 'Blog',    icon: '✎' },
  { href: '/contact',     label: 'Contact', icon: '✉' },
];

export default function Navbar({ previewCfg }: { previewCfg?: any }) {
  const { navbarCfg: globalCfg, profileCfg: globalProfileCfg } = useGlobal() || { navbarCfg: {}, profileCfg: {} };
  const cfg = previewCfg || globalCfg;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const profilePic = globalProfileCfg?.profileImage || cfg?.brandImage || "/profile.jpg";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
      scrolled ? 'bg-dark-glass backdrop-blur-xl border-b border-dark-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {cfg?.showProfileImage !== false && (
            <button
              onClick={() => setProfileOpen(true)}
              className="relative w-10 h-10 rounded-full group outline-none shrink-0"
              aria-label="Open profile"
            >
              <Image
                src={profilePic}
                alt={cfg?.brandName || "Jaishanth M"}
                fill
                sizes="(max-width: 768px) 40px, 40px"
                className="rounded-full object-cover border border-white/20 group-hover:scale-105 transition-transform duration-300 shadow-[0_0_8px_rgba(168,85,247,0.5)]"
              />
            </button>
          )}

          <Link href="/" className="font-display font-bold text-xl tracking-tighter text-white group hidden sm:flex">
            {(() => {
              const name = cfg?.brandName || "jaiz_sec";
              if (name.includes("_")) {
                const [first, ...rest] = name.split("_");
                return <>{first}<span className="text-neon-cyan group-hover:neon-text-glow transition-all">_{rest.join("_")}</span></>;
              }
              return <span className="group-hover:text-neon-cyan transition-all">{name}</span>;
            })()}
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1 bg-dark-glass backdrop-blur-md border border-dark-border/50 rounded-full px-2 py-1.5">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === link.href
                  ? 'bg-neon-purple/15 text-white shadow-[inset_0_0_8px_rgba(168,85,247,0.2)] border border-neon-purple/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent rounded-full" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex gap-3">
          <Link href="/projects" className="px-4 py-2.5 rounded-lg font-mono text-xs text-gray-400 border border-white/8 hover:bg-white/4 hover:text-white transition-all">
            View Security Work
          </Link>
          <Link href="/contact" className="neon-btn text-sm">
            {cfg?.ctaText || 'Available for Hire'} <span className="text-neon-cyan">↗</span>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-2 rounded-lg hover:bg-white/5 transition-all" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={menuOpen ? "M18 6L6 18M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} className="transition-all duration-300" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu — Full screen slide-in */}
      <div className={`md:hidden fixed inset-0 top-[72px] z-50 transition-all duration-300 ${
        menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu panel */}
        <div className={`absolute top-0 right-0 w-full max-w-[320px] h-full bg-[#070710] border-l border-dark-border shadow-2xl
          transition-transform duration-300 ease-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="flex flex-col h-full p-6">
            {/* Nav links */}
            <nav className="flex flex-col gap-2 flex-1 pt-2">
              {links.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-4 text-lg font-medium p-4 rounded-xl transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-neon-purple/15 text-white border border-neon-purple/30 shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ transitionDelay: menuOpen ? `${i * 50}ms` : '0ms' }}
                >
                  <span className={`text-base ${pathname === link.href ? 'text-neon-purple' : 'text-gray-600'}`}>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Bottom CTA */}
            <div className="pt-6 border-t border-dark-border space-y-3">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="neon-btn text-sm w-full text-center block"
              >
                {cfg?.ctaText || 'Available for Hire'} <span className="text-neon-cyan">↗</span>
              </Link>
              <Link
                href="/projects"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-lg font-mono text-xs text-gray-400 border border-white/8 hover:bg-white/4 transition-all"
              >
                View Security Work
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </nav>
  );
}
