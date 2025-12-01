'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

import { CTASection } from '@/components/CTASection';
import { ServiceCard } from '@/components/ServiceCard';
import { useLanguage } from '@/context/LanguageContext';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/join-pr' : '';

const portfolioImages = [
  { src: '/ai_web_e_ticaret.png', alt: 'E-ticaret', title: 'E Ticaret Altyapıları' },
  { src: '/ai_web_isigorta_acentası.png', alt: 'Sigorta Acentası', title: 'Sigorta Acenta Yazılımları' },
  { src: '/ai_web_kurumsal_website.png', alt: 'Kurumsal Website', title: 'Kurumsal Web Siteler' },
  { src: '/ai_web_seyahat acentası.png', alt: 'Seyahat Acentası', title: 'Seyahat Acentası Altyapıları' },
];

const mobileImages = [
  { src: '/ai_web_mobil1.png', alt: 'Mobil Uygulama 1' },
  { src: '/ai_web_mobil2.png', alt: 'Mobil Uygulama 2' },
  { src: '/ai_web_mobil3.png', alt: 'Mobil Uygulama 3' },
  { src: '/ai_web_mobil4.png', alt: 'Mobil Uygulama 4' },
];

export function JoinLabAiView() {
  const { translations } = useLanguage();
  const page = translations.pages.joinLabAi;
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);

  const nextMobile = () => {
    setCurrentMobileIndex((prev) => (prev + 1) % mobileImages.length);
  };

  const prevMobile = () => {
    setCurrentMobileIndex((prev) => (prev - 1 + mobileImages.length) % mobileImages.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMobileIndex((prev) => (prev + 1) % mobileImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-16">
      <section className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 via-cyan-700 to-blue-800 p-8 shadow-2xl shadow-teal-900/40 md:mt-10 md:p-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.25),_transparent_60%)]" />
        <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-[0.38em] text-teal-100">Join Lab AI</span>
            <h1 className="text-[32px] font-semibold leading-tight text-white sm:text-[36px] md:text-[42px] lg:text-[48px]">
              {page.hero.title}
            </h1>
            <p className="max-w-2xl text-base text-teal-50/90 sm:text-lg">{page.hero.subtitle}</p>
            <p className="max-w-3xl text-sm text-teal-50/80 sm:text-base">{page.hero.description}</p>
          </div>
          <div className="flex-1 md:flex md:justify-end">
            <div className="relative mx-auto mt-6 w-full max-w-[22rem] sm:max-w-[24rem] md:mt-0 md:ml-auto md:max-w-[26rem] lg:max-w-[28rem]">
              <Image
                src={`${BASE_PATH}/ai_web_banner.png`}
                alt="Join AI Lab hero"
                width={800}
                height={500}
                priority
                className="h-full w-full rounded-[28px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 md:p-10">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">{page.about.title}</h2>
        <div className="prose prose-invert max-w-none">
          <p className="whitespace-pre-line text-base leading-relaxed text-zinc-300 sm:text-lg">
            {page.about.description}
          </p>
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">{translations.common.menu.joinLabAi}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {page.services.map((service, index) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              accent={index % 2 === 0 ? 'teal' : 'sky'}
            />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">AI destekli Web Siteleri ve Acenta yazılımları</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {portfolioImages.map((image, index) => (
            <div key={index} className="flex flex-col gap-4">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50">
                <Image
                  src={`${BASE_PATH}${image.src}`}
                  alt={image.alt}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h3 className="text-center text-lg font-semibold text-white">{image.title}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 rounded-3xl border border-white/10 bg-zinc-950/70 p-10">
        <h3 className="text-2xl font-semibold text-white">{page.process.title}</h3>
        <div className="grid gap-6 md:grid-cols-5">
          {page.process.steps.map((step, index) => (
            <div key={step.title} className="relative rounded-2xl border border-white/10 bg-zinc-900/70 p-6">
              <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 via-sky-500 to-blue-500 text-sm font-semibold text-white shadow-md shadow-sky-500/30">
                {index + 1}
              </div>
              <h4 className="text-lg font-semibold text-white">{step.title}</h4>
              <p className="mt-3 text-sm text-zinc-400">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl border border-white/10 bg-zinc-950/70 p-8 md:grid-cols-[1fr_1fr] md:p-10">
        <div className="relative flex items-center justify-center">
          <button
            onClick={prevMobile}
            className="absolute left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20 md:left-4"
            aria-label="Önceki görsel"
          >
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="relative mx-auto w-full max-w-[280px] overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentMobileIndex * 100}%)` }}
            >
              {mobileImages.map((image, index) => (
                <div key={index} className="relative min-w-full">
                  <Image
                    src={`${BASE_PATH}${image.src}`}
                    alt={image.alt}
                    width={400}
                    height={800}
                    className="h-auto w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={nextMobile}
            className="absolute right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20 md:right-4"
            aria-label="Sonraki görsel"
          >
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col justify-center space-y-6">
          <h3 className="text-3xl font-semibold text-white md:text-4xl">{page.mobile.title}</h3>
          <p className="text-lg leading-relaxed text-zinc-300">{page.mobile.description}</p>
        </div>
      </section>

      <CTASection title={page.cta.title} description={page.cta.description} buttonLabel={page.cta.button} />
    </div>
  );
}

