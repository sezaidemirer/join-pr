'use client';

import Link from 'next/link';
import { useState } from 'react';

type FormConsentEmbedProps = {
  src: string;
  ariaLabel: string;
  title?: string;
  iframeHeight?: number;
};

export function FormConsentEmbed({ src, ariaLabel, title = 'Join CRM Form', iframeHeight = 500 }: FormConsentEmbedProps) {
  const [kvkkApproved, setKvkkApproved] = useState(false);
  const [consentApproved, setConsentApproved] = useState(false);
  const [submitAttemptWithoutApproval, setSubmitAttemptWithoutApproval] = useState(false);

  const isApproved = kvkkApproved && consentApproved;

  return (
    <div className="space-y-3">
      <div className="relative">
        <iframe
          aria-label={ariaLabel}
          frameBorder="0"
          style={{ height: iframeHeight, width: '99%', border: 'none' }}
          src={src}
          title={title}
        />

        {!isApproved && (
          <div
            className="absolute inset-x-0 bottom-0 h-24 cursor-not-allowed rounded-b-lg bg-transparent"
            onClick={() => setSubmitAttemptWithoutApproval(true)}
            title="Gönderim öncesi onay zorunludur"
          />
        )}

        {submitAttemptWithoutApproval && !isApproved && (
          <div className="absolute inset-x-3 top-3 rounded-lg border border-rose-500/60 bg-rose-950/90 px-3 py-2 text-center">
            <p className="text-xs font-semibold leading-5 text-rose-100">
              Gonderim yapabilmek icin KVKK ve Acik Riza onay kutularini isaretlemeniz zorunludur.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900/40 p-3 text-xs leading-5 text-zinc-300">
        <label className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={kvkkApproved}
            onChange={(event) => {
              setKvkkApproved(event.target.checked);
              if (event.target.checked && consentApproved) {
                setSubmitAttemptWithoutApproval(false);
              }
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
              if (event.target.checked && kvkkApproved) {
                setSubmitAttemptWithoutApproval(false);
              }
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

        {submitAttemptWithoutApproval && !isApproved ? (
          <p className="mt-2 text-[11px] font-semibold text-rose-300" role="alert">
            Onay verilmeden form gonderimi engellenir. Lutfen iki kutuyu da isaretleyin.
          </p>
        ) : null}
      </div>
    </div>
  );
}
