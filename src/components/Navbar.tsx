'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
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

  const profilePic = globalProfileCfg?.profileImage || cfg?.brandImage || '/profile.jpg';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setMenuOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
      scrolled ? 'bg-[rgba(5,5,8,0.92)] backdrop-blur-xl border-b border-white/8 shadow-[0_4px_30px_rgba(0,0,0,0.6)]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[68px] flex items-center justify-between gap-3">

        {/* LEFT — avatar + brand name, always separate, never overlap */}
        <div className="flex items-center gap-3 min-w-0 shrink-0">
          {cfg?.showProfileImage !== false && (
            <button
              onClick={() => setProfileOpen(true)}
              className="relative w-9 h-9 rounded-full outline-none shrink-0 group"
              aria-label="Open profile"
            >
              <Image
                src={profilePic}
                alt={cfg?.brandName || 'Jaishanth M'}
                fill
                sizes="36px"
                className="rounded-full object-cover border border-neon-purple/40 group-hover:scale-105 transition-transform duration-300 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
              />
            </button>
          )}
          <Link href="/" className="font-display font-bold text-lg tracking-tight text-white shrink-0 group">
            {(() => {
              const name = cfg?.brandName || 'Jaiz';
              if (name.includes('_')) {
                const [first, ...rest] = name.split('_');
                return <>{first}<span className="text-neon-cyan group-hover:neon-text-glow transition-all">_{rest.join('_')}</span></>;
              }
              return <span className="group-hover:text-neon-cyan transition-all">{name}</span>;
            })()}
          </Link>
        </div>

        {/* CENTER — desktop nav pill */}
        <div className="hidden md:flex items-center gap-0.5 bg-white/[0.04] backdrop-blur-md border border-white/8 rounded-full px-1.5 py-1.5">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                pathname === link.href
                  ? 'bg-neon-purple/20 text-white border border-neon-purple/30 shadow-[inset_0_0_8px_rgba(168,85,247,0.15)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
              {pathname === link.href && (
                <span className="absolute bottom-0.5 left-1/3 right-1/3 h-[1.5px] bg-gradient-to-r from-transparent via-neon-purple to-transparent rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* RIGHT — desktop CTA */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link href="/projects" className="px-4 py-2 rounded-lg font-mono text-xs text-gray-400 border border-white/8 hover:bg-white/5 hover:text-white transition-all">
            View Work
          </Link>
          <Link href="/contact" className="neon-btn text-sm py-2">
            {cfg?.ctaText || 'Hire Me'} <span className="text-neon-cyan">↗</span>
          </Link>
        </div>

        {/* MOBILE — hamburger */}
        <button
          className="md:hidden text-white p-2 rounded-lg hover:bg-white/8 transition-all shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d={menuOpen ? 'M18 6L6 18M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} className="transition-all duration-300" />
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden fixed inset-0 top-[68px] z-50 transition-all duration-300 ${
        menuOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}>
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMenuOpen(false)}
        />
        <div className={`absolute top-0 right-0 w-[min(320px,90vw)] h-full bg-[#070710]/98 backdrop-blur-xl border-l border-white/8 shadow-2xl
          transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full p-5">
            <nav className="flex flex-col gap-1 flex-1 pt-1">
              {links.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-4 text-base font-medium px-4 py-3.5 rounded-xl transition-all duration-200 ${
                    pathname === link.href
                      ? 'bg-neon-purple/15 text-white border border-neon-purple/25'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ transitionDelay: menuOpen ? `${i * 40}ms` : '0ms' }}
                >
                  <span className={`text-sm ${pathname === link.href ? 'text-neon-purple' : 'text-gray-600'}`}>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="pt-5 border-t border-white/8 space-y-3">
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="neon-btn text-sm w-full text-center block">
                {cfg?.ctaText || 'Hire Me'} <span className="text-neon-cyan">↗</span>
              </Link>
              <Link href="/projects" onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-3 rounded-lg font-mono text-xs text-gray-400 border border-white/8 hover:bg-white/5 transition-all">
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
