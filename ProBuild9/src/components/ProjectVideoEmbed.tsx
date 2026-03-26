'use client';

import { useMemo, useState } from 'react';

function extractYouTubeId(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.split('/').filter(Boolean)[0] || null;
    }
    if (parsed.pathname.startsWith('/shorts/')) {
      return parsed.pathname.split('/').filter(Boolean)[1] || null;
    }
    if (parsed.pathname.startsWith('/embed/')) {
      return parsed.pathname.split('/').filter(Boolean)[1] || null;
    }
    return parsed.searchParams.get('v');
  } catch {
    return null;
  }
}

export function ProjectVideoEmbed({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className: string;
}) {
  const [playing, setPlaying] = useState(false);

  const videoId = useMemo(() => extractYouTubeId(url), [url]);
  const thumb = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : url;

  if (!videoId) {
    return (
      <iframe
        src={url}
        className={`w-full ${className}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    );
  }

  if (playing) {
    return (
      <iframe
        src={embedUrl}
        className={`w-full ${className}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    );
  }

  return (
    <button type="button" onClick={() => setPlaying(true)} className={`relative w-full ${className}`}>
      <img src={thumb} alt={title} className="h-full w-full object-cover" />
      <span className="pointer-events-none absolute inset-0 bg-black/20" />
      <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-lg">
        <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-current" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
}

