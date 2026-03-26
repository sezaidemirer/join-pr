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
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 shadow-lg shadow-black/30 transition-transform hover:-translate-y-1">
      {image ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 bg-black/40" />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h3 className="text-2xl font-semibold text-white">{title}</h3>
            <p className="mt-2 text-base text-zinc-200/90">{description}</p>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`absolute inset-0 -z-10 bg-gradient-to-br ${ACCENT_MAP[accent]} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
          />
          <div className="p-8">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="mt-3 text-sm text-zinc-400">{description}</p>
          </div>
        </>
      )}
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


