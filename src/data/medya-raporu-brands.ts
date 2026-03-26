/**
 * Medya yansıma raporu – marka ve rapor sayfaları için veri
 */

export type BrandSlug = 'rixos' | 'swissotel' | 'prontotour' | 'ajet' | 'marriott';

export interface BrandProject {
  slug: string;
  name: string;
  /** Bu proje için rapor sayfası var mı (auth + içerik) */
  hasReport: boolean;
  /** Proje logosu (opsiyonel) */
  logo?: string;
}

export interface Brand {
  slug: BrandSlug;
  name: string;
  /** Logo dosya yolu (public içinden; Join Pr Marka Logoları klasöründeki logolar kullanılıyor) */
  logo?: string;
  projects: BrandProject[];
}

/** Join Pr Marka Logoları klasör yolu (public altında) */
const MARKA_LOGOLARI = '/Join Pr Marka Logoları';

export const MEDYA_RAPORU_BRANDS: Brand[] = [
  {
    slug: 'rixos',
    name: 'Rixos',
    logo: `${MARKA_LOGOLARI}/rixos_egypt_hotels.png`,
    projects: [
      { slug: 'rixos-radamis', name: 'Rixos Radamis', hasReport: true, logo: `${MARKA_LOGOLARI}/rixos_radamis.png` },
    ],
  },
  {
    slug: 'swissotel',
    name: 'Swissotel',
    logo: `${MARKA_LOGOLARI}/swissotel_sharm.png`,
    projects: [],
  },
  {
    slug: 'prontotour',
    name: 'Prontotour',
    logo: `${MARKA_LOGOLARI}/prontotour_logos.png`,
    projects: [],
  },
  {
    slug: 'ajet',
    name: 'Ajet',
    logo: `${MARKA_LOGOLARI}/ajet_logo.png`,
    projects: [],
  },
  {
    slug: 'marriott',
    name: 'Marriott',
    logo: `${MARKA_LOGOLARI}/marriot_deat_sea.png`,
    projects: [],
  },
];

export function getBrandBySlug(slug: string): Brand | undefined {
  return MEDYA_RAPORU_BRANDS.find((b) => b.slug === slug);
}

export function getProjectBySlug(brandSlug: string, projectSlug: string): BrandProject | undefined {
  const brand = getBrandBySlug(brandSlug);
  return brand?.projects.find((p) => p.slug === projectSlug);
}
