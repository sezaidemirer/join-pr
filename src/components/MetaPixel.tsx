'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { META_PIXEL_ID } from '@/lib/meta-pixel';

export function MetaPixel() {
  const pathname = usePathname();
  const initializedRef = useRef(false);
  const lastTrackedPathRef = useRef<string | null>(null);
  const attemptRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;
    attemptRef.current = 0;

    const run = () => {
      if (cancelled) return;
      const fbq = (window as unknown as { fbq?: (...args: any[]) => void }).fbq;

      // fbq henüz hazır değilse kısa süre bekleyip tekrar dene
      if (typeof fbq !== 'function') {
        attemptRef.current += 1;
        if (attemptRef.current <= 20) {
          window.setTimeout(run, 250);
        }
        return;
      }

      // init sadece 1 kere
      if (!initializedRef.current) {
        initializedRef.current = true;
        fbq('init', META_PIXEL_ID);
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.info('[JoinPR Meta Pixel] initialized', META_PIXEL_ID);
        }
      }

      // Aynı pathname için duplicate PageView gönderme
      if (lastTrackedPathRef.current === pathname) return;
      lastTrackedPathRef.current = pathname;

      fbq('track', 'PageView');
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.info('[JoinPR Meta Pixel] PageView tracked', pathname);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <>
      <Script
        id="meta-pixel-base"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

