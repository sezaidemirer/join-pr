'use client';

import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

function PlaceholderAvatar({ size = 48 }: { size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border-2 border-dashed border-zinc-500 bg-zinc-800/60 text-zinc-500"
      style={{ width: size, height: size }}
    >
      <span className="text-xl">?</span>
    </div>
  );
}

function CreatorAvatar({ name, imagePath, size = 48 }: { name: string; imagePath?: string; size?: number }) {
  if (imagePath) {
    return (
      <div className="relative shrink-0 overflow-hidden rounded-full bg-zinc-800" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imagePath} alt={name} width={size} height={size} className="h-full w-full object-cover" />
      </div>
    );
  }
  return <PlaceholderAvatar size={size} />;
}

function VideoWithFirstFrame({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [posterReady, setPosterReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isVimeo = /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/\d+|player\.vimeo\.com\/video\/\d+)/i.test(src);
  const baseVimeoSrc = isVimeo
    ? /player\.vimeo\.com\/video\/\d+/i.test(src)
      ? src
      : src.replace(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+).*/i, 'https://player.vimeo.com/video/$1')
    : '';
  const vimeoEmbedSrc = baseVimeoSrc
    ? `${baseVimeoSrc}${baseVimeoSrc.includes('?') ? '&' : '?'}badge=0&title=0&byline=0&portrait=0&dnt=1`
    : '';

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const captureFrame = () => {
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx || video.readyState < 2) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        setPosterReady(true);
      } catch {
        setPosterReady(false);
      }
    };

    const onSeeked = () => captureFrame();
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onDurationChange = () => setDuration(video.duration || 0);
    const onLoaded = () => {
      video.currentTime = 0.5;
    };

    video.addEventListener('seeked', onSeeked);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('loadeddata', onLoaded);
    video.preload = 'metadata';
    if (video.readyState >= 2) video.currentTime = 0.5;

    return () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('loadeddata', onLoaded);
    };
  }, [src]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen();
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const t = Number(e.target.value);
    v.currentTime = t;
    setCurrentTime(t);
  };

  const controlsBar = (
    <>
      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded text-white/90 hover:text-white"
        aria-label={isFullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
      >
        {isFullscreen ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent px-2 pb-1 pt-6">
        <button
          type="button"
          onClick={togglePlay}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-white/90 hover:text-white"
          aria-label={playing ? 'Duraklat' : 'Oynat'}
        >
          {playing ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={toggleMute}
          className="flex h-8 w-8 shrink-0 items-center justify-center text-white/90 hover:text-white"
          aria-label={muted ? 'Sesi aç' : 'Sesi kapat'}
        >
          {muted ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M11.293 4.293a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
        <input type="range" min={0} max={duration || 100} value={currentTime} onChange={onSeek} className="h-1 flex-1 min-w-0 accent-white" />
      </div>
    </>
  );

  return (
    <div
      ref={containerRef}
      className={isFullscreen ? 'flex min-h-screen min-w-full items-center justify-center bg-black' : 'relative h-full w-full bg-black'}
    >
      <div className={isFullscreen ? 'relative h-full max-h-[100vh] w-auto max-w-full shrink-0 aspect-[9/16]' : 'relative h-full w-full'}>
        {isVimeo ? (
          <iframe
            src={vimeoEmbedSrc}
            className={`h-full w-full ${className ?? ''}`}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            allowFullScreen
            title="Vimeo video"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={src}
              playsInline
              preload="none"
              muted={muted}
              onClick={togglePlay}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              className={`h-full w-full object-cover ${className ?? ''}`}
            />
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              style={{ display: posterReady && !playing ? 'block' : 'none' }}
              aria-hidden
            />
            {controlsBar}
          </>
        )}
      </div>
    </div>
  );
}

function FeaturedContentCell({ src, label }: { src?: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-full max-w-[200px] overflow-hidden rounded-xl border border-white/10 bg-zinc-800">
        <div className="aspect-[9/16] w-full">
          {src ? (
            <VideoWithFirstFrame src={src} />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-zinc-900/80 px-3 text-center">
              <span className="text-xs text-zinc-500">Video</span>
              <span className="text-[11px] leading-tight text-zinc-400">{label}</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-center text-sm font-medium text-white">{label}</p>
    </div>
  );
}

// Swissotel Sharm El Sheikh.pdf — genel performans özeti
const SWISS_KPIS = {
  posts: 50,
  influencers: 8,
  engagement: '249.11K',
  value: '$407.6K',
};

const SWISS_PERFORMANCE = {
  posts: 50,
  creators: 8,
  views: '2.93M',
  engagements: '249.11K',
  engagementRate: '1.13%',
  reach: '2.23M',
  emv: '$407.6K',
  followers: '6.28M',
  shares: '9.41K',
  likes: '240.18K',
  comments: '1.66K',
  dateRange: '12 Haz 2024 – 4 Kas 2025',
};

/**
 * PDF “Profiller” blokları (posts toplamı 50) görüntülenmeye göre sıralanıp
 * rapordaki isim listesiyle eşlendi (Diego→en yüksek views, Gizem→24 post vb.).
 */
const SWISS_CREATORS = [
  {
    name: 'Diego Fusina',
    handle: 'diegofusina',
    image: '/rixos-infleuncers/diego_fusina.webp',
    posts: 7,
    views: '870.9K',
    engagementRate: '0.5%',
    reach: '674.95K',
    emv: '$92.5K',
    followers: '1.67M',
  },
  {
    name: 'Gizem Güneş',
    handle: 'gizemgunes',
    image: '/rixos-infleuncers/gizem_gunes.webp',
    posts: 24,
    views: '593.18K',
    engagementRate: '0.77%',
    reach: '433.91K',
    emv: '$100.7K',
    followers: '1.37M',
  },
  {
    name: 'Rojda Demirer',
    handle: 'rojdademirer',
    image: '/rixos-infleuncers/rojda_demirer.webp',
    posts: 2,
    views: '422.88K',
    engagementRate: '1.28%',
    reach: '398.05K',
    emv: '$42.5K',
    followers: '1.14M',
  },
  {
    name: 'Emre Bulut',
    handle: 'emrebulut',
    image: '/rixos-infleuncers/emre_bulut.webp',
    posts: 2,
    views: '366.28K',
    engagementRate: '7.04%',
    reach: '260.48K',
    emv: '$53.1K',
    followers: '255.09K',
  },
  {
    name: 'Baran Bölükbaşı',
    handle: 'baranbolukbasi',
    image: '/rixos-infleuncers/baran_bolukbasi.webp',
    posts: 1,
    views: '313.14K',
    engagementRate: '7.7%',
    reach: '205.42K',
    emv: '$55.2K',
    followers: '701.5K',
  },
  {
    name: 'Çağla Boz',
    handle: 'caglaboz',
    image: '/rixos-infleuncers/cagla_boz.webp',
    posts: 4,
    views: '202.35K',
    engagementRate: '7%',
    reach: '136.75K',
    emv: '$44.9K',
    followers: '433.82K',
  },
];

const SWISS_FEATURED_CONTENT: { src?: string; label: string }[] = [
  { src: 'https://player.vimeo.com/video/1178980390?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Diego Fusina' },
  { src: 'https://player.vimeo.com/video/1178980439?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Gizem Güneş' },
  { src: 'https://player.vimeo.com/video/1178980353?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Gizem Güneş' },
  { src: 'https://player.vimeo.com/video/1178980419?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Diego Fusina' },
  { src: 'https://player.vimeo.com/video/1178980336?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Batuhan Ekşi' },
  { src: 'https://player.vimeo.com/video/1178980312?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Çağla Boz' },
];

type ParticipatingInfluencer = { name: string; imagePath?: string };

const SWISS_ALL_INFLUENCERS: ParticipatingInfluencer[] = [
  { name: 'Gizem Güneş', imagePath: '/rixos-infleuncers/gizem_gunes.webp' },
  { name: 'Diego Fusina', imagePath: '/rixos-infleuncers/diego_fusina.webp' },
  { name: 'Rojda Demirer', imagePath: '/rixos-infleuncers/rojda_demirer.webp' },
  { name: 'Emre Bulut', imagePath: '/rixos-infleuncers/emre_bulut.webp' },
  { name: 'Baran Bölükbaşı', imagePath: '/rixos-infleuncers/baran_bolukbasi.webp' },
  { name: 'Çağla Boz', imagePath: '/rixos-infleuncers/cagla_boz.webp' },
  { name: 'Batuhan Ekşi', imagePath: '/rixos-infleuncers/batuhan_eksi.webp' },
  { name: 'Hasan Denizyaran', imagePath: '/rixos-infleuncers/hasan_denizyaran.webp' },
];

export default function SwissotelSharmElSheikhPage() {
  const { translations } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12 pb-20">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white p-4">
            <img src="/marka-logolari/swissotel_sharm.png" alt="Swissôtel Sharm El Sheikh" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-2xl font-semibold text-white md:text-3xl">Swissôtel Sharm El Sheikh İş Birliği Raporu</h1>
        </div>

        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Toplam Gönderi</p>
            <p className="mt-1 text-3xl font-bold text-white">{SWISS_KPIS.posts}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Katılımcılar</p>
            <p className="mt-1 text-3xl font-bold text-white">{SWISS_KPIS.influencers}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Toplam Etkileşim</p>
            <p className="mt-1 text-3xl font-bold text-sky-400">{SWISS_KPIS.engagement}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Katma Değer (EMV)</p>
            <p className="mt-1 text-3xl font-bold text-emerald-400">{SWISS_KPIS.value}</p>
          </div>
        </div>

        <section className="mb-12">
          <div className="space-y-10">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Kampanya Detayları</h3>
              <p className="whitespace-pre-line rounded-xl border border-white/10 bg-zinc-900/40 p-6 text-zinc-300">
                Swissôtel Sharm El Sheikh için hayata geçirdiğimiz iletişim çalışmalarında, deneyim odaklı seyahat içerikleriyle markanın özgün atmosferini güçlü bir destinasyon hikâyesine dönüştürdük.{'\n\n'}
                Swissôtel Sharm El Sheikh&apos;in sunduğu resort deneyimini; estetik, konfor ve destinasyon duygusunu öne çıkaran bir iletişim kurgusuyla görünür hale getirdik. Üretilen içeriklerde yalnızca otelin fiziksel özellikleri değil, misafire hissettirdiği atmosfer, deneyimin ritmi ve Sharm El Sheikh&apos;in güçlü tatil enerjisi de ön plana taşıdık.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Performans Özeti</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Posts</p>
                  <p className="mt-1 text-xl font-bold text-white">{SWISS_PERFORMANCE.posts}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Katılımcılar</p>
                  <p className="mt-1 text-xl font-bold text-white">{SWISS_PERFORMANCE.creators}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Views</p>
                  <p className="mt-1 text-xl font-bold text-sky-400">{SWISS_PERFORMANCE.views}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Engagements</p>
                  <p className="mt-1 text-xl font-bold text-white">{SWISS_PERFORMANCE.engagements}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Engagement Rate</p>
                  <p className="mt-1 text-xl font-bold text-amber-400">{SWISS_PERFORMANCE.engagementRate}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Reach</p>
                  <p className="mt-1 text-xl font-bold text-white">{SWISS_PERFORMANCE.reach}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">EMV</p>
                  <p className="mt-1 text-xl font-bold text-emerald-400">{SWISS_PERFORMANCE.emv}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Followers (kitlenin toplamı)</p>
                  <p className="mt-1 text-xl font-bold text-white">{SWISS_PERFORMANCE.followers}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Shares</p>
                  <p className="mt-1 text-xl font-bold text-white">{SWISS_PERFORMANCE.shares}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Likes</p>
                  <p className="mt-1 text-xl font-bold text-white">{SWISS_PERFORMANCE.likes}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Comments</p>
                  <p className="mt-1 text-xl font-bold text-white">{SWISS_PERFORMANCE.comments}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                  <p className="text-xs text-zinc-400">Tarih Aralığı</p>
                  <p className="mt-1 text-sm font-medium text-white">{SWISS_PERFORMANCE.dateRange}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">En Çok Görüntülenme Alan Katılımcılar</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {SWISS_CREATORS.map((c) => (
                  <div key={c.handle} className="rounded-xl border border-white/10 bg-zinc-900/40 p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <CreatorAvatar name={c.name} imagePath={c.image} size={56} />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">{c.name}</p>
                        <p className="text-sm text-zinc-400">@{c.handle}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-zinc-400">Posts:</span>
                      <span className="text-white">{c.posts}</span>
                      <span className="text-zinc-400">Views:</span>
                      <span className="text-sky-400">{c.views}</span>
                      <span className="text-zinc-400">ER:</span>
                      <span className="text-white">{c.engagementRate}</span>
                      <span className="text-zinc-400">Reach:</span>
                      <span className="text-white">{c.reach}</span>
                      <span className="text-zinc-400">EMV:</span>
                      <span className="text-emerald-400">{c.emv}</span>
                      <span className="text-zinc-400">Followers:</span>
                      <span className="text-white">{c.followers}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10">
              <h3 className="mb-4 text-lg font-semibold text-white">Öne Çıkan İçerikler</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {SWISS_FEATURED_CONTENT.map(({ src, label }) => (
                  <FeaturedContentCell key={label} src={src} label={label} />
                ))}
              </div>
            </div>

            <div className="mt-12 border-t border-white/10 pt-10">
              <h3 className="mb-6 text-lg font-semibold text-white">Kampanyaya Katılan Tüm Katılımcılar</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 sm:gap-6">
                {SWISS_ALL_INFLUENCERS.map((person) => (
                  <div key={person.name} className="flex flex-col items-center gap-2">
                    <CreatorAvatar name={person.name} imagePath={person.imagePath} size={64} />
                    <p className="text-center text-sm font-medium text-white">{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/is-birliklerimiz"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/40"
          >
            İşbirliklerimiz
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-800/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-700/80"
          >
            {translations.common.project.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
