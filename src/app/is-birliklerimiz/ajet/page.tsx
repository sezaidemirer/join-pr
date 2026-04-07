'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

function CreatorAvatar({ name, imageSlug, imageExt = 'png', size = 48 }: { name: string; imageSlug: string; imageExt?: string; size?: number }) {
  const [imgError, setImgError] = useState(false);
  const ext = imageExt || 'png';
  const imgPath = `/ajet-influencers/${imageSlug}.${ext}`;

  if (!imgError) {
    return (
      <div className="relative shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-sky-600 to-sky-800" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgPath}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-600 to-sky-800 text-lg font-bold text-white"
      style={{ width: size, height: size }}
    >
      {name.charAt(0)}
    </div>
  );
}

/** Videoyu ilk saniyelerinden bir kare ile poster gibi gösterir; oynatılınca kare gizlenir. Özel kontroller: play, ses, progress. Sağ üstte dikey tam ekran butonu. */
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
    if (video.readyState >= 2) {
      video.currentTime = 0.5;
    }

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
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
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
      {/* Sağ üst: dikey tam ekran butonu */}
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
      {/* Alt kontrol çubuğu */}
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
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={onSeek}
          className="h-1 flex-1 min-w-0 accent-white"
        />
      </div>
    </>
  );

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? 'flex min-h-screen min-w-full items-center justify-center bg-black'
          : 'relative h-full w-full bg-black'
      }
    >
      <div
        className={
          isFullscreen
            ? 'relative h-full max-h-[100vh] w-auto max-w-full shrink-0 aspect-[9/16]'
            : 'relative h-full w-full'
        }
      >
        {isVimeo ? (
          <iframe
            src={vimeoEmbedSrc}
            className={`h-full w-full ${className ?? ''}`}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
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

type CampaignData = {
  id: string;
  title: string;
  date: string;
  kpis: { campaigns: number; influencers: number; engagement: string; value: string };
  influencers: { name: string; role: string }[];
  engagementData: { month: string; value: number }[];
  impact: { mediaValue: string; reach: string; engagementRate: string };
  pdfData?: AjetChallengePdfData;
};

type AjetChallengePdfData = {
  description: string;
  performance: {
    posts: number;
    creators: number;
    views: string;
    engagements: string;
    engagementRate: string;
    reach: string;
    emv: string;
    followers: string;
    shares: string;
    likes: string;
    comments: string;
    dateRange: string;
  };
  creators: {
    name: string;
    handle: string;
    imageSlug: string;
    imageExt?: string; // 'png' | 'jpg' - default png
    posts: number;
    views: string;
    engagements: string;
    engagementRate: string;
    reach: string;
    emv: string;
    followers: string;
    shares: string;
    likes: string;
    comments: number;
    /** Her influencer için 1 içerik: url yerel path (/ajet-content/xxx.jpg) veya harici link olabilir */
    featuredContent?: { type: 'image' | 'video'; url: string };
  }[];
  topContent: { views: string; engagements: string; handle: string }[];
  audience: {
    active: string;
    massFollowers: string;
    suspicious: string;
    female: string;
    male: string;
    other: string;
    ageGroups: { label: string; value: string }[];
    countries: { name: string; value: string }[];
  };
};

const AJET_CHALLENGE_PDF_DATA: AjetChallengePdfData = {
  description: `Havayolu deneyimi yalnızca bir ulaşım süreci değil, aynı zamanda keşif, ilham ve yeni hikâyelerin başlangıç noktasıdır. Bu bakış açısıyla kurgulanan kampanya kapsamında, AJet'in uçuş ağında yer alan dikkat çekici şehirler ve destinasyonlar, dijital dünyanın en güçlü anlatıcıları olan katılımcılar aracılığıyla geniş kitlelere ulaştırılmıştır.
"AAA dedirten destinasyonlar" temasıyla şekillenen kampanya; seyahat tutkusunu tetikleyen, keşif duygusunu harekete geçiren ve her biri kendine özgü hikâyeler barındıran şehirleri odağına almıştır. Katılımcıların özgün içerik üretim gücü sayesinde destinasyonlar yalnızca bir rota olarak değil, deneyimlenebilir bir yaşam alanı olarak anlatılmış; şehirlerin atmosferi, kültürü, gastronomisi ve yerel dokusu dijital hikâyeler aracılığıyla görünür kılınmıştır.`,
  performance: {
    posts: 414,
    creators: 65,
    views: '20.26M',
    engagements: '216.91K',
    engagementRate: '0.26%',
    reach: '13.86M',
    emv: '$1.3M',
    followers: '19.88M',
    shares: '20.66K',
    likes: '189.61K',
    comments: '1.16K',
    dateRange: '25 Tem 2024 - 9 Mar 2026',
  },
  creators: [
    // Influencer Profilleri – PDF "AJet Influencerlar(Yerli-Yabancı).pdf" içindeki listeden güncellenebilir. Her biri için public/ajet-influencers/ altında imageSlug.png veya imageSlug.jpg ekleyin.
    { name: 'Anıl Altan', handle: 'anilaltann', imageSlug: 'anil-altan', imageExt: 'png', posts: 9, views: '2.12M', engagements: '37.69K', engagementRate: '0.36%', reach: '1.67M', emv: '$173.4K', followers: '1.16M', shares: '3.56K', likes: '37.52K', comments: 163, featuredContent: { type: 'image', url: '/ajet-content/anil-1.webp' } },
    { name: 'Dilara Özkan', handle: 'uygunadimdoga', imageSlug: 'dilara-ozkan', imageExt: 'png', posts: 6, views: '783.71K', engagements: '16.56K', engagementRate: '0.38%', reach: '378.25K', emv: '$47.2K', followers: '726.63K', shares: '6.13K', likes: '16.27K', comments: 297, featuredContent: { type: 'image', url: '/ajet-content/dilara-1.webp' } },
    { name: 'Şeyma Büşra Gözdamga', handle: 'seymayolda', imageSlug: 'seyma-busra-gozdamga', imageExt: 'webp', posts: 6, views: '530.27K', engagements: '14.04K', engagementRate: '0.6%', reach: '271.68K', emv: '$39.1K', followers: '391.6K', shares: '843', likes: '13.79K', comments: 241, featuredContent: { type: 'image', url: '/ajet-content/seyma-1.webp' } },
    { name: 'Onurcan Çam', handle: 'onurcancamm', imageSlug: 'onurcan-cam', imageExt: 'webp', posts: 6, views: '709.31K', engagements: '11.12K', engagementRate: '0.38%', reach: '253.95K', emv: '$36.2K', followers: '486.5K', shares: '9.96K', likes: '10.88K', comments: 245, featuredContent: { type: 'image', url: '/ajet-content/onurcan-1.webp' } },
    { name: 'Gizem Yüksel', handle: 'orasiseninburasibenim', imageSlug: 'gizem-yuksel', imageExt: 'webp', posts: 8, views: '239.06K', engagements: '4.41K', engagementRate: '0.41%', reach: '148.64K', emv: '$21.8K', followers: '134.27K', shares: '160', likes: '3.61K', comments: 211, featuredContent: { type: 'image', url: '/ajet-content/gizem-1.webp' } },
    { name: 'Arda Türkmen', handle: 'ardaturkmen', imageSlug: 'arda_turkmen', imageExt: 'webp', posts: 1, views: '20.16K', engagements: '0', engagementRate: '0%', reach: '15K', emv: '$6.3K', followers: '–', shares: '0', likes: '0', comments: 0, featuredContent: { type: 'video', url: 'https://player.vimeo.com/video/1178953638?badge=0&autopause=0&player_id=0&app_id=58479' } },
  ],
  topContent: [
    { views: '465.97K', engagements: '5.59K', handle: 'anilaltann' },
    { views: '318.64K', engagements: '15.73K', handle: 'anilaltann' },
    { views: '309.89K', engagements: '3.3K', handle: 'anilaltann' },
    { views: '296.87K', engagements: '2.89K', handle: 'anilaltann' },
    { views: '274.89K', engagements: '4.94K', handle: 'onurcancamm' },
    { views: '232.76K', engagements: '2.78K', handle: 'uygunadimdoga' },
    { views: '228.98K', engagements: '6.39K', handle: 'uygunadimdoga' },
    { views: '204.13K', engagements: '6.27K', handle: 'seymayolda' },
    { views: '198.35K', engagements: '1.98K', handle: 'anilaltann' },
    { views: '188.29K', engagements: '2.23K', handle: 'onurcancamm' },
    { views: '176.92K', engagements: '3.89K', handle: 'anilaltann' },
    { views: '152.19K', engagements: '3.42K', handle: 'anilaltann' },
    { views: '150.88K', engagements: '2.79K', handle: 'onurcancamm' },
    { views: '148.78K', engagements: '2.46K', handle: 'uygunadimdoga' },
    { views: '145.45K', engagements: '4.6K', handle: 'uygunadimdoga' },
    { views: '116.54K', engagements: '2.49K', handle: 'seymayolda' },
    { views: '102.36K', engagements: '521', handle: 'seymayolda' },
    { views: '98.61K', engagements: '367', handle: 'anilaltann' },
    { views: '92.2K', engagements: '1.52K', handle: 'anilaltann' },
    { views: '72.92K', engagements: '1.02K', handle: 'onurcancamm' },
    { views: '71.87K', engagements: '1.83K', handle: 'uygunadimdoga' },
    { views: '66.39K', engagements: '1.04K', handle: 'seymayolda' },
    { views: '48.99K', engagements: '1.14K', handle: 'onurcancamm' },
    { views: '42.01K', engagements: '823', handle: 'orasiseninburasibenim' },
    { views: '35.3K', engagements: '1.02K', handle: 'orasiseninburasibenim' },
    { views: '29.86K', engagements: '152', handle: 'seymayolda' },
    { views: '22.75K', engagements: '84', handle: 'orasiseninburasibenim' },
    { views: '17.65K', engagements: '211', handle: 'uygunadimdoga' },
    { views: '15.67K', engagements: '1.78K', handle: 'seymayolda' },
    { views: '15.38K', engagements: '45', handle: 'onurcancamm' },
    { views: '13.49K', engagements: '69', handle: 'onurcancamm' },
    { views: '10.08K', engagements: '122', handle: 'uygunadimdoga' },
    { views: '7.21K', engagements: '96', handle: 'uygunadimdoga' },
    { views: '5.28K', engagements: '56', handle: 'orasiseninburasibenim' },
    { views: '4.61K', engagements: '165', handle: 'orasiseninburasibenim' },
  ],
  audience: {
    active: '79',
    massFollowers: '16',
    suspicious: '5',
    female: '71',
    male: '28',
    other: '1',
    ageGroups: [
      { label: '< 18', value: '4.18%' },
      { label: '18 - 24', value: '30.52%' },
      { label: '25 - 34', value: '43.96%' },
      { label: '35 - 44', value: '15.82%' },
      { label: '> 44', value: '5.52%' },
    ],
    countries: [
      { name: 'Turkey', value: '74.72%' },
      { name: 'Tunisia', value: '2.15%' },
      { name: 'Saudi Arabia', value: '2.13%' },
      { name: 'Iraq', value: '1.93%' },
    ],
  },
};

/** Kampanyaya katılan tüm influencer'lar (isim soyisim). imageSlug/imageExt varsa profil fotoğrafı, yoksa baş harf. PDF "AJet Influencerlar(Yerli-Yabancı).pdf" Influencer Profilleri sayfasından alındı. */
type ParticipatingInfluencer = { name: string; imageSlug?: string; imageExt?: string };
const AJET_CHALLENGE_ALL_INFLUENCERS: ParticipatingInfluencer[] = [
  // Listenin başına alınan isimler
  { name: 'Arda Türkmen', imageSlug: 'arda_turkmen', imageExt: 'webp' },
  { name: 'Alper Rende', imageSlug: 'alper_rende', imageExt: 'webp' },
  { name: 'Kaan Kazgan', imageSlug: 'kaan_kazgan', imageExt: 'webp' },
  { name: 'Damla Can', imageSlug: 'damla_can', imageExt: 'webp' },
  { name: 'Irene Pila', imageSlug: 'irena_pila', imageExt: 'webp' },
  { name: 'Leonardo Bellizzi', imageSlug: 'leonardo_bellizzi', imageExt: 'webp' },
  { name: 'Dorota Urbaniak', imageSlug: 'Dorota_Urbaniak', imageExt: 'webp' },
  // Profil fotoğrafı olanlar (public/ajet-influencers/)
  { name: 'Anıl Altan', imageSlug: 'anil-altan', imageExt: 'png' },
  { name: 'Dilara Özkan', imageSlug: 'dilara-ozkan', imageExt: 'png' },
  { name: 'Şeyma Büşra Gözdamga', imageSlug: 'seyma-busra-gozdamga', imageExt: 'webp' },
  { name: 'Onurcan Çam', imageSlug: 'onurcan-cam', imageExt: 'webp' },
  { name: 'Gizem Yüksel', imageSlug: 'gizem-yuksel', imageExt: 'webp' },
  // PDF'deki diğer tüm katılımcılar
  { name: 'Ömer Genç', imageSlug: 'omer_genc', imageExt: 'webp' },
  { name: 'Ekrem Düz', imageSlug: 'ekrem_duz', imageExt: 'webp' },
  { name: 'Fabio De Vivo', imageSlug: 'fabio_de_vivo', imageExt: 'webp' },
  { name: 'Buket Akdağ', imageSlug: 'buket_akdag', imageExt: 'webp' },
  { name: 'Asya Emhan', imageSlug: 'asya_emhan', imageExt: 'webp' },
  { name: 'Tuğba Kar', imageSlug: 'tugba_kar', imageExt: 'webp' },
  { name: 'Ayberk Oğuz', imageSlug: 'ayberk_oguz', imageExt: 'webp' },
  { name: 'Anıl Yakar', imageSlug: 'anıl_yakar', imageExt: 'webp' },
  { name: 'Özlem Akçin', imageSlug: 'ozlem_akcin', imageExt: 'webp' },
  { name: 'Selanur & Kaan', imageSlug: 'selanur_kaan', imageExt: 'webp' },
  { name: 'Kerem Akyol', imageSlug: 'kerem_akyol', imageExt: 'webp' },
  { name: 'Dilan Uçar', imageSlug: 'dilan_ucar', imageExt: 'webp' },
  { name: 'Şeyma Bal Bostancı', imageSlug: 'seyma_bal_bostanci', imageExt: 'webp' },
  { name: 'Zeynep Akdeniz', imageSlug: 'zeynep_akdeniz', imageExt: 'webp' },
  { name: 'Diego Fusina', imageSlug: 'diego_fusina', imageExt: 'webp' },
  { name: 'Melis Seray Özger', imageSlug: 'melis_seray_ozger', imageExt: 'webp' },
  { name: 'Şeyma Bilir', imageSlug: 'seyma_bilir', imageExt: 'webp' },
  { name: 'Sevil Mert Uzun', imageSlug: 'sevil_mert_uzun', imageExt: 'webp' },
  { name: 'Arzu Çetinkaya', imageSlug: 'arzu_cetin_kaya', imageExt: 'webp' },
  { name: 'Reşat Taman', imageSlug: 'resat_taman', imageExt: 'webp' },
  { name: 'Birten Çankaya', imageSlug: 'birten_cankaya', imageExt: 'webp' },
  { name: 'Başak Kablan', imageSlug: 'basak_kablan', imageExt: 'webp' },
  { name: 'Berkan Bilgiç', imageSlug: 'berkan_bilgic', imageExt: 'webp' },
  { name: 'Sabuha Öztürk', imageSlug: 'sabuha_ozturk', imageExt: 'webp' },
  { name: 'Erika E Arizona', imageSlug: 'erika_arizona', imageExt: 'webp' },
  { name: 'Deniz Özsoy', imageSlug: 'deniz_ozsoy', imageExt: 'webp' },
  { name: 'Valentina Raso', imageSlug: 'valentina_raso', imageExt: 'webp' },
  { name: 'Firdevs Topuz', imageSlug: 'firdevs_topuz', imageExt: 'webp' },
  { name: 'Muazzez K.', imageSlug: 'muazzez_k', imageExt: 'webp' },
  { name: 'Nurdan Gürel', imageSlug: 'nurdan_gurel', imageExt: 'webp' },
  { name: 'Mehmet Genç', imageSlug: 'mehmet_genc', imageExt: 'webp' },
  { name: 'Gökçen Ay', imageSlug: 'gokcen_ay', imageExt: 'webp' },
  { name: 'Merve Nur Uğuz', imageSlug: 'merve_nur_uguz', imageExt: 'webp' },
  { name: 'Hilal Kutluhan Atalay', imageSlug: 'hilal_kutluhan_atalay', imageExt: 'webp' },
  { name: 'Damla Göregen', imageSlug: 'damla_goregen', imageExt: 'webp' },
  { name: 'Gamze Biran Yenigün', imageSlug: 'gamze_biran', imageExt: 'webp' },
  { name: 'Sinem Parkan', imageSlug: 'sinem_parkan', imageExt: 'webp' },
  { name: 'Özlem Aslan', imageSlug: 'ozlem_aslan', imageExt: 'webp' },
  { name: 'Melis Tosun', imageSlug: 'melis_tosun', imageExt: 'webp' },
  { name: 'Gunay Mustafayeva', imageSlug: 'gunay_mustafayeva', imageExt: 'webp' },
  { name: 'Seda Pamukcu Oztürk', imageSlug: 'seda_pamukcu_ozturk', imageExt: 'webp' },
  { name: 'Ebrar Güler', imageSlug: 'ebrar_guler', imageExt: 'webp' },
  { name: 'Dilara & Taha', imageSlug: 'dilara_taha_tarhan', imageExt: 'webp' },
  { name: 'Ali Osman Evlice', imageSlug: 'ali_osman_evlice', imageExt: 'webp' },
  { name: 'Hızlı Gezginler', imageSlug: 'hızlı_gezginler', imageExt: 'webp' },
  { name: 'Aykan Hurma', imageSlug: 'aykan_hurma', imageExt: 'webp' },
  { name: 'Emre Evegi', imageSlug: 'emre_evegi', imageExt: 'webp' },
  { name: 'Elif Canan & Konur', imageSlug: 'elif_canan', imageExt: 'webp' },
  { name: 'Nilay & Mehmet Can', imageSlug: 'nilah_mehmet_can', imageExt: 'webp' },
  { name: 'Merve Serap Uçak', imageSlug: 'merve_serap_ucak', imageExt: 'webp' },
  { name: 'Bahadır Çakar', imageSlug: 'bahadır_cakar', imageExt: 'webp' },
];

const CAMPAIGNS: CampaignData[] = [
  {
    id: '1',
    title: 'AAAAA JET Challange',
    date: 'Eylül - Ekim 2025',
    kpis: { campaigns: 3, influencers: 6, engagement: '2.4M', value: '₺1.2M' },
    influencers: [
      { name: 'Anıl Altan', role: 'Katılımcı' },
      { name: 'Dilara Özkan', role: 'Katılımcı' },
      { name: 'Şeyma Büşra Gözdamga', role: 'Katılımcı' },
      { name: 'Onurcan Çam', role: 'Katılımcı' },
      { name: 'Gizem Yüksel', role: 'Katılımcı' },
    ],
    engagementData: [
      { month: 'Oca', value: 42 },
      { month: 'Şub', value: 58 },
      { month: 'Mar', value: 71 },
      { month: 'Nis', value: 65 },
      { month: 'May', value: 89 },
      { month: 'Haz', value: 94 },
      { month: 'Tem', value: 88 },
      { month: 'Ağu', value: 92 },
      { month: 'Eyl', value: 76 },
      { month: 'Eki', value: 81 },
      { month: 'Kas', value: 95 },
      { month: 'Ara', value: 98 },
    ],
    impact: { mediaValue: '₺847.000', reach: '4.2M', engagementRate: '%5.7' },
    pdfData: AJET_CHALLENGE_PDF_DATA,
  },
  {
    id: '2',
    title: 'Kış Uçuşları Tanıtımı',
    date: 'Aralık 2025',
    kpis: { campaigns: 3, influencers: 4, engagement: '1.8M', value: '₺920K' },
    influencers: [
      { name: 'Gizem Karaca', role: 'Oyuncu' },
      { name: 'Cemre Baysel', role: 'Oyuncu' },
      { name: 'Gökhan Alkan', role: 'Oyuncu' },
      { name: 'Serkay Tütüncü', role: 'Oyuncu' },
    ],
    engagementData: [
      { month: 'Oca', value: 35 },
      { month: 'Şub', value: 48 },
      { month: 'Mar', value: 52 },
      { month: 'Nis', value: 61 },
      { month: 'May', value: 55 },
      { month: 'Haz', value: 72 },
      { month: 'Tem', value: 88 },
      { month: 'Ağu', value: 85 },
      { month: 'Eyl', value: 91 },
      { month: 'Eki', value: 78 },
      { month: 'Kas', value: 95 },
      { month: 'Ara', value: 98 },
    ],
    impact: { mediaValue: '₺612.000', reach: '3.1M', engagementRate: '%4.2' },
  },
  {
    id: '3',
    title: 'Yeni Rota Kampanyası',
    date: 'Eylül 2025',
    kpis: { campaigns: 3, influencers: 5, engagement: '3.1M', value: '₺1.5M' },
    influencers: [
      { name: 'Gizem Karaca', role: 'Oyuncu' },
      { name: 'Cemre Baysel', role: 'Oyuncu' },
      { name: 'Gülper Özdemir', role: 'Oyuncu' },
      { name: 'Gökhan Alkan', role: 'Oyuncu' },
      { name: 'Mehmet Aykaç', role: 'Oyuncu' },
    ],
    engagementData: [
      { month: 'Oca', value: 28 },
      { month: 'Şub', value: 45 },
      { month: 'Mar', value: 62 },
      { month: 'Nis', value: 58 },
      { month: 'May', value: 75 },
      { month: 'Haz', value: 82 },
      { month: 'Tem', value: 88 },
      { month: 'Ağu', value: 95 },
      { month: 'Eyl', value: 99 },
      { month: 'Eki', value: 85 },
      { month: 'Kas', value: 78 },
      { month: 'Ara', value: 72 },
    ],
    impact: { mediaValue: '₺1.02M', reach: '5.4M', engagementRate: '%6.8' },
  },
];

// Tüm kampanyaların toplam verileri (görsel: Kampanya Performans Özeti)
const TOTAL_KPIS = {
  campaigns: 7,
  influencers: 65,
  engagement: '216.91K',
  value: '$1.3M',
};

const TOTAL_ENGAGEMENT_DATA = CAMPAIGNS[0].engagementData.map((d, i) => ({
  month: d.month,
  value: Math.round(
    CAMPAIGNS.reduce((sum, c) => sum + c.engagementData[i].value, 0) / CAMPAIGNS.length
  ),
}));

const TOTAL_IMPACT = {
  mediaValue: '₺2.48M',
  reach: '12.7M',
  engagementRate: '%5.6',
};

export default function AjetPage() {
  const { translations } = useLanguage();
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignData>(CAMPAIGNS[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-12 pb-20">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white p-4">
            <img
              src="/marka-logolari/ajet_logo.png"
              alt="AJet"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-white md:text-3xl">AJet İş Birliği Raporu</h1>
        </div>

        {/* KPI Cards - Tüm kampanyaların toplamı */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Toplam Kampanya</p>
            <p className="mt-1 text-3xl font-bold text-white">{TOTAL_KPIS.campaigns}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Katılımcılar</p>
            <p className="mt-1 text-3xl font-bold text-white">{TOTAL_KPIS.influencers}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Toplam Etkileşim</p>
            <p className="mt-1 text-3xl font-bold text-sky-400">{TOTAL_KPIS.engagement}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Katma Değer (EMV)</p>
            <p className="mt-1 text-3xl font-bold text-emerald-400">{TOTAL_KPIS.value}</p>
          </div>
        </div>

        {/* Kampanya içeriği (seçim kutusu kaldırıldı) */}
        <section className="mb-12">
          {selectedCampaign.pdfData ? (
            <div className="space-y-10">
              {/* Kampanya Detayları */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Kampanya Detayları</h3>
                <p className="whitespace-pre-line rounded-xl border border-white/10 bg-zinc-900/40 p-6 text-zinc-300">
                  {selectedCampaign.pdfData.description}
                </p>
              </div>

              {/* Performans Özeti */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">Performans Özeti</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                    <p className="text-xs text-zinc-400">Posts</p>
                    <p className="text-xl font-bold text-white">{selectedCampaign.pdfData.performance.posts}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                    <p className="text-xs text-zinc-400">Katılımcılar</p>
                    <p className="text-xl font-bold text-white">{selectedCampaign.pdfData.performance.creators}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                    <p className="text-xs text-zinc-400">Views</p>
                    <p className="text-xl font-bold text-sky-400">{selectedCampaign.pdfData.performance.views}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                    <p className="text-xs text-zinc-400">Engagements</p>
                    <p className="text-xl font-bold text-white">{selectedCampaign.pdfData.performance.engagements}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                    <p className="text-xs text-zinc-400">Engagement Rate</p>
                    <p className="text-xl font-bold text-amber-400">{selectedCampaign.pdfData.performance.engagementRate}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                    <p className="text-xs text-zinc-400">Reach</p>
                    <p className="text-xl font-bold text-white">{selectedCampaign.pdfData.performance.reach}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                    <p className="text-xs text-zinc-400">EMV</p>
                    <p className="text-xl font-bold text-emerald-400">{selectedCampaign.pdfData.performance.emv}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-4">
                    <p className="text-xs text-zinc-400">Tarih Aralığı</p>
                    <p className="text-sm font-medium text-white">{selectedCampaign.pdfData.performance.dateRange}</p>
                  </div>
                </div>
              </div>

              {/* En çok görüntülenme alan katılımcılar */}
              <div>
                <h3 className="mb-4 text-lg font-semibold text-white">En Çok Görüntülenme Alan Katılımcılar</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {selectedCampaign.pdfData.creators.slice(0, 6).map((c) => (
                    <div key={c.handle} className="rounded-xl border border-white/10 bg-zinc-900/40 p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <CreatorAvatar name={c.name} imageSlug={c.imageSlug} imageExt={c.imageExt} size={56} />
                        <div>
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
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Öne Çıkan İçerikler - Rixos ile aynı playlist yapısı */}
              <div className="mt-10">
                <h3 className="mb-4 text-lg font-semibold text-white">Öne Çıkan İçerikler</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {[
                    { src: 'https://player.vimeo.com/video/1178945644?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Anıl Altan' },
                    { src: 'https://player.vimeo.com/video/1178950703?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Dilara Özkan' },
                    { src: 'https://player.vimeo.com/video/1178955906?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Gizem Yüksel' },
                    { src: 'https://player.vimeo.com/video/1178958369?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Onurcan Çam' },
                    { src: 'https://player.vimeo.com/video/1178957436?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Şeyma Büşra Gözdamga' },
                    { src: 'https://player.vimeo.com/video/1178953638?badge=0&autopause=0&player_id=0&app_id=58479', label: 'Arda Türkmen' },
                  ].map(({ src, label }) => (
                    <div key={src} className="flex flex-col items-center gap-2">
                      <div className="w-full max-w-[200px] overflow-hidden rounded-xl border border-white/10 bg-zinc-800">
                        <div className="aspect-[9/16] w-full">
                          <VideoWithFirstFrame src={src} />
                        </div>
                      </div>
                      <p className="text-center text-sm font-medium text-white">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kampanyaya Katılan Tüm Influencer'lar - appendix: 3 sütun grid liste */}
              <div className="mt-12 border-t border-white/10 pt-10">
                <h3 className="mb-6 text-lg font-semibold text-white">Kampanyaya Katılan Tüm Katılımcılar</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                  {AJET_CHALLENGE_ALL_INFLUENCERS.map((person) => (
                    <div key={person.name} className="flex flex-col items-center gap-2">
                      {person.imageSlug ? (
                        <CreatorAvatar name={person.name} imageSlug={person.imageSlug} imageExt={person.imageExt} size={64} />
                      ) : (
                        <div
                          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-600 to-sky-800 text-xl font-bold text-white"
                          aria-hidden
                        >
                          {person.name.charAt(0)}
                        </div>
                      )}
                      <p className="text-center text-sm font-medium text-white">{person.name}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <>
              <h3 className="mb-6 text-lg font-semibold text-white">Kampanyaya Katılan Katılımcılar</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {selectedCampaign.influencers.map((inf) => (
                  <div
                    key={inf.name}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-zinc-900/40 p-4"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-600 to-sky-800 text-lg font-bold text-white">
                      {inf.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{inf.name}</p>
                      <p className="text-sm text-zinc-400">{inf.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Kampanyaya katılan tüm katılımcılar (pdfData yoksa): 3 sütun grid */}
          {!selectedCampaign.pdfData && selectedCampaign.influencers.length > 0 && (
            <div className="mt-12 border-t border-white/10 pt-10">
              <h3 className="mb-6 text-lg font-semibold text-white">Kampanyaya Katılan Tüm Katılımcılar</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                {selectedCampaign.influencers.map((inf) => (
                  <div key={inf.name} className="flex flex-col items-center gap-2">
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-600 to-sky-800 text-xl font-bold text-white"
                      aria-hidden
                    >
                      {inf.name.charAt(0)}
                    </div>
                    <p className="text-center text-sm font-medium text-white">{inf.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Content Gallery - sadece pdfData olmayan kampanyalarda göster */}
        {!selectedCampaign.pdfData && (
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-semibold text-white">Videolu ve Fotoğraflı İçerikler</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="group relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-zinc-800"
              >
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-900/30 to-zinc-900">
                  <span className="text-4xl text-zinc-500">🎬</span>
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <p className="text-sm font-medium text-white">
                    {i % 2 === 0 ? 'Video İçerik' : 'Fotoğraf İçerik'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
        )}

        {/* Navigation */}
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
