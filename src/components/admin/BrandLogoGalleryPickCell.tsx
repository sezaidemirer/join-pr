'use client';

import { BrandLogoGalleryThumb } from '@/components/admin/BrandLogoGalleryThumb';
import { isBlockedMediaReportLogo } from '@/lib/media-report-logo-blocklist';
import { markaLogoDisplayName } from '@/lib/marka-logo-display-name';

type Props = {
  src: string;
  label: string;
  onPick: () => void;
};

/** Beyaz kutu yalnızca görseli sarar; altta yalnızca türetilmiş marka adı (yol/uzantı yok). */
export function BrandLogoGalleryPickCell({ src, label, onPick }: Props) {
  const displayName = markaLogoDisplayName(label, src);
  const hidden =
    isBlockedMediaReportLogo(`${displayName} ${label} ${src}`) ||
    displayName.trim().toLowerCase() === 'royal jordan';

  if (hidden) return null;

  return (
    <button
      type="button"
      onClick={onPick}
      className="group flex w-full flex-col items-center gap-1.5 rounded-xl text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
    >
      <div className="aspect-square flex w-full items-center justify-center overflow-hidden rounded-xl border border-zinc-600 bg-white p-2 transition group-hover:border-teal-500 group-hover:shadow-md">
        <BrandLogoGalleryThumb src={src} label={label} />
      </div>
      <span className="line-clamp-2 w-full px-0.5 text-center text-[11px] font-medium leading-tight text-zinc-300">
        {displayName}
      </span>
    </button>
  );
}
