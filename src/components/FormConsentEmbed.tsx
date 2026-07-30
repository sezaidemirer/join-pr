'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  GOOGLE_ADS_FORM_CONVERSION_SEND_TO,
  explainZohoMessageForConversion,
  isGoogleAdsConversionDebugEnabled,
  isZohoFormSuccessfulSubmitMessage,
  tryFireGoogleAdsLandingFormConversion,
} from '@/lib/google-ads-landing-conversion';
import { tryFireMetaPixelLead } from '@/lib/meta-pixel';

type FormConsentEmbedProps = {
  src: string;
  ariaLabel: string;
  title?: string;
  iframeHeight?: number;
  /** true: yalnızca reklam landing sayfalarında Google Ads conversion (başarılı Zoho gönderimi). /iletisim vb. için kullanmayın. */
  trackGoogleAdsConversion?: boolean;
  /** true ise başarılı gönderimde kullanıcıyı teşekkür sayfasına yönlendirir. */
  redirectOnSuccess?: boolean;
  /** Başarılı gönderim sonrası yönlendirme patikası. */
  thankYouPath?: string;
};

export function FormConsentEmbed({
  src,
  ariaLabel,
  title = 'Join CRM Form',
  iframeHeight = 500,
  trackGoogleAdsConversion = false,
  redirectOnSuccess = true,
  thankYouPath = '/tesekkurler',
}: FormConsentEmbedProps) {
  const router = useRouter();
  const conversionFiredRef = useRef(false);
  const metaLeadFiredRef = useRef(false);
  const successHandledRef = useRef(false);
  /** Zoho çoğu kurulumda parent'a zf_submitform göndermez; teşekkür sayfası iframe içinde yeni doküman yüklerse 2. load yakalanır */
  const iframeLoadCountRef = useRef(0);
  const embedMountedAtRef = useRef<number | null>(null);
  if (embedMountedAtRef.current === null) embedMountedAtRef.current = Date.now();
  const pipeOnlyMessageLoggedRef = useRef(false);

  useEffect(() => {
    if (!trackGoogleAdsConversion && !redirectOnSuccess) return;

    const debug = isGoogleAdsConversionDebugEnabled();
    if (debug && typeof window !== 'undefined') {
      console.info(
        '[JoinPR Google Ads] Debug: Zoho iframe postMessage logları açık. Kapat: URL ?joinpr_ads_debug kaldır veya localStorage.removeItem("joinpr_ads_debug").',
      );
      console.info(
        '[JoinPR Google Ads] Şu an path:',
        window.location.pathname,
        '— conversion sadece /reklam/* ve /clinic-reklam-ajansi-performans-yonetimi için.',
      );
    }

    const onMessage = (event: MessageEvent) => {
      const diagnosis = explainZohoMessageForConversion(event);
      const isPipeHeightOnly =
        typeof event.data === 'string' &&
        event.data.includes('|') &&
        !String(event.data).trim().startsWith('{');
      if (debug && diagnosis.originOk && !isPipeHeightOnly) {
        console.info('[JoinPR Google Ads] Zoho postMessage:', {
          wouldConvert: diagnosis.wouldConvert,
          reason: diagnosis.reason,
          dataPreview: diagnosis.dataPreview,
        });
      }
      if (
        debug &&
        diagnosis.originOk &&
        isPipeHeightOnly &&
        !pipeOnlyMessageLoggedRef.current
      ) {
        pipeOnlyMessageLoggedRef.current = true;
        console.warn(
          '[JoinPR Google Ads] Zoho şu ana kadar yalnızca iframe yükseklik (pipe) mesajı gönderiyor; zf_submitform JSON gelmiyorsa Post Message Tracking kapalı olabilir. Gönderim sonrası teşekkür sayfası iframe’i yeniden yüklerse 2. load ile yedek conversion denenecek.',
        );
      }

      if (!isZohoFormSuccessfulSubmitMessage(event)) return;
      if (successHandledRef.current) return;

      let result: ReturnType<typeof tryFireGoogleAdsLandingFormConversion> = 'wrong_path';
      let metaResult: ReturnType<typeof tryFireMetaPixelLead> = 'ssr';
      if (trackGoogleAdsConversion) {
        result = tryFireGoogleAdsLandingFormConversion(conversionFiredRef);
        metaResult = tryFireMetaPixelLead(metaLeadFiredRef);
      }
      if (debug) {
        if (trackGoogleAdsConversion) {
          console.info('[JoinPR Google Ads] tryFireGoogleAdsLandingFormConversion →', result, {
            send_to: GOOGLE_ADS_FORM_CONVERSION_SEND_TO,
          });
          console.info('[JoinPR Meta Pixel] tryFireMetaPixelLead →', metaResult);
          if (result === 'fired') {
            console.info(
              '[JoinPR Google Ads] Network sekmesinde "conversion" veya "googleadservices" / "pagead" filtreleyin; istek bazen "AW-" metnini URL’de göstermeyebilir.',
            );
          }
          if (result === 'no_gtag') {
            console.warn(
              '[JoinPR Google Ads] gtag yok — GoogleAnalytics bileşeni yüklenmediyse conversion gönderilemez.',
            );
          }
          if (result === 'wrong_path') {
            console.warn('[JoinPR Google Ads] Path reklam landing değil; kasıtlı olarak atlandı.');
          }
        }
        if (redirectOnSuccess) {
          console.info('[JoinPR Form] Başarılı gönderim algılandı, yönlendirme →', thankYouPath);
        }
      }
      successHandledRef.current = true;
      if (redirectOnSuccess) router.push(thankYouPath);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [trackGoogleAdsConversion, redirectOnSuccess, router, thankYouPath]);

  const handleIframeLoad = () => {
    if (!trackGoogleAdsConversion && !redirectOnSuccess) return;
    iframeLoadCountRef.current += 1;
    const loadN = iframeLoadCountRef.current;
    const msSinceMount = Date.now() - (embedMountedAtRef.current ?? 0);
    /** İlk saniyelerdeki çift yönlendirme / zincir yüklemelerinde yanlış conversion önleme */
    const MIN_MS_BEFORE_LOAD_FALLBACK = 3500;
    if (loadN < 2) return;
    if (msSinceMount < MIN_MS_BEFORE_LOAD_FALLBACK) return;
    if (successHandledRef.current) return;

    let result: ReturnType<typeof tryFireGoogleAdsLandingFormConversion> = 'wrong_path';
    let metaResult: ReturnType<typeof tryFireMetaPixelLead> = 'ssr';
    if (trackGoogleAdsConversion) {
      result = tryFireGoogleAdsLandingFormConversion(conversionFiredRef);
      metaResult = tryFireMetaPixelLead(metaLeadFiredRef);
    }
    const debug = isGoogleAdsConversionDebugEnabled();
    if (debug) {
      if (trackGoogleAdsConversion) {
        console.info(
          '[JoinPR Google Ads] iframe onLoad yedek (yük #' +
            loadN +
            ', mount+' +
            msSinceMount +
            'ms) →',
          result,
          { send_to: GOOGLE_ADS_FORM_CONVERSION_SEND_TO },
        );
        console.info('[JoinPR Meta Pixel] iframe onLoad yedek →', metaResult);
      }
      if (redirectOnSuccess) {
        console.info('[JoinPR Form] iframe onLoad yedekle yönlendirme →', thankYouPath);
      }
    }
    successHandledRef.current = true;
    if (redirectOnSuccess) router.push(thankYouPath);
  };

  const [kvkkApproved, setKvkkApproved] = useState(true);
  const [consentApproved, setConsentApproved] = useState(true);
  const [showApprovalWarning, setShowApprovalWarning] = useState(false);

  const isApproved = kvkkApproved && consentApproved;

  useEffect(() => {
    if (!showApprovalWarning) return;
    const timer = window.setTimeout(() => setShowApprovalWarning(false), 2200);
    return () => window.clearTimeout(timer);
  }, [showApprovalWarning]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <iframe
          aria-label={ariaLabel}
          frameBorder="0"
          style={{ height: iframeHeight, width: '99%', border: 'none' }}
          src={src}
          title={title}
          onLoad={trackGoogleAdsConversion || redirectOnSuccess ? handleIframeLoad : undefined}
        />

        {!isApproved && (
          <div
            className="absolute inset-x-0 bottom-0 z-10 h-56 cursor-not-allowed rounded-b-lg bg-transparent md:h-48"
            onClick={() => setShowApprovalWarning(true)}
            title="Gonderim icin KVKK ve Acik Riza onayi zorunludur"
          />
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-3 text-xs leading-5 text-zinc-300">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={kvkkApproved}
            onChange={(event) => {
              setKvkkApproved(event.target.checked);
              if (event.target.checked && consentApproved) setShowApprovalWarning(false);
            }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-500 bg-zinc-900 text-sky-500 focus:ring-sky-500"
          />
          <span>
            <Link href="/iletisim-kvkk" className="text-sky-300 underline underline-offset-2 hover:text-sky-200">
              KVKK Aydınlatma Metni
            </Link>{' '}
            metnini okudum ve onaylıyorum.
          </span>
        </label>

        <label className="mt-2 flex items-start gap-2">
          <input
            type="checkbox"
            checked={consentApproved}
            onChange={(event) => {
              setConsentApproved(event.target.checked);
              if (event.target.checked && kvkkApproved) setShowApprovalWarning(false);
            }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-500 bg-zinc-900 text-sky-500 focus:ring-sky-500"
          />
          <span>
            <Link href="/acik-riza-onayi" className="text-sky-300 underline underline-offset-2 hover:text-sky-200">
              Açık Rıza / Ticari Elektronik İleti Onayı Metni
            </Link>{' '}
            metnini okudum ve onaylıyorum.
          </span>
        </label>
        {showApprovalWarning && !isApproved ? (
          <p className="mt-2 rounded-md border border-rose-500/50 bg-rose-950/70 px-2 py-1 text-[11px] font-semibold text-rose-200" role="alert">
            Gonderim icin once KVKK ve Acik Riza kutularini isaretleyin.
          </p>
        ) : null}
      </div>
    </div>
  );
}
