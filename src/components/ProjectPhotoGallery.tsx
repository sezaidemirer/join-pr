'use client';

import { useEffect, useState } from 'react';

type GalleryPhoto = {
  url: string;
  caption?: string;
};

export function ProjectPhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const isOpen = activeIndex !== null;

  function close() {
    setActiveIndex(null);
  }

  function goPrev() {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return prev === 0 ? photos.length - 1 : prev - 1;
    });
  }

  function goNext() {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return prev === photos.length - 1 ? 0 : prev + 1;
    });
  }

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, photos.length]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo, idx) => (
          <button
            key={`${idx}-${photo.url}`}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className="w-full overflow-hidden rounded-xl border border-zinc-800 text-left"
          >
            <div className="aspect-[4/5] w-full overflow-hidden bg-zinc-950">
              <img
                src={photo.url}
                alt={photo.caption || `Foto ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
            {photo.caption ? (
              <span className="block border-t border-zinc-800 bg-zinc-950/70 px-3 py-2 text-xs text-zinc-300">
                {photo.caption}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-[100] bg-black/90 p-4" onClick={close}>
          <div className="mx-auto flex h-full max-w-6xl items-center justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="mr-2 rounded-full border border-zinc-600 bg-zinc-900/70 px-3 py-2 text-xl text-white hover:bg-zinc-800"
              aria-label="Onceki fotograf"
            >
              ‹
            </button>

            <div className="max-h-full max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
              <img
                src={photos[activeIndex].url}
                alt={photos[activeIndex].caption || `Foto ${activeIndex + 1}`}
                className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
              />
              {photos[activeIndex].caption ? (
                <p className="mt-3 text-center text-sm text-zinc-200">{photos[activeIndex].caption}</p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="ml-2 rounded-full border border-zinc-600 bg-zinc-900/70 px-3 py-2 text-xl text-white hover:bg-zinc-800"
              aria-label="Sonraki fotograf"
            >
              ›
            </button>
          </div>

          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 rounded-md border border-zinc-600 bg-zinc-900/70 px-3 py-1 text-sm text-white hover:bg-zinc-800"
          >
            Kapat
          </button>
        </div>
      ) : null}
    </>
  );
}

