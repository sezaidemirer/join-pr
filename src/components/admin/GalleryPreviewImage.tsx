'use client';

import { useEffect, useState } from 'react';

import { isHeicLikePublicUrl } from '@/lib/ensure-web-displayable-image';

function resolveImgSrc(url: string): string {
  if (url.startsWith('http') || url.startsWith('//')) return url;
  return encodeURI(url.startsWith('/') ? url : `/${url}`);
}

type Props = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * JPEG/PNG/WebP vb. doğrudan img; .heic/.heif URL’lerinde fetch + heic2any ile JPEG önizleme.
 */
export function GalleryPreviewImage({ src, alt, className }: Props) {
  const [displaySrc, setDisplaySrc] = useState<string | null>(() =>
    isHeicLikePublicUrl(src) ? null : resolveImgSrc(src)
  );
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(() =>
    isHeicLikePublicUrl(src) ? 'loading' : 'ready'
  );

  useEffect(() => {
    const heic = isHeicLikePublicUrl(src);
    if (!heic) {
      setDisplaySrc(resolveImgSrc(src));
      setStatus('ready');
      return;
    }

    let cancelled = false;
    let objectUrl: string | null = null;

    setDisplaySrc(null);
    setStatus('loading');

    (async () => {
      try {
        const fetchUrl = resolveImgSrc(src);
        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error('fetch failed');
        const blob = await res.blob();
        const heic2any = (await import('heic2any')).default;
        const out = await heic2any({ blob, toType: 'image/jpeg', quality: 0.85 });
        const jpegBlob = Array.isArray(out) ? out[0] : out;
        objectUrl = URL.createObjectURL(jpegBlob);
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        setDisplaySrc(objectUrl);
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  if (status === 'error') {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-zinc-900 px-2 text-center text-[11px] text-zinc-500 ${className ?? ''}`}
      >
        HEIC onizlenemedi. Dosyayi tekrar yukleyin (JPEGe cevrilir) veya Safari deneyin.
      </div>
    );
  }

  if (status === 'loading' || !displaySrc) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-zinc-900 text-xs text-zinc-500 ${className ?? ''}`}
      >
        Onizleme hazirlaniyor…
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element -- blob veya harici galeri URL
  return <img src={displaySrc} alt={alt} className={className} />;
}
