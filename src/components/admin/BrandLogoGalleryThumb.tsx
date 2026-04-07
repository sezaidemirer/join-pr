'use client';

import { isBrandLogoGalleryExcludedFromBoost } from '@/lib/brand-logo-gallery-thumb';

type BrandLogoGalleryThumbProps = {
  src: string;
  label: string;
};

/** Taban kutu: 3.6rem × 8.4rem; Ajet / Vitrin bu ölçüde. Diğerleri alan %40 büyük (×1.4). */
export function BrandLogoGalleryThumb({ src, label }: BrandLogoGalleryThumbProps) {
  const excluded = isBrandLogoGalleryExcludedFromBoost(label, src);

  if (excluded) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={label} className="h-[3.6rem] w-full max-w-[8.4rem] object-contain" loading="lazy" />
    );
  }

  return (
    <div className="flex h-[5.04rem] w-full max-w-[11.76rem] shrink-0 items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label} className="max-h-full max-w-full object-contain" loading="lazy" />
    </div>
  );
}
