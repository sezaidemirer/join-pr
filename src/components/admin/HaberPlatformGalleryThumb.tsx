'use client';

import { isHaberPlatformLogoBoostedThumb } from '@/lib/haber-platform-gallery-thumb';

type HaberPlatformGalleryThumbProps = {
  src: string;
  label: string;
};

/** Varsayılan haber mecra kartı boyutu (h-12 × max-w-[7rem]); yalnızca Tourism Today & GM Dergi scale ile büyür. */
export function HaberPlatformGalleryThumb({ src, label }: HaberPlatformGalleryThumbProps) {
  const boosted = isHaberPlatformLogoBoostedThumb(label, src);

  if (!boosted) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={label} className="h-12 w-full max-w-[7rem] object-contain" loading="lazy" />
    );
  }

  return (
    <div className="flex h-12 w-full max-w-[7rem] shrink-0 items-center justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={label}
        className="max-h-full max-w-full origin-center scale-[1.3] object-contain"
        loading="lazy"
      />
    </div>
  );
}
