'use client';

import { isBrandLogoGalleryExcludedFromBoost } from '@/lib/brand-logo-gallery-thumb';

type BrandLogoGalleryThumbProps = {
  src: string;
  label: string;
};

/** Taban kutu: 3.6rem × 8.4rem; Ajet / Vitrin bu ölçüde. Diğerleri alan %40 büyük (×1.4). */
export function BrandLogoGalleryThumb({ src, label }: BrandLogoGalleryThumbProps) {
  const normalized = `${label} ${src}`.toLowerCase();
  const excluded = isBrandLogoGalleryExcludedFromBoost(label, src);
  const isRixos = normalized.includes('rixos');
  const isFocusedRixos =
    normalized.includes('premium seagate') ||
    normalized.includes('radamis') ||
    normalized.includes('sharm el sheikh') ||
    normalized.includes('egypt hotels') ||
    normalized.includes('egypt hotel');
  const isEgyptHotelsRixos = normalized.includes('rixos') && normalized.includes('egypt');
  const isAirMontenegro = normalized.includes('air_montenegro.png') || normalized.includes('air montenegro');
  const isNovuLab = normalized.includes('novu_lab.png') || normalized.includes('novu lab');
  const isFourSeasons = normalized.includes('four_seasons.png') || normalized.includes('four seasons');
  const isClubPriveLogo2 = normalized.includes('club-prive-logo2.webp') || normalized.includes('club prive logo2');
  const isMarriottDeadSea =
    normalized.includes('marriot_deat_sea.png') ||
    (normalized.includes('marriot') || normalized.includes('marriott')) &&
    (normalized.includes('dead sea') || normalized.includes('deat sea'));

  return (
    <div className="flex h-full w-full shrink-0 items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={label}
        className={
          excluded
            ? 'max-h-full max-w-full object-contain'
            : isEgyptHotelsRixos
              ? 'max-h-full max-w-full scale-[2.1] object-contain'
            : isAirMontenegro
              ? 'max-h-full max-w-full scale-[1.15] object-contain'
            : isNovuLab
              ? 'max-h-full max-w-full scale-[1.3] object-contain'
            : isFourSeasons
              ? 'max-h-full max-w-full scale-[1.3] object-contain'
            : isClubPriveLogo2
              ? 'max-h-full max-w-full scale-[1.3] object-contain'
            : isMarriottDeadSea
              ? 'max-h-full max-w-full scale-[1.45] object-contain'
            : isFocusedRixos
              ? 'max-h-full max-w-full scale-[2.2] object-contain'
            : isRixos
              ? 'max-h-full max-w-full scale-[1.3] object-contain'
              : 'max-h-full max-w-full object-contain'
        }
        loading="lazy"
      />
    </div>
  );
}
