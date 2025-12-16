'use client';

import Image from 'next/image';
import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  description: string;
  accent?: 'teal' | 'sky' | 'blue';
  href?: string;
  image?: string;
}

const ACCENT_MAP: Record<NonNullable<ServiceCardProps['accent']>, string> = {
  teal: 'from-teal-500/20 via-emerald-500/10 to-transparent',
  sky: 'from-sky-500/20 via-cyan-500/10 to-transparent',
  blue: 'from-blue-500/20 via-indigo-500/10 to-transparent',
};

export function ServiceCard({ title, description, accent = 'teal', href, image }: ServiceCardProps) {
  const content = (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 p-8 shadow-lg shadow-black/30 transition-transform hover:-translate-y-1">
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-br ${ACCENT_MAP[accent]} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
      />
      <div className="flex items-start gap-4">
        {image && (
          <div className="relative flex-shrink-0">
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white/20 ring-2 ring-teal-500/30 shadow-lg shadow-teal-500/20">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="mt-3 text-sm text-zinc-400">{description}</p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        {content}
      </Link>
    );
  }

  return content;
}


