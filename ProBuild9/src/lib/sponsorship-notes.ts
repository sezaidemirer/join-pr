/** Sponsorluk projelerinde `crm_offer_pages.notes` içinde tutulan JSON yapısı. */

export type SponsorshipNotesPayload = {
  pdfUrl?: string;
  slideUrls?: string[];
  participantsUrl?: string;
  videoUrl?: string;
  videoUrls?: string[];
  photoUrls?: string[];
};

/** DB/API bazen string (text), bazen jsonb nedeniyle obje döndürebilir. */
export function parseSponsorshipNotes(raw: unknown): SponsorshipNotesPayload {
  if (raw == null) return {};

  let parsed: Record<string, unknown>;
  if (typeof raw === 'string') {
    const s = raw.trim();
    if (!s) return {};
    try {
      parsed = JSON.parse(s) as Record<string, unknown>;
    } catch {
      return { pdfUrl: s };
    }
  } else if (typeof raw === 'object' && !Array.isArray(raw)) {
    parsed = raw as Record<string, unknown>;
  } else {
    return {};
  }

  const videoUrlsRaw = parsed.videoUrls ?? parsed.video_urls;
  const videoUrls = Array.isArray(videoUrlsRaw)
    ? videoUrlsRaw
        .filter((x): x is string => typeof x === 'string')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const slideUrlsRaw = parsed.slideUrls;
  const photoUrlsRaw = parsed.photoUrls;

  return {
    pdfUrl: typeof parsed.pdfUrl === 'string' ? parsed.pdfUrl : undefined,
    slideUrls: Array.isArray(slideUrlsRaw)
      ? slideUrlsRaw.filter((x): x is string => typeof x === 'string')
      : [],
    participantsUrl: typeof parsed.participantsUrl === 'string' ? parsed.participantsUrl : undefined,
    videoUrl: typeof parsed.videoUrl === 'string' ? parsed.videoUrl : undefined,
    videoUrls: videoUrls.length > 0 ? videoUrls : undefined,
    photoUrls: Array.isArray(photoUrlsRaw)
      ? photoUrlsRaw.filter((x): x is string => typeof x === 'string')
      : [],
  };
}

export function fourVideoSlotsFromPayload(payload: SponsorshipNotesPayload): string[] {
  const slots = ['', '', '', ''];
  const fromArray = (payload.videoUrls || []).map((u) => u.trim()).filter(Boolean).slice(0, 4);
  if (fromArray.length > 0) {
    fromArray.forEach((u, i) => {
      slots[i] = u;
    });
    return slots;
  }
  const legacy = (payload.videoUrl || '').trim();
  if (legacy) slots[0] = legacy;
  return slots;
}

export function listSponsorshipVideoUrls(payload: SponsorshipNotesPayload): string[] {
  const fromArray = (payload.videoUrls ?? []).map((u) => u.trim()).filter(Boolean).slice(0, 4);
  if (fromArray.length > 0) return fromArray;
  const single = (payload.videoUrl || '').trim();
  return single ? [single] : [];
}
