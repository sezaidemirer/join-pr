'use client';
/* eslint-disable @next/next/no-img-element */

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

interface ProjectDetailViewProps {
  projectSlug: string;
  subProjectIndex?: number;
}

export function ProjectDetailView({ projectSlug, subProjectIndex = 0 }: ProjectDetailViewProps) {
  const { translations } = useLanguage();
  const router = useRouter();
  const [activeSubProjectIndex] = useState(subProjectIndex);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [activeReportIndex, setActiveReportIndex] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const projects = translations.homepage.projects;
  const casesData = translations.homepage.cases;
  const defaultPressArticles = (casesData.cards as Array<{ title: string; category: string; description: string; image?: string }>).slice(0, 3);

  // Projeyi bul
  const projectData = Object.values(projects.items).find((item: any) => item.slug === projectSlug) as any;

  // Proje değiştiğinde slider indekslerini sıfırla
  useEffect(() => {
    setActiveGalleryIndex(0);
    setActiveReportIndex(0);
  }, [activeSubProjectIndex]);

  // ESC tuşu ile modal kapatma
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isReportModalOpen) {
        setIsReportModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isReportModalOpen]);

  if (!projectData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">{translations.common.project.projectNotFound}</h1>
          <Link href="/" className="mt-4 inline-block text-teal-400 hover:text-teal-300">
            {translations.common.project.returnToHome}
          </Link>
        </div>
      </div>
    );
  }

  // Alt projeler varsa onları kullan, yoksa default veriyi kullan
  const subProjects = projectData.subProjects || [];
  const hasMultipleProjects = subProjects.length > 1;
  const currentProject = subProjects.length > 0 ? subProjects[activeSubProjectIndex] : projectData;
  // Rapor görselleri tek sayfa: sadece ilk görseli göster
  const rawReportImages = currentProject.report?.images || [];
  const reportImages = rawReportImages.length ? [rawReportImages[0]] : [];
  
  // Her alt projenin kendi basın yansımaları varsa kullan, yoksa default kullan
  const pressArticles = currentProject.press || defaultPressArticles;
  // Foto galeri geçici olarak gizli (ileride açılacak)
  const showGallery = false;

  const handlePrevProject = () => {
    const newIndex = activeSubProjectIndex === 0 ? subProjects.length - 1 : activeSubProjectIndex - 1;
    router.push(`/projects/${projectSlug}/${newIndex + 1}`);
  };

  const handleNextProject = () => {
    const newIndex = activeSubProjectIndex === subProjects.length - 1 ? 0 : activeSubProjectIndex + 1;
    router.push(`/projects/${projectSlug}/${newIndex + 1}`);
  };

  return (
    <div className="flex flex-col gap-16 lg:gap-20">
      {/* Hero Section with Video */}
      <section className="relative">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <span>←</span> {translations.common.project.backToHome}
          </Link>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-teal-400">
              Proje
            </span>
            {hasMultipleProjects && (
              <span className="text-sm text-zinc-500">
                {activeSubProjectIndex + 1} / {subProjects.length}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold text-white md:text-6xl">{projectData.title}</h1>
          <p className="max-w-3xl text-lg text-zinc-300 md:text-xl">{projectData.description}</p>
        </div>

        {/* Video Player with Navigation */}
        <div className="mt-10 relative">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
            <div className="relative w-full pt-[56.25%]">
              {currentProject.videoUrl ? (
                <iframe
                  key={activeSubProjectIndex}
                  className="absolute inset-0 h-full w-full"
                  src={currentProject.videoUrl}
                  title={`${currentProject.title || projectData.title} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                  <div className="text-center space-y-4">
                    <span className="text-8xl">🎬</span>
                    <p className="text-zinc-400">{translations.common.project.videoComingSoon}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Arrows */}
          <>
            <button
              onClick={handlePrevProject}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-teal-500 text-white shadow-2xl shadow-teal-500/50 transition-all hover:bg-teal-600 hover:scale-110"
              style={{ zIndex: 9999 }}
              aria-label={translations.common.project.previousProject}
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextProject}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex h-16 w-16 items-center justify-center rounded-full bg-teal-500 text-white shadow-2xl shadow-teal-500/50 transition-all hover:bg-teal-600 hover:scale-110"
              style={{ zIndex: 9999 }}
              aria-label={translations.common.project.nextProject}
            >
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        </div>
      </section>

      {/* Participants and Press */}
      <section className="grid gap-8 lg:grid-cols-2">
        {/* Participants */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-semibold text-white">{translations.common.project.participantsTitle}</h2>
          <div className="space-y-4">
            {currentProject.participants?.map((participant: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-zinc-900/50 p-4 transition-all hover:border-teal-500/30 hover:bg-zinc-900"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-teal-500/50 shadow-lg shadow-teal-500/20">
                  {participant.image ? (
                    <Image
                      src={`${BASE_PATH}${participant.image}`}
                      alt={participant.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                      unoptimized
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                  {participant.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{participant.name}</h3>
                  <p className="text-sm text-zinc-400">{participant.role}</p>
                </div>
                <div className="flex gap-2">
                  {participant.social.instagram && (
                    <a
                      href={participant.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-all hover:bg-teal-500/20 hover:text-teal-400"
                      aria-label="Instagram"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  )}
                  {participant.social.youtube && (
                    <a
                      href={participant.social.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-all hover:bg-teal-500/20 hover:text-teal-400"
                      aria-label="YouTube"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                  )}
                  {participant.social.twitter && (
                    <a
                      href={participant.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-all hover:bg-teal-500/20 hover:text-teal-400"
                      aria-label="Twitter"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Press Coverage */}
        <div className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-semibold text-white">{translations.common.project.pressReflections}</h2>
          <div className="space-y-4">
            {pressArticles.map((article: { title: string; category: string; description: string; image?: string }, idx: number) => {
              const articleSlug = slugify(article.title);
              return (
                <Link
                key={idx}
                  href={`/haber/${articleSlug}`}
                  className="group block rounded-2xl border border-white/5 bg-zinc-900/50 p-4 transition-all hover:border-teal-500/30 hover:bg-zinc-900"
              >
                <div className="flex gap-4">
                  {article.image && (
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={`${BASE_PATH}${article.image}`}
                        alt={article.title}
                        width={80}
                        height={80}
                        unoptimized
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <span className="mb-1 inline-block text-xs font-semibold uppercase tracking-wider text-teal-400">
                      {article.category}
                    </span>
                    <h3 className="font-semibold text-white line-clamp-2">{article.title}</h3>
                    <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{article.description}</p>
                  </div>
                </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Report */}
      {currentProject.report && (
        <section className="grid gap-8 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 shadow-xl md:grid-cols-[0.9fr_1.1fr] md:p-10">
          {/* Carousel - Left Side */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-r from-teal-500/20 via-sky-500/20 to-blue-600/20 blur-3xl" />
            
            {/* Main Image */}
            <div className="relative w-full">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="relative w-full overflow-hidden rounded-3xl border border-white/5 transition-all hover:border-teal-500/50 hover:scale-[1.02] cursor-pointer"
              >
              <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                  {reportImages.length > 0 ? (
                    <Image
                      key={`${currentProject.title}-${activeReportIndex}`}
                      src={`${BASE_PATH}${reportImages[activeReportIndex]}`}
                      alt={`${currentProject.title || projectData.title} rapor görseli`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={false}
                    />
                  ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <span className="text-8xl">📊</span>
                    <p className="text-zinc-400">Rapor görselleri yakında</p>
                  </div>
                </div>
                  )}
              </div>
              </button>

              {/* Navigation Arrows */}
              {currentProject.report.images && currentProject.report.images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveReportIndex((prev) => (prev === 0 ? currentProject.report.images.length - 1 : prev - 1));
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110 z-10"
                    aria-label={translations.common.project.previousImage}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveReportIndex((prev) => (prev === currentProject.report.images.length - 1 ? 0 : prev + 1));
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110 z-10"
                    aria-label={translations.common.project.nextImage}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image Counter */}
              {currentProject.report.images && currentProject.report.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur-sm z-10">
                  {activeReportIndex + 1} / {currentProject.report.images.length}
                </div>
              )}
            </div>
          </div>

          {/* Content - Right Side */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-teal-400 w-fit">
              {translations.common.project.projectReport}
            </div>
            <h2 className="text-3xl font-semibold text-white md:text-4xl">{currentProject.report.title}</h2>
            <p className="text-base leading-relaxed text-zinc-300 md:text-lg">{currentProject.report.description}</p>
          </div>
        </section>
      )}

      {/* Gallery (geçici olarak gizli) */}
      {showGallery && (
      <section className="space-y-6">
        <h2 className="text-3xl font-semibold text-white">{translations.common.project.photoGallery}</h2>
        
        {/* Main Image */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 shadow-2xl">
          <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <span className="text-8xl">📸</span>
                <p className="text-zinc-400">{translations.common.project.photosComingSoon}</p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {currentProject.gallery && currentProject.gallery.length > 1 && (
            <>
              <button
                onClick={() => setActiveGalleryIndex((prev) => (prev === 0 ? currentProject.gallery.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
                aria-label={translations.common.project.previousPhoto}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setActiveGalleryIndex((prev) => (prev === currentProject.gallery.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:scale-110"
                aria-label={translations.common.project.nextPhoto}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Grid */}
        {currentProject.gallery && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {currentProject.gallery.map((img: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveGalleryIndex(idx)}
              className={`group relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                idx === activeGalleryIndex
                  ? 'border-teal-500 shadow-lg shadow-teal-500/30'
                  : 'border-white/10 hover:border-teal-500/50'
              }`}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-800">
                <span className="text-3xl">📷</span>
              </div>
            </button>
            ))}
          </div>
        )}
      </section>
      )}

      {/* CTA */}
      <section className="mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-zinc-950/70 px-8 py-12 text-center shadow-xl">
        <h2 className="mb-4 text-3xl font-semibold text-white">{translations.common.project.projectCta}</h2>
        <p className="mb-8 text-zinc-400">
          {translations.common.project.projectCtaDescription}
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-blue-600 px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-teal-500/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/50"
        >
          {translations.common.project.contactButton}
        </Link>
      </section>

      {/* Report Image Modal */}
      {isReportModalOpen && reportImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setIsReportModalOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute -right-4 -top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black transition-all hover:bg-zinc-200 hover:scale-110 shadow-lg"
              aria-label={translations.common.project.close}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Image */}
            <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl">
              <Image
                src={`${BASE_PATH}${reportImages[activeReportIndex]}`}
                alt={`${currentProject.title || projectData.title} rapor görseli`}
                width={1200}
                height={900}
                className="h-auto w-auto max-h-[90vh] max-w-[90vw] object-contain"
                unoptimized
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

