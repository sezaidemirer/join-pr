'use client';

import Link from 'next/link';

interface CTASectionProps {
  title: string;
  description: string;
  buttonLabel: string;
  href?: string;
}

export function CTASection({ title, description, buttonLabel, href = '/contact' }: CTASectionProps) {
  const isExternal = href.startsWith('http');

  const buttonClass =
    'inline-flex items-center justify-center rounded-full bg-white/15 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition-all hover:bg-white/25';

  return (
    <section className="relative overflow-hidden rounded-3xl border border-teal-500/20 bg-gradient-to-br from-teal-500/10 via-sky-500/10 to-blue-600/10 p-10 shadow-glow-teal">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.25),_transparent_60%)]" />
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">{title}</h2>
          <p className="mt-3 text-sm text-zinc-200 md:text-base">{description}</p>
        </div>
        {isExternal ? (
          <a href={href} target="_blank" rel="noreferrer" className={buttonClass}>
            {buttonLabel}
          </a>
        ) : (
          <Link href={href} className={buttonClass}>
            {buttonLabel}
          </Link>
        )}
      </div>
    </section>
  );
}


