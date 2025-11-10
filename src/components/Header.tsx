'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

const NAV_LINKS = [
  { key: 'home', href: '/' },
  { key: 'joinPr', href: '/join-pr' },
  { key: 'joinCreative', href: '/join-creative' },
  { key: 'joinSocial', href: '/join-social' },
  { key: 'joinAds', href: '/join-ads' },
  { key: 'joinLabAi', href: '/join-lab-ai' },
  { key: 'joinEscapes', href: '/join-escapes' },
  { key: 'contact', href: '/contact' },
] as const;

export function Header() {
  const pathname = usePathname();
  const { translations } = useLanguage();
  const menu = translations.common.menu;
  const brandName = translations.common.brandName;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-zinc-950/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-10">
        <Link href="/" className="group flex items-center gap-3 text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 via-sky-500 to-blue-600 shadow-lg shadow-blue-900/50 transition-transform group-hover:scale-105">
            <span className="text-lg font-semibold">J</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm uppercase tracking-[0.28em] text-zinc-400">Join</span>
            <span className="text-xl font-semibold text-white">{brandName}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-300 lg:flex">
          {NAV_LINKS.map(({ key, href }) => {
            const isActive = href === '/'
              ? pathname === '/'
              : pathname.startsWith(href);
            return (
              <Link
                key={key}
                href={href}
                className={`relative px-1.5 py-1 transition-colors ${
                  isActive ? 'text-white' : 'hover:text-white'
                }`}
              >
                {menu[key]}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-2 h-0.5 bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 text-white transition-colors hover:border-zinc-700 lg:hidden"
          aria-label="Toggle navigation"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      <div
        className={`lg:hidden ${isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} transition-all duration-300`}
      >
        <div className="mx-4 rounded-2xl border border-white/10 bg-zinc-950/95 px-6 py-6 shadow-xl shadow-black/40 backdrop-blur-xl">
          <nav className="flex flex-col gap-4 text-base font-medium text-zinc-200">
            {NAV_LINKS.map(({ key, href }) => {
              const isActive = href === '/'
                ? pathname === '/'
                : pathname.startsWith(href);
              return (
                <Link
                  key={key}
                  href={href}
                  className={`rounded-xl px-3 py-2 transition-colors ${
                    isActive ? 'bg-gradient-to-r from-teal-500/20 via-sky-500/20 to-blue-600/20 text-white' : 'hover:bg-white/5'
                  }`}
                >
                  {menu[key]}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

