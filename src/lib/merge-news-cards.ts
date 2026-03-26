import { normalizeSlugPart } from '@/lib/slug';

export type AdminNewsCard = {
  title: string;
  slug: string;
  description: string;
  image?: string | null;
};

export type StaticNewsCard = {
  title: string;
  category?: string;
  description: string;
  image?: string;
};

type TrSlugSource = { title: string };

/**
 * API (Vercel) haberleri + locale statik kartlar.
 * Ayni slug hem admin hem json'da varsa yalnizca admin karti (cift gorunmez).
 */
export function mergeAdminAndStaticNewsCards(
  adminNews: AdminNewsCard[],
  displayItems: StaticNewsCard[],
  trCases: TrSlugSource[]
): Array<
  | (AdminNewsCard & { __source: 'admin' })
  | (StaticNewsCard & { __source: 'static'; __slug: string })
> {
  const adminSlugSet = new Set(
    adminNews.map((a) => normalizeSlugPart(a.slug || '')).filter(Boolean)
  );

  const staticPart = displayItems
    .map((card, j) => {
      const trCard = trCases[j];
      const titleSource = trCard?.title ?? card.title;
      const __slug = normalizeSlugPart(titleSource);
      return { card, __slug };
    })
    .filter(({ __slug }) => __slug && !adminSlugSet.has(__slug))
    .map(({ card, __slug }) => ({ ...card, __source: 'static' as const, __slug }));

  const adminPart = adminNews.map((a) => ({ ...a, __source: 'admin' as const }));

  return [...adminPart, ...staticPart];
}
