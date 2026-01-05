'use client';

import { FormEvent, useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';

const SOCIAL_LINKS = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com', icon: LinkedInIcon },
  { name: 'Instagram', href: 'https://www.instagram.com', icon: InstagramIcon },
  { name: 'YouTube', href: 'https://www.youtube.com', icon: YoutubeIcon },
  { name: 'Facebook', href: 'https://www.facebook.com', icon: FacebookIcon },
  { name: 'TikTok', href: 'https://www.tiktok.com', icon: TikTokIcon },
] as const;

export function Footer() {
  const { translations } = useLanguage();
  const footer = translations.common.footer;
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <footer className="relative mt-24 border-t border-white/5 bg-zinc-950/80">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,197,247,0.15),_transparent_55%)]" />
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <h2 className="text-2xl font-semibold text-white">{footer.title}</h2>
            <p className="mt-4 max-w-xl text-sm text-zinc-400">{translations.common.tagline}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              <div className="rounded-full border border-white/10 px-4 py-2 backdrop-blur">
                {footer.addressLabel}: <span className="text-white">{footer.address}</span>
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 backdrop-blur">
                {footer.emailLabel}: <a href="mailto:info@joinpr.com.tr" className="text-white hover:underline">info@joinpr.com.tr</a>
              </div>
              <div className="rounded-full border border-white/10 px-4 py-2 backdrop-blur">
                {footer.phoneLabel}: <a href="tel:+902123818656" className="text-white hover:underline">{footer.phone || "0 (212) 381 86 56"}</a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">{footer.socialTitle}</h3>
            <ul className="mt-4 grid grid-cols-1 gap-3 text-sm text-zinc-400 lg:grid-cols-2">
              {SOCIAL_LINKS.map(({ name, href, icon: Icon }) => (
                <li key={name}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-all hover:border-white/10 hover:bg-white/5 hover:text-white"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-sky-400 transition-all group-hover:bg-gradient-to-br group-hover:from-teal-500 group-hover:to-blue-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-base font-medium">{name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">{footer.newsletterTitle}</h3>
            <p className="mt-3 text-sm text-zinc-400">{footer.newsletterDescription}</p>
            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={footer.newsletterPlaceholder}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-gradient-to-r from-teal-500 via-sky-500 to-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition-transform hover:-translate-y-1"
                >
                  {footer.newsletterCta}
                </button>
              </div>
              {submitted && (
                <p className="text-xs font-medium text-teal-400">
                  ✓ {translations.contact.form.success}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/5 pt-6 text-xs text-zinc-500 sm:flex-row">
          <span>{footer.rights.replace('{{year}}', new Date().getFullYear().toString())}</span>
          <span>Join PR Group · İstanbul</span>
        </div>
      </div>
    </footer>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.25 3H3.75A.75.75 0 0 0 3 3.75v16.5a.75.75 0 0 0 .75.75h16.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 20.25 3ZM8.1 18.75H5.4V9.75h2.7v9Zm-1.35-10.5a1.59 1.59 0 1 1 0-3.18 1.59 1.59 0 0 1 0 3.18Zm12.6 10.5h-2.7v-4.87c0-1.16-.02-2.66-1.62-2.66-1.63 0-1.88 1.27-1.88 2.58v4.95H10.95v-9h2.59v1.23h.04a2.84 2.84 0 0 1 2.56-1.4c2.74 0 3.24 1.8 3.24 4.13v5.04Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5Zm5.75-4.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z" />
    </svg>
  );
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.6 6.2a2.66 2.66 0 0 0-1.87-1.88C17.91 4 12 4 12 4s-5.91 0-7.73.32A2.66 2.66 0 0 0 2.4 6.2 27.49 27.49 0 0 0 2 10a27.49 27.49 0 0 0 .4 3.8 2.66 2.66 0 0 0 1.87 1.88C6.09 16 12 16 12 16s5.91 0 7.73-.32a2.66 2.66 0 0 0 1.87-1.88A27.49 27.49 0 0 0 22 10a27.49 27.49 0 0 0-.4-3.8ZM10 13V7l5 3-5 3Z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

