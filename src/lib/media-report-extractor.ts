import { spawnSync } from 'child_process';

type ExtractedPage = {
  pageNumber: number;
  lines: string[];
  links: string[];
};

export type ExtractedMediaReport = {
  title: string | null;
  publishedAt: string | null;
  aiScore: string | null;
  coverageCount: string | null;
  adValue: string | null;
  journalistsReached: string | null;
  topReach: string | null;
  domains: string[];
  socialItems: string[];
  pages: ExtractedPage[];
  sourceMode: 'text' | 'annotations' | 'fallback';
};

const EMPTY: ExtractedMediaReport = {
  title: null,
  publishedAt: null,
  aiScore: null,
  coverageCount: null,
  adValue: null,
  journalistsReached: null,
  topReach: null,
  domains: [],
  socialItems: [],
  pages: [],
  sourceMode: 'fallback',
};

type PythonExtractionPayload = {
  pages: Array<{ pageNumber: number; lines: string[]; links: string[] }>;
  error?: string;
};

function normalizeLine(s: string) {
  return s.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
}

function cleanupToken(token: string) {
  return token
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/[.,;:!?]+$/, '')
    .trim()
    .toLowerCase();
}

function extractDomains(text: string): string[] {
  const re = /\b(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+\b/gi;
  const out = new Set<string>();
  let m: RegExpExecArray | null = null;
  while ((m = re.exec(text)) !== null) {
    const domain = cleanupToken(m[0]);
    if (!domain.includes('.') || domain.length < 6) continue;
    if (!/[a-z]/i.test(domain)) continue;
    const parts = domain.split('.');
    const tld = parts[parts.length - 1] || '';
    if (!/^[a-z]{2,}$/i.test(tld)) continue;
    if (domain.endsWith('.png') || domain.endsWith('.jpg') || domain.endsWith('.jpeg') || domain.endsWith('.pdf')) {
      continue;
    }
    out.add(domain);
    if (out.size >= 300) break;
  }
  return Array.from(out);
}

function linesFromItems(items: Array<{ str?: string; transform?: number[] }>): string[] {
  const clean = items
    .map((item) => ({
      text: String(item?.str || '').trim(),
      x: Number(item?.transform?.[4] || 0),
      y: Number(item?.transform?.[5] || 0),
    }))
    .filter((x) => x.text.length > 0);

  if (!clean.length) return [];

  clean.sort((a, b) => (Math.abs(a.y - b.y) > 0.01 ? b.y - a.y : a.x - b.x));
  const groups: Array<{ y: number; words: Array<{ x: number; text: string }> }> = [];
  const Y_TOL = 2.5;
  for (const item of clean) {
    const last = groups[groups.length - 1];
    if (!last || Math.abs(last.y - item.y) > Y_TOL) {
      groups.push({ y: item.y, words: [{ x: item.x, text: item.text }] });
    } else {
      last.words.push({ x: item.x, text: item.text });
    }
  }
  return groups
    .map((g) => {
      g.words.sort((a, b) => a.x - b.x);
      return normalizeLine(g.words.map((w) => w.text).join(' '));
    })
    .filter(Boolean);
}

function findNearValue(lines: string[], labelRe: RegExp, numericOnly = false): string | null {
  for (let i = 0; i < lines.length; i += 1) {
    if (!labelRe.test(lines[i])) continue;
    const candidates = [lines[i + 1], lines[i - 1], lines[i + 2], lines[i - 2]].filter(Boolean) as string[];
    for (const c of candidates) {
      const v = normalizeLine(c);
      if (!v || labelRe.test(v) || /^(i+\.|ii+\.|iii+\.|iv+\.|v+\.)/i.test(v)) continue;
      if (numericOnly && !/[0-9]/.test(v)) continue;
      return v;
    }
  }
  return null;
}

function pickDate(text: string): string | null {
  const m1 = text.match(/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/);
  if (m1?.[0]) return m1[0];
  const m2 = text.match(/\b\d{1,2}\s+[A-Za-zÇĞİÖŞÜçğıöşü]+\s+\d{4}\b/);
  return m2?.[0] ?? null;
}

function pickTitle(lines: string[], fallback: string): string {
  const bulletenIdx = lines.findIndex((x) => /bas[ıi]n b[üu]lteni/i.test(x));
  if (bulletenIdx >= 0) {
    for (let i = bulletenIdx + 1; i < Math.min(lines.length, bulletenIdx + 5); i += 1) {
      const candidate = normalizeLine(lines[i] || '');
      if (candidate && candidate.length > 8 && !/paket|da[ğg][ıi]t[ıi]m|hedef|dil/i.test(candidate)) {
        return candidate;
      }
    }
  }
  const generic = lines.find((line) => line.length > 18 && !line.match(/^(medya|online|sosyal|genel)\b/i));
  return generic || fallback;
}

function pickMetricByLabel(text: string, labels: string[]): string | null {
  for (const label of labels) {
    const re = new RegExp(`${label}\\s*[:\\-]?\\s*\\$?\\s*([0-9][0-9\\.,]*)`, 'i');
    const m = text.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

function parseSectionOneMetrics(lines: string[]) {
  const idxStart = lines.findIndex((x) => /^i\.\s*genel/i.test(x));
  if (idxStart < 0) return null;
  const idxEndRaw = lines.findIndex((x, i) => i > idxStart && /^ii\.\s*online/i.test(x));
  const idxEnd = idxEndRaw > idxStart ? idxEndRaw : Math.min(lines.length, idxStart + 120);
  const section = lines.slice(idxStart, idxEnd);

  const idxLabel1 = section.findIndex((x) => /en\s*çok\s*kişiye\s*ulaştıran|en\s*cok\s*kisiye\s*ulastiran/i.test(x));
  const idxLabel2 = section.findIndex((x) => /yansıma sayısı|yansima sayisi/i.test(x));
  const idxLabel4 = section.findIndex((x) => /reklam/i.test(x));
  if (idxLabel1 < 0 || idxLabel2 < 0 || idxLabel4 < 0) return null;

  // B2Press raporlarında etiketler altta, değerler üstte geliyor.
  const beforeLabel = section.slice(0, idxLabel1).filter((x) => {
    const s = normalizeLine(x);
    if (!s) return false;
    if (/^b2press\b/i.test(s)) return false;
    if (/^i\.\s*genel/i.test(s)) return false;
    return true;
  });
  if (beforeLabel.length < 4) return null;
  const tail = beforeLabel.slice(-4);

  const topReach = tail[0] || null;
  const coverageCount = tail[1] || null;
  const potentialReach = tail[2] || null;
  const adValue = tail[3] || null;
  return { topReach, coverageCount, potentialReach, adValue };
}

function extractPdfPagesWithPython(pdfUrl: string): PythonExtractionPayload {
  const py = `
import fitz, json, sys, urllib.request
url = sys.argv[1]
out = {"pages": []}
try:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=45) as r:
        data = r.read()
    doc = fitz.open(stream=data, filetype="pdf")
    for idx, page in enumerate(doc, start=1):
        blocks = page.get_text("blocks")
        blocks = sorted(blocks, key=lambda b: (round(b[1],1), round(b[0],1)))
        lines = []
        for b in blocks:
            txt = (b[4] or "").strip()
            if not txt:
                continue
            for ln in txt.splitlines():
                ln = " ".join(ln.split()).strip()
                if ln:
                    lines.append(ln)
        links = []
        for l in page.get_links():
            uri = (l.get("uri") or "").strip()
            if uri:
                links.append(uri)
        out["pages"].append({"pageNumber": idx, "lines": lines, "links": links})
except Exception as e:
    out["error"] = str(e)
print(json.dumps(out, ensure_ascii=False))
`;

  const res = spawnSync('python3', ['-c', py, pdfUrl], {
    encoding: 'utf-8',
    timeout: 120000,
  });

  if (res.error) {
    return { pages: [], error: res.error.message };
  }
  const raw = (res.stdout || '').trim();
  if (!raw) {
    return { pages: [], error: res.stderr || 'Python extractor empty output' };
  }
  try {
    const parsed = JSON.parse(raw) as PythonExtractionPayload;
    return parsed;
  } catch {
    return { pages: [], error: `Python JSON parse failed: ${raw.slice(0, 400)}` };
  }
}

export async function extractMediaReportFromPdfUrl(pdfUrl: string, fallbackTitle: string): Promise<ExtractedMediaReport> {
  if (!pdfUrl) return { ...EMPTY, title: fallbackTitle };
  const py = extractPdfPagesWithPython(pdfUrl);
  if (py.error || !py.pages.length) {
    return { ...EMPTY, title: fallbackTitle };
  }
  const pages = py.pages.map((p) => ({
    pageNumber: p.pageNumber,
    lines: (p.lines || []).map(normalizeLine).filter(Boolean),
    links: (p.links || []).filter(Boolean),
  }));
  const lines = pages.flatMap((p) => p.lines);
  const annotationUrls = pages.flatMap((p) => p.links);

  const allText = lines.join('\n');
  const domainsFromText = extractDomains(allText);
  const domainsFromAnn = extractDomains(annotationUrls.join('\n'));
  const domains = Array.from(new Set([...domainsFromText, ...domainsFromAnn]));

  const sectionOne = parseSectionOneMetrics(lines);

  const topReach =
    sectionOne?.topReach ||
    findNearValue(lines, /en\s*çok\s*kişiye\s*ulaştıran|en\s*cok\s*kisiye\s*ulastiran/i) ||
    domains[0] ||
    null;
  const coverageCount =
    sectionOne?.coverageCount ||
    pickMetricByLabel(allText, ['yansıma sayısı', 'yayin sayisi', 'yayın sayısı']) ||
    findNearValue(lines, /yansıma sayısı|yansima sayisi/i, true);
  const adValue =
    sectionOne?.adValue ||
    pickMetricByLabel(allText, ['reklam eşdeğeri', 'reklam esdegeri', 'reklam eşdeğerine ulaştı']) ||
    findNearValue(lines, /reklam/i, true);
  const journalistsReached =
    pickMetricByLabel(allText, ['gazeteciye ulaştırıldı', 'gazeteciye ulastirildi']) ||
    findNearValue(lines, /gazeteci/i, true);
  const aiScoreMatch = allText.match(/\b([0-9](?:[.,][0-9])?)\s*\/\s*10\b/i);

  const socialItems = lines
    .filter((l) => /(facebook|instagram|linkedin|youtube|tiktok|\bx\b|twitter)/i.test(l))
    .slice(0, 120);

  return {
    title: pickTitle(lines, fallbackTitle),
    publishedAt: pickDate(allText),
    aiScore: aiScoreMatch?.[1] ?? null,
    coverageCount: coverageCount || null,
    adValue: adValue || null,
    journalistsReached: journalistsReached || null,
    topReach: topReach || null,
    domains,
    socialItems: socialItems.length ? socialItems : annotationUrls.slice(0, 120),
    pages,
    sourceMode: domainsFromText.length ? 'text' : domainsFromAnn.length ? 'annotations' : 'fallback',
  };
}
