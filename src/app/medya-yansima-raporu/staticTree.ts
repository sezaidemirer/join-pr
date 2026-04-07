type StaticTreeProject = {
  slug: string;
};

type StaticTreeBrand = {
  slug: string;
  projects: StaticTreeProject[];
};

function normalizeBase(base: string) {
  return String(base || '').trim().replace(/\/$/, '');
}

function getMediaTreeFromBuildEnv(): StaticTreeBrand[] {
  const raw = String(process.env.CPANEL_MEDIA_TREE_JSON || '').trim();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((b: any) => ({
        slug: String(b?.slug || '').trim(),
        projects: Array.isArray(b?.projects)
          ? b.projects.map((p: any) => ({ slug: String(p?.slug || '').trim() })).filter((p: StaticTreeProject) => p.slug)
          : [],
      }))
      .filter((b: StaticTreeBrand) => b.slug);
  } catch {
    return [];
  }
}

export async function getMediaTreeForStaticBuild(): Promise<StaticTreeBrand[]> {
  const envTree = getMediaTreeFromBuildEnv();
  if (envTree.length) return envTree;

  const base = normalizeBase(process.env.NEXT_PUBLIC_NEWS_API_ORIGIN || 'https://proje.joinpr.com.tr');
  const url = `${base}/api/media-reports/tree/`;
  const res = await fetch(url, { method: 'GET', cache: 'no-store' });
  if (!res.ok) throw new Error(`media tree fetch failed: ${res.status}`);
  const json = await res.json();
  const brands = Array.isArray(json?.brands) ? json.brands : [];

  return brands
    .map((b: any) => ({
      slug: String(b?.slug || '').trim(),
      projects: Array.isArray(b?.projects)
        ? b.projects.map((p: any) => ({ slug: String(p?.slug || '').trim() })).filter((p: StaticTreeProject) => p.slug)
        : [],
    }))
    .filter((b: StaticTreeBrand) => b.slug);
}
