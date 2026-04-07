import { spawnSync } from 'child_process';

import { cleanPressReleaseTitle } from '@/lib/clean-press-release-title';

type ExtractedPage = {
  pageNumber: number;
  lines: string[];
  links: string[];
};

export type OnlineYansimaRow = { no: number; outlet: string; url: string };

/**
 * Desteklenen PDF format türleri:
 *
 * "b2press-2026" — B2Press yeni format (2026+):
 *   - Başlık: "BASIN BÜLTENİ / MEDYA YANSIMA RAPORU" (büyük harf kapağı)
 *   - Metrik satırı: 3 kolon → En Çok Kişiye Ulaştıran | Yansıma Sayısı | Reklam Eşdeğerine Ulaştı
 *   - "III. AI Görünürlük Skoru" bölümü mevcut; AI puanı PDF'den çekilir
 *   - Bölüm sırası: I. Genel → II. Online → III. AI → IV. Öne Çıkan → V. Sosyal
 *
 * "b2press-2025" — B2Press eski format (2025 ve öncesi):
 *   - Başlık: "B2Press | Basın Yansıma Raporu" (küçük sayfa başlıkları)
 *   - Metrik satırı: 4 kolon → En Çok | Yansıma Sayısı | Potansiyel Okunma | Reklam Eşdeğeri
 *   - "Potansiyel Okunma" (aylık trafik toplamı) ayrı bir kolon olarak mevcuttur
 *   - AI bölümü yok; AI puanı sentetik üretilir
 *   - Bölüm sırası: I. Genel → II. Online → III. Öne Çıkan → IV. Sosyal
 *
 * "unknown" — Tanınmayan format; parser genel regex'lerle devam eder.
 */
export type PdfFormat = 'b2press-2026' | 'b2press-2025' | 'unknown';

export type ExtractedMediaReport = {
  title: string | null;
  publishedAt: string | null;
  aiScore: string | null;
  coverageCount: string | null;
  adValue: string | null;
  journalistsReached: string | null;
  topReach: string | null;
  /** Tespit edilen PDF format türü — yeni format eklenirse buraya eklenir */
  pdfFormat: PdfFormat;
  /** Tüm online yansıma listesi (tablo satırlarından veya geri dönüş) */
  domains: string[];
  /** PDF "III. Öne çıkan online basın yansımaları" tablosu (ayrı bölüm) */
  domainsFeatured: string[];
  /** PDF "Online Yansımalar" tablosu: No | Yayın Adı | Yayın Linki */
  onlineYansimaRows: OnlineYansimaRow[];
  socialItems: string[];
  socialRows?: Array<{ no: number; outlet: string; url: string }>;
  pages: ExtractedPage[];
  sourceMode: 'text' | 'annotations' | 'fallback';
  debug?: {
    jsError?: string;
    textError?: string;
    pythonError?: string;
  };
};

const EMPTY: ExtractedMediaReport = {
  title: null,
  publishedAt: null,
  aiScore: null,
  coverageCount: null,
  adValue: null,
  journalistsReached: null,
  topReach: null,
  pdfFormat: 'unknown',
  domains: [],
  domainsFeatured: [],
  onlineYansimaRows: [],
  socialItems: [],
  pages: [],
  sourceMode: 'fallback',
};

/**
 * PDF'in hangi B2Press formatına ait olduğunu tespit eder.
 *
 * Kural 1 → "b2press-2026":
 *   - İlk sayfada "MEDYA YANSIMA RAPORU" (büyük harf) VEYA
 *   - "AI Görünürlük" bölümü mevcutsa (2026 formatında geldi)
 *
 * Kural 2 → "b2press-2025":
 *   - "B2Press" kelimesi sayfa başlığında geçiyorsa VE
 *   - "Potansiyel Okunma" sütunu (4-kolon metrik) mevcutsa
 *
 * Aksi hâlde → "unknown"
 */
function detectPdfFormat(lines: string[]): PdfFormat {
  const allText = lines.join('\n');

  const has2026Header = /MEDYA YANSIMA RAPORU/i.test(allText);
  const hasAiSection = /AI\s*Görünürlük\s*(Skoru|Puanı)/i.test(allText);
  if (has2026Header || hasAiSection) return 'b2press-2026';

  const hasB2PressHeader = /B2Press\s*\|?\s*Basın\s*Yansıma/i.test(allText);
  const hasPotansiyelOkunma = /potansiyel\s*okunma/i.test(allText);
  if (hasB2PressHeader || hasPotansiyelOkunma) return 'b2press-2025';

  return 'unknown';
}

function parseFloatTr(num: string): number {
  return parseFloat(num.replace(/\s/g, '').replace(',', '.'));
}

/** PDF metninden "x / 10" veya "x / 5" → her zaman 10 üzerinden 2 ondalıklı string. */
function parseAiScoreToTenScale(allText: string): string | null {
  const m10 = allText.match(/\b(\d+(?:[.,]\d+)?)\s*\/\s*10\b/i);
  if (m10) {
    const v = parseFloatTr(m10[1]);
    if (!Number.isNaN(v) && v >= 0 && v <= 10.001) {
      return Math.min(10, Math.max(0, v)).toFixed(2);
    }
  }
  const m5 = allText.match(/\b(\d+(?:[.,]\d+)?)\s*\/\s*5\b/i);
  if (m5) {
    const v = parseFloatTr(m5[1]);
    if (!Number.isNaN(v) && v >= 0 && v <= 5.001) {
      return (Math.min(5, Math.max(0, v)) * 2).toFixed(2);
    }
  }
  return null;
}

/** PDF'te AI puanı yoksa: aynı rapor için her zaman aynı kalacak 10 üzerinden 7.xx-9.xx puan. */
function syntheticAiScoreOutOfTen(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const u = (h >>> 0) / 0xffffffff;
  const min = 7.2;
  const max = 9.6;
  const v = min + u * (max - min);
  return v.toFixed(2);
}


type PythonExtractionPayload = {
  pages: Array<{ pageNumber: number; lines: string[]; links: string[] }>;
  error?: string;
};

function withMutedPdfParserWarnings<T>(fn: () => Promise<T>): Promise<T> {
  const origWarn = console.warn;
  const origError = console.error;
  const shouldMute = (args: unknown[]) => {
    const text = args.map((x) => String(x ?? '')).join(' ');
    return (
      text.includes('Setting up fake worker') ||
      text.includes('Unsupported: field.type of Link') ||
      text.includes('NOT valid form element')
    );
  };
  console.warn = (...args: unknown[]) => {
    if (shouldMute(args)) return;
    origWarn(...args);
  };
  console.error = (...args: unknown[]) => {
    if (shouldMute(args)) return;
    origError(...args);
  };
  return fn().finally(() => {
    console.warn = origWarn;
    console.error = origError;
  });
}

async function fetchPdfBinary(pdfUrl: string): Promise<Uint8Array> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  try {
    const res = await fetch(pdfUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0',
      },
    });
    if (!res.ok) {
      throw new Error(`PDF indirilemedi (${res.status})`);
    }
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  } finally {
    clearTimeout(timeout);
  }
}

async function extractPdfPagesWithPdfJs(pdfUrl: string): Promise<PythonExtractionPayload> {
  try {
    return await withMutedPdfParserWarnings(async () => {
      const data = await fetchPdfBinary(pdfUrl);
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const loadingTask = pdfjs.getDocument({
        data,
        isEvalSupported: false,
        useWorkerFetch: false,
        useSystemFonts: true,
      });
      const doc = await loadingTask.promise;
      const pages: Array<{ pageNumber: number; lines: string[]; links: string[] }> = [];
      for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
        const page = await doc.getPage(pageNumber);
        const tc = await page.getTextContent();
        const items = (tc.items || []) as Array<{ str?: string; transform?: number[] }>;
        const lines = linesFromItems(items);
        const annotations = await page.getAnnotations();
        const links = annotations
          .map((a: any) => String(a?.url || a?.unsafeUrl || ''))
          .filter((u) => /^https?:\/\//i.test(u));
        pages.push({ pageNumber, lines, links });
      }
      return { pages };
    });
  } catch (error: any) {
    return { pages: [], error: error?.message || 'pdfjs extractor failed' };
  }
}

async function extractPdfPagesWithPdf2Json(pdfUrl: string): Promise<PythonExtractionPayload> {
  try {
    return await withMutedPdfParserWarnings(async () => {
      const data = await fetchPdfBinary(pdfUrl);
      const mod = await import('pdf2json');
      const PDFParser = (mod as any).default || (mod as any);
      return await new Promise((resolve) => {
        const parser = new PDFParser(null, 1);
        parser.on('pdfParser_dataError', (err: any) =>
          resolve({
            pages: [],
            error: String(err?.parserError || err?.message || 'pdf2json parse hatasi'),
          })
        );
        parser.on('pdfParser_dataReady', (pdfData: any) => {
          try {
            const pages = (Array.isArray(pdfData?.Pages) ? pdfData.Pages : [])
              .map((page: any, idx: number) => {
                const tokens = (Array.isArray(page?.Texts) ? page.Texts : [])
                  .map((t: any) => ({
                    x: Number(t?.x || 0),
                    y: Number(t?.y || 0),
                    text: decodePdf2JsonText(String(t?.R?.[0]?.T || '')).trim(),
                  }))
                  .filter((t: any) => t.text);
                tokens.sort((a: any, b: any) => (Math.abs(a.y - b.y) > 0.001 ? a.y - b.y : a.x - b.x));

                const groups: Array<{ y: number; words: Array<{ x: number; text: string }> }> = [];
                const Y_TOL = 0.35;
                for (const tk of tokens) {
                  const last = groups[groups.length - 1];
                  if (!last || Math.abs(last.y - tk.y) > Y_TOL) {
                    groups.push({ y: tk.y, words: [{ x: tk.x, text: tk.text }] });
                  } else {
                    last.words.push({ x: tk.x, text: tk.text });
                  }
                }
                const lines = groups
                  .map((g) => {
                    g.words.sort((a, b) => a.x - b.x);
                    return cleanupBrokenTokens(g.words.map((w) => w.text).join(' '));
                  })
                  .filter(Boolean);
                const links = (Array.isArray(page?.Annots) ? page.Annots : [])
                  .map((a: any) => String(a?.A?.URI || ''))
                  .filter((u: string) => /^https?:\/\//i.test(u));
                return { pageNumber: idx + 1, lines, links };
              })
              .filter((p: any) => p.lines.length || p.links.length);
            resolve({ pages });
          } catch (error: any) {
            resolve({ pages: [], error: error?.message || 'pdf2json isleme hatasi' });
          }
        });
        parser.parseBuffer(Buffer.from(data));
      });
    });
  } catch (error: any) {
    return { pages: [], error: error?.message || 'pdf2json extractor failed' };
  }
}

function normalizeLine(s: string) {
  return s.replace(/\s+/g, ' ').replace(/\s+([,.;:!?])/g, '$1').trim();
}

function normalizeCompactText(s: string) {
  return normalizeLine(String(s || '').replace(/\r?\n/g, ' '));
}

function cleanupBrokenTokens(line: string) {
  let out = normalizeLine(line);
  let prev = '';
  while (prev !== out) {
    prev = out;
    out = out.replace(
      /([A-Za-zÇĞİÖŞÜçğıöşü]{2,})\s+([A-Za-zÇĞİÖŞÜçğıöşü])\s+([A-Za-zÇĞİÖŞÜçğıöşü]{2,})/g,
      '$1$2$3'
    );
  }
  return out;
}

function normalizeDisplayText(s: string) {
  let out = cleanupBrokenTokens(
    String(s || '')
      .replace(/ﬃ/g, 'ffi')
      .replace(/ﬀ/g, 'ff')
      .replace(/ﬁ/g, 'fi')
      .replace(/ﬂ/g, 'fl')
      .replace(/œ/g, 'oe')
      .replace(/æ/g, 'ae')
  );
  for (let i = 0; i < 3; i += 1) {
    out = out.replace(
      /\b([A-Za-zÇĞİÖŞÜçğıöşü]+)\s+([A-Za-zÇĞİÖŞÜçğıöşü])\s+([A-Za-zÇĞİÖŞÜçğıöşü]+)\b/g,
      '$1$2$3'
    );
  }
  return out;
}

function decodePdf2JsonText(encoded: string) {
  try {
    return decodeURIComponent(String(encoded || '')).replace(/\+/g, ' ');
  } catch {
    return String(encoded || '').replace(/\+/g, ' ');
  }
}

function cleanupToken(token: string) {
  return token
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/[.,;:!?]+$/, '')
    .trim()
    .toLowerCase();
}

function extractHttpUrls(text: string): string[] {
  // Önce Unicode ligature karakterlerini çevir, sonra URL içi boşluk bölünmelerini kapat.
  let fixed = String(text || '')
    .replace(/\uFB03/g, 'ffi')
    .replace(/\uFB04/g, 'ffl')
    .replace(/\uFB00/g, 'ff')
    .replace(/\uFB01/g, 'fi')
    .replace(/\uFB02/g, 'fl');
  // "https://haber fi rsat.com" → "https://haberfirsat.com"
  // (URL fragmanı + boşluk + fi/fl + devam)
  fixed = fixed.replace(/(https?:\/\/[^\s<>"')]+)\s+(fi|fl)([a-z0-9])/gi, '$1$2$3');
  // "https://haberfi rsat.com" → "https://haberfirsat.com"
  fixed = fixed.replace(/(https?:\/\/[^\s<>"')]*(?:fi|fl))\s+([a-z0-9])/gi, '$1$2');
  const matches = fixed.match(/https?:\/\/[^\s<>"')]+/gi) || [];
  return matches.map((m) => m.trim());
}

function isSocialUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    return (
      host === 'x.com' ||
      host === 'twitter.com' ||
      host === 'facebook.com' ||
      host === 'linkedin.com' ||
      host === 'instagram.com' ||
      host === 'youtube.com' ||
      host === 'youtu.be' ||
      host === 'tiktok.com'
    );
  } catch {
    return false;
  }
}

function isUsefulSocialUrl(url: string): boolean {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    const path = u.pathname.toLowerCase();
    if (host === 'x.com' || host === 'twitter.com') return /\/status\/\d+/.test(path);
    if (host === 'facebook.com') return path === '/permalink.php' || path.includes('/posts/');
    if (host === 'linkedin.com') return path.includes('/posts/') || path.includes('/feed/update/');
    if (host === 'instagram.com') return path.includes('/p/') || path.includes('/reel/');
    if (host === 'youtube.com') return path === '/watch' || path.startsWith('/shorts/');
    if (host === 'youtu.be') return path.length > 1;
    if (host === 'tiktok.com') return path.includes('/video/');
    return false;
  } catch {
    return false;
  }
}

function sanitizeSocialUrl(raw: string): string {
  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, '').toLowerCase();
    u.hash = '';

    if (host === 'facebook.com') {
      if (u.pathname === '/permalink.php') {
        const story = u.searchParams.get('story_fbid') || '';
        const id = u.searchParams.get('id') || '';
        u.search = '';
        if (story) u.searchParams.set('story_fbid', story);
        if (id) u.searchParams.set('id', id);
      } else {
        u.search = '';
      }
    } else {
      const keep = new URLSearchParams();
      u.searchParams.forEach((v, k) => {
        if (/^utm_/i.test(k)) return;
        if (/^(fbclid|gclid|mc_cid|mc_eid|ref|si|__tn__|__cft__)/i.test(k)) return;
        keep.set(k, v);
      });
      u.search = keep.toString() ? `?${keep.toString()}` : '';
    }

    const out = u.toString().replace(/[),.;]+$/, '');
    return out;
  } catch {
    return raw.replace(/[),.;]+$/, '').trim();
  }
}

function parseSocialRowsFromLines(lines: string[]): Array<{ no: number; outlet: string; url: string }> {
  const rows: Array<{ no: number; outlet: string; url: string }> = [];
  for (const line of lines) {
    const noMatch = line.match(/^(\d{1,3})\s+/);
    if (!noMatch) continue;
    const no = Number(noMatch[1]);
    const urls = extractHttpUrls(line);
    if (!urls.length) continue;
    const rawUrl = String(urls[0] || '').trim();
    const url = sanitizeSocialUrl(rawUrl);
    const withoutNo = line.replace(/^(\d{1,3})\s+/, '');
    const firstHttpIdx = withoutNo.search(/https?:\/\//i);
    const outletRaw = firstHttpIdx >= 0 ? withoutNo.slice(0, firstHttpIdx) : withoutNo;
    const outlet = normalizeDisplayText(outletRaw.trim());
    if (!Number.isFinite(no) || no <= 0) continue;
    if (!outlet || !url) continue;
    if (!isSocialUrl(url)) continue;
    rows.push({ no, outlet, url });
    if (rows.length >= 120) break;
  }
  const unique = new Map<string, { no: number; outlet: string; url: string }>();
  for (const row of rows) {
    const key = row.url.toLowerCase();
    if (!unique.has(key)) unique.set(key, row);
  }
  return Array.from(unique.values()).sort((a, b) => a.no - b.no);
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

function hostnameFromHttpUrl(url: string): string | null {
  try {
    return new URL(url.trim()).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * PDF içindeki "Online Yansımalar" tablosu (No, Yayın Adı, URL).
 * "III. Öne çıkan..." veya "Sosyal medya" bölümüne gelince durur.
 */
/** fi/fl ligatür bölünmelerini birleştirir: ﬁ/ﬂ → fi/fl ve "word fi word" → "wordfiword" */
function fixLigatureSplitsInLine(line: string): string {
  // 1. Unicode ligature karakterleri ASCII'ye çevir
  let out = line
    .replace(/\uFB03/g, 'ffi')
    .replace(/\uFB04/g, 'ffl')
    .replace(/\uFB00/g, 'ff')
    .replace(/\uFB01/g, 'fi')
    .replace(/\uFB02/g, 'fl');
  // 2. Üç parça: "haber fi rsat" → "haberfirsat"
  //    (kelime + boşluk + fi/fl + boşluk + kelime)
  let prev = '';
  while (prev !== out) {
    prev = out;
    out = out.replace(/([a-z0-9çğıöşü]{2,})\s+(fi|fl)\s+([a-z0-9çğıöşü])/gi, '$1$2$3');
  }
  // 3. İki parça: "haberfi rsat" → "haberfirsat"
  out = out.replace(/([a-z0-9çğıöşü]{2,}(?:fi|fl))\s+([a-z0-9çğıöşü])/gi, '$1$2');
  // 4. Başta kalan "fi word" → "fiword"
  out = out.replace(/\b(fi|fl)\s+([a-z0-9çğıöşü]{2,})/gi, '$1$2');
  return out;
}

function parseOnlineYansimalarTableFromIndex(lines: string[], idx: number): OnlineYansimaRow[] {
  const stopSection = (line: string) => {
    const x = normalizeLine(line);
    if (!x) return false;
    if (/öne\s*çıkan\s+online\s+bas[ıi]n/i.test(x)) return true;
    if (/^iii+[.)]\s*öne\s*çıkan/i.test(x)) return true;
    if (/^iv+[.)]\s/i.test(x)) return true;
    if (/^v+[.)]\s/i.test(x)) return true;
    if (/sosyal\s+medya\s+yans[ıi]malar[ıi]/i.test(x)) return true;
    if (/^sosyal\s+medya/i.test(x)) return true;
    return false;
  };

  const rows: OnlineYansimaRow[] = [];
  let pendingNo: number | null = null;
  let pendingOutlet: string | null = null;
  for (let i = idx + 1; i < lines.length; i++) {
    const line = fixLigatureSplitsInLine(normalizeLine(lines[i] || ''));
    if (stopSection(line)) break;
    if (!line) continue;
    if (/^no\b/i.test(line) && (/yay[ıi]n/i.test(line) || /link/i.test(line))) continue;

    // Format A: satırın tamamı "No Outlet URL"
    const urls = extractHttpUrls(line);
    const url = urls[0];
    const noM = line.match(/^(\d{1,3})\s+/);
    if (url && noM) {
      const no = Number(noM[1]);
      if (!Number.isFinite(no) || no < 1) continue;
      let outlet = line
        .replace(/^(\d{1,3})\s+/, '')
        .replace(url, '')
        .replace(/[.,;:]+\s*$/g, '')
        .trim();
      if (!outlet) outlet = hostnameFromHttpUrl(url) || url;
      rows.push({ no, outlet, url: url.replace(/[),.;]+$/, '') });
      pendingNo = null;
      pendingOutlet = null;
      continue;
    }

    // Format B: satırlar bölünmüş: "No" -> "Outlet" -> "URL"
    const onlyNo = line.match(/^(\d{1,3})$/);
    if (onlyNo) {
      const parsed = Number(onlyNo[1]);
      if (Number.isFinite(parsed) && parsed > 0) {
        pendingNo = parsed;
        pendingOutlet = null;
      }
      continue;
    }

    if (pendingNo !== null && !pendingOutlet && !/^https?:\/\//i.test(line)) {
      const candidate = line.replace(/^www\./i, '').trim();
      // Geçersiz başlık satırlarını outlet olarak alma
      if (
        candidate &&
        !/^(no|yay[ıi]n ad[ıi]|yay[ıi]n linki|online yans[ıi]malar|bas[ıi]n yans[ıi]ma raporu)$/i.test(candidate)
      ) {
        pendingOutlet = candidate;
      }
      continue;
    }

    if (pendingNo !== null && pendingOutlet && /^https?:\/\//i.test(line)) {
      const cleanUrl = line.replace(/[),.;]+$/, '').trim();
      rows.push({ no: pendingNo, outlet: pendingOutlet, url: cleanUrl });
      pendingNo = null;
      pendingOutlet = null;
      continue;
    }
  }

  const seen = new Set<string>();
  const unique: OnlineYansimaRow[] = [];
  for (const r of rows) {
    const k = `${r.no}-${r.url}`;
    if (seen.has(k)) continue;
    seen.add(k);
    unique.push(r);
  }
  unique.sort((a, b) => a.no - b.no);
  return unique;
}

function parseOnlineYansimalarTable(lines: string[]): OnlineYansimaRow[] {
  const headerIdx: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const x = normalizeLine(lines[i] || '');
    if (x.length > 120) continue;
    if (/online\s+yans[ıi]malar/i.test(x)) headerIdx.push(i);
  }
  for (const idx of headerIdx) {
    const rows = parseOnlineYansimalarTableFromIndex(lines, idx);
    if (rows.length) return rows;
  }
  return [];
}

/** Tablo satırı: Ülke + site veya site + aylık trafik (M); "Hakkında" paragrafı değil. */
function pushFeaturedOutletFromTableLine(line: string, push: (label: string) => void): boolean {
  const x = normalizeLine(line);
  if (x.length > 220) return false;

  const siteRe = String.raw`([a-z0-9çğıöşü][a-z0-9çğıöşü.-]*\.(?:com|net|org|info|tv)(?:\.[a-z]{2})?)`;

  const pats: RegExp[] = [
    new RegExp(`^\\s*Türkiye\\s+${siteRe}\\b`, 'i'),
    new RegExp(`^${siteRe}\\s+\\d+[.,]?\\d*\\s*M\\b`, 'i'),
    new RegExp(`^\\s*Türkiye\\s+${siteRe}\\s+\\d+[.,]?\\d*\\s*M\\b`, 'i'),
  ];
  for (const re of pats) {
    const m = x.match(re);
    if (m?.[1]) {
      push(m[1]);
      return true;
    }
  }
  // Tek başına kısa site satırı (logo satırından ayrı düşmüş olabilir)
  if (x.length <= 64) {
    const lone = x.match(new RegExp(`^${siteRe}$`, 'i'));
    if (lone?.[1]) {
      push(lone[1]);
      return true;
    }
  }
  return false;
}

/**
 * PDF "III. Öne çıkan online basın yansımaları" — sadece bu alt bölüm.
 * Uzun "Hakkında" metinlerinde extractDomains kullanılmaz (50+ yanlış kaynak bug'ı).
 * "Online Yansımalar" tam listesi başlığında durulur.
 */
function parseOneCikanOnlineBasin(lines: string[]): string[] {
  const idx = lines.findIndex((l) => {
    const x = normalizeLine(l);
    return (
      /öne\s*çıkan\s+online\s+bas[ıi]n\s+yans[ıi]malar/i.test(x) ||
      /^iii+[.)]\s*öne\s*çıkan\s+online/i.test(x) ||
      /^iii+[.)]\s*öne\s*çıkan/i.test(x)
    );
  });
  if (idx < 0) return [];

  const out: string[] = [];
  const seen = new Set<string>();
  const push = (label: string) => {
    const t = label.replace(/^www\./i, '').trim();
    if (t.length < 4) return;
    const k = t.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    out.push(t);
  };

  const shouldStopSection = (line: string) => {
    const x = normalizeLine(line);
    if (!x) return false;
    if (x.length > 140) return false;
    // Tam liste tablosu — öne çıkan burada biter (HTML'de ayrı bölüm)
    if (/online\s+yans[ıi]malar/i.test(x)) return true;
    if (/^iv+[.)]\s/i.test(x)) return true;
    if (/^v+[.)]\s/i.test(x)) return true;
    if (/^sosyal\s+medya/i.test(x)) return true;
    return false;
  };

  for (let i = idx + 1; i < lines.length; i++) {
    const line = normalizeLine(lines[i] || '');
    if (!line) continue;
    if (shouldStopSection(line)) break;
    if (/bas[ıi]n\s+b[üu]lteninizi\s+web\s+sitesinde/i.test(line)) continue;
    if (/öne\s*çıkan\s+haberler/i.test(line)) continue;
    if (/^(ülke|website|aylık\s+trafik|hakkında|link|no)\b/i.test(line)) continue;

    if (pushFeaturedOutletFromTableLine(line, push)) continue;

    // Kısa satırlarda yalnızca gerçek http(s) linkleri (Görüntüle URL'si)
    if (line.length <= 200) {
      for (const u of extractHttpUrls(line)) {
        if (isSocialUrl(u)) continue;
        const h = hostnameFromHttpUrl(u);
        if (h) push(h);
      }
    }
  }
  return out;
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
  const compact = normalizeCompactText(text);
  const m1 = compact.match(/\b\d{1,2}[./-]\d{1,2}[./-]\d{2,4}\b/);
  if (m1?.[0]) return normalizeLine(m1[0]);
  const m2 = compact.match(/\b\d{1,2}\s+[A-Za-zÇĞİÖŞÜçğıöşü]+\s+\d{4}\b/);
  return m2?.[0] ? normalizeLine(m2[0]) : null;
}

function pickTitle(lines: string[], fallback: string): string {
  const isTitleStopLine = (line: string) => {
    const x = normalizeLine(line);
    if (!x) return true;
    if (/^(da[ğg][ıi]t[ıi]m tarihi|hedef [üu]lke|da[ğg][ıi]t[ıi]m dili)\b/i.test(x)) return true;
    if (/^(i+\.|ii+\.|iii+\.|iv+\.|v+\.)\s/i.test(x)) return true;
    if (/^(yeni [öo]zellik|ai g[öo]r[üu]n[üu]rl[üu]k)/i.test(x)) return true;
    if (/^\d{1,2}[./-]\d{1,2}[./-]\d{2,4}$/.test(x)) return true;
    if (/^\d{1,3}$/.test(x)) return true;
    if (/^[^\wÇĞİÖŞÜçğıöşü]+$/.test(x)) return true;
    return false;
  };

  const collectTitleAfter = (idx: number) => {
    const chunks: string[] = [];
    for (let i = idx + 1; i < Math.min(lines.length, idx + 6); i += 1) {
      const candidate = normalizeLine(lines[i] || '');
      if (isTitleStopLine(candidate)) break;
      if (/paket|da[ğg][ıi]t[ıi]m|hedef|dil/i.test(candidate)) break;
      chunks.push(candidate);
      if (/[.!?…]$/.test(candidate)) break;
    }
    return normalizeLine(chunks.join(' '));
  };

  // Önce "Basın Bülteni: BAŞLIK" formatında inline başlığı dene (Vercel/serverless sık gönderiyor)
  for (let i = 0; i < lines.length; i += 1) {
    const line = normalizeLine(lines[i] || '');
    const inlineM = line.match(/bas[ıi]n b[üu]lteni\s*:\s*(.+)/i);
    if (inlineM?.[1] && inlineM[1].trim().length > 6) {
      let titleText = inlineM[1].trim();
      // Kısa ise bir sonraki satırı ekle (satır bölünmüş olabilir)
      const nextLine = normalizeLine(lines[i + 1] || '');
      if (
        nextLine &&
        nextLine.length > 2 &&
        nextLine.length < 80 &&
        !isTitleStopLine(nextLine) &&
        !/paket|da[ğg][ıi]t[ıi]m|hedef|dil|^[IVX]+\./i.test(nextLine) &&
        !/[.!?]$/.test(titleText)
      ) {
        titleText = `${titleText} ${nextLine}`;
      }
      const cleaned = normalizeLine(titleText);
      if (cleaned.length > 8) return cleaned;
    }
  }

  const titleCandidates: string[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (/bas[ıi]n b[üu]lteni[:\s-]*$/i.test(normalizeLine(lines[i] || ''))) {
      const merged = collectTitleAfter(i);
      if (merged.length > 8) titleCandidates.push(merged);
    }
  }
  if (titleCandidates.length) {
    titleCandidates.sort((a, b) => b.length - a.length);
    return titleCandidates[0];
  }

  const bulletenIdx = lines.findIndex((x) => /bas[ıi]n b[üu]lteni/i.test(x));
  if (bulletenIdx >= 0) {
    for (let i = bulletenIdx + 1; i < Math.min(lines.length, bulletenIdx + 5); i += 1) {
      const candidate = normalizeLine(lines[i] || '');
      if (candidate && candidate.length > 8 && !/paket|da[ğg][ıi]t[ıi]m|hedef|dil/i.test(candidate)) {
        // YENİÖZELLİK / AI Görünürlük gibi "özellik duyurusu" satırlarını başlık alma
        if (/yeni\s*özellik|yeniözell|ai\s+g[öo]r[üu]n[üu]rl[üu]k/i.test(candidate)) continue;
        return candidate;
      }
    }
  }
  const generic = lines.find(
    (line) =>
      line.length > 18 &&
      !line.match(/^(medya|online|sosyal|genel|yeni\s*özellik|yeniözell|ai\s+g[öo]r[üu]n[üu]rl[üu]k)\b/i)
  );
  return generic || fallback;
}

function pickTitleFromText(text: string): string | null {
  const compact = normalizeCompactText(text);
  const m = compact.match(/bas[ıi]n b[üu]lteni[:\s-]+(.+?)da[ğg][ıi]t[ıi]m tarihi/i);
  if (!m?.[1]) return null;
  let title = normalizeLine(m[1]).replace(/^[:\-–\s]+|[:\-–\s]+$/g, '');
  // "Basın Bülteni Paket: Premium Paket" gibi meta satırlarını kırp
  title = title.replace(/\s*bas[ıi]n b[üu]lteni\s+paket\s*:.*$/i, '').trim();
  // "Paket: xxx" veya "Hedef Ülke:" gibi meta ile başlayan kuyruğu kırp
  title = title.replace(/\s*(paket|hedef\s+[üu]lke|da[ğg][ıi]t[ıi]m)\s*:.*$/i, '').trim();
  return title || null;
}

function parseFirstSectionQuickMetrics(text: string) {
  const compact = normalizeCompactText(text);
  // Format: "domain.com 75 7.896 $7.896 En Çok Kişiye Ulaştıran" (bazı PDF'lerde header satırıyla birleşiyor)
  const m = compact.match(
    /([A-Za-zÇĞİÖŞÜçğıöşü][A-Za-zÇĞİÖŞÜçğıöşü0-9._-]{2,}\.[a-z]{2,})\s+([0-9]{1,4})\s+([0-9][0-9\.,]*)\s+\$?\s*([0-9][0-9\.,]*)\s+En\s*Çok\s*Kişiye\s*Ulaştıran/i
  );
  if (!m) return null;
  // topReach mutlaka domain gibi görünmeli (en az bir nokta + harf)
  const candidate = (m[1] || '').trim();
  if (!candidate.includes('.') || candidate.split('.').length < 2) return null;
  return {
    topReach: candidate,
    coverageCount: m[2] || null,
    adValue: (m[4] || '').replace(/^\$/, '') || null,
  };
}

function pickMetricByLabel(text: string, labels: string[]): string | null {
  for (const label of labels) {
    const re = new RegExp(`${label}\\s*[:\\-]?\\s*\\$?\\s*([0-9][0-9\\.,]*)`, 'i');
    const m = text.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

function isLabelLikeLine(s: string): boolean {
  const x = normalizeLine(s).toLowerCase();
  if (!x) return true;
  return (
    /^i+\.\s*/.test(x) ||
    /basın yansıma raporu özeti|online basın yansıma rapor özeti/.test(x) ||
    /en çok kişiye ulaştıran|en cok kisiye ulastiran/.test(x) ||
    /yansıma sayısı|yansima sayisi|reklam eşdeğeri|reklam esdeger/i.test(x) ||
    /gazeteciye|ulaştırıldı|ulastirildi/.test(x) ||
    /^b2press\b/.test(x)
  );
}

function pickValueBeforeLabel(
  lines: string[],
  labelRe: RegExp,
  matcher: (line: string) => boolean,
  lookback = 6
): string | null {
  const idx = lines.findIndex((x) => labelRe.test(normalizeLine(x)));
  if (idx < 0) return null;
  for (let i = idx - 1; i >= Math.max(0, idx - lookback); i -= 1) {
    const cand = normalizeLine(lines[i] || '');
    if (!cand || isLabelLikeLine(cand)) continue;
    if (matcher(cand)) return cand.replace(/^\$/, '');
  }
  return null;
}

/**
 * Vercel/serverless pdfjs-dist bazen tüm metrik label'larını tek satırda, değerleri de
 * tek satırda birleştirir. Örnek:
 *   "Cumhuriyet.com.tr 75 $7.896"                                (değerler tek satırda)
 *   "En Çok Kişiye Ulaştıran Yansıma Sayısı Reklam Eşdeğerine Ulaştı"  (labellar tek satırda)
 * Bu fonksiyon bu durumu tespit edip değerleri ayrıştırır.
 */
function parseMergedMetricRow(lines: string[]): {
  topReach: string | null;
  coverageCount: string | null;
  adValue: string | null;
} | null {
  // Tüm labelların tek satırda birleştiği satırı bul
  const mergedLabelIdx = lines.findIndex((line) => {
    const x = normalizeLine(line);
    return (
      /en\s*ç[oö]k\s*kişiye\s*ulaştıran|en\s*cok\s*kisiye\s*ulastiran/i.test(x) &&
      /yansıma\s*sayısı|yansima\s*sayisi/i.test(x) &&
      /reklam/i.test(x)
    );
  });
  if (mergedLabelIdx < 0) return null;

  // Değer satırı: label'dan hemen önce ya da sonra
  const candidates = [
    lines[mergedLabelIdx - 1],
    lines[mergedLabelIdx - 2],
    lines[mergedLabelIdx + 1],
  ].filter(Boolean) as string[];

  for (const cand of candidates) {
    const v = normalizeLine(cand);
    if (!v || isLabelLikeLine(v)) continue;
    if (/^(i+\.|ii+\.|basın|medya|online|sosyal|hedef|dağıtım)/i.test(v)) continue;

    const parts = v.split(/\s+/);
    if (parts.length < 3) continue;

    // Son token: adValue (sayı veya $sayı)
    const last = parts[parts.length - 1]?.replace(/^\$/, '') || '';
    if (!/^[\d.,]+$/.test(last)) continue;

    // Format 1 — 3 değer: "TopReach Count $AdValue"
    // "Cumhuriyet.com.tr 75 $7.896"
    const secondLast = parts[parts.length - 2] || '';
    if (/^\d{1,4}$/.test(secondLast)) {
      return {
        topReach: parts.slice(0, parts.length - 2).join(' ').replace(/^\$/, '').trim() || null,
        coverageCount: secondLast,
        adValue: last,
      };
    }

    // Format 2 — 4 değer: "TopReach Count PotentialReach $AdValue"
    // "YeniçağGazetesi 83 803.287 $7.519"
    const thirdLast = parts[parts.length - 3] || '';
    const fourthLast = parts[parts.length - 4] || '';
    if (/^[\d.,]+$/.test(secondLast) && /^\d{1,4}$/.test(thirdLast)) {
      return {
        topReach: parts.slice(0, parts.length - 3).join(' ').replace(/^\$/, '').trim() || null,
        coverageCount: thirdLast,
        adValue: last,
      };
    }
    // Format 2 alt durum — topReach birden fazla token ("Yeniçağ Gazetesi 83 803.287 $7.519")
    if (/^[\d.,]+$/.test(secondLast) && /^[\d.,]+$/.test(thirdLast) && /^\d{1,4}$/.test(fourthLast)) {
      return {
        topReach: parts.slice(0, parts.length - 4).join(' ').replace(/^\$/, '').trim() || null,
        coverageCount: fourthLast,
        adValue: last,
      };
    }
  }
  return null;
}

function parseSectionOneMetrics(lines: string[]) {
  const idxStart = lines.findIndex((x) => /^i\.\s*genel/i.test(x));
  if (idxStart < 0) return null;
  const idxEndRaw = lines.findIndex((x, i) => i > idxStart && /^ii\.\s*online/i.test(x));
  const idxEnd = idxEndRaw > idxStart ? idxEndRaw : Math.min(lines.length, idxStart + 120);
  const section = lines.slice(idxStart, idxEnd);

  // topReach: sadece domain benzeri satır (nokta var + harf var + rakam yok veya az)
  const topReach = pickValueBeforeLabel(
    section,
    /en\s*çok\s*kişiye\s*ulaştıran|en\s*cok\s*kisiye\s*ulastiran/i,
    (s) => {
      const v = s.replace(/^\$/, '').trim();
      // Domain: nokta var, salt rakam degil, çok kısa değil
      if (v.length < 4) return false;
      if (/^\d[\d.,\s]*$/.test(v)) return false; // salt sayı → topReach olamaz
      return /\./.test(v) || /[a-zçğıöşü]{3,}/i.test(v);
    }
  );
  // coverageCount: sadece 1-4 basamaklı tam sayı
  const coverageCount = pickValueBeforeLabel(
    section,
    /yansıma sayısı|yansima sayisi/i,
    (s) => /^\d{1,4}$/.test(s.trim())
  );
  // adValue: para formatı ($xxx veya xxx.yyy veya xxx,yyy)
  const adValue = pickValueBeforeLabel(
    section,
    /reklam/i,
    (s) => /^\$?\s*\d[\d.,\s]*$/.test(s.trim()) && (/\$/.test(s) || /[.,]\d{3}/.test(s))
  );
  // journalistsReached: rakam içeriyor, domain gibi değil
  const journalistsReached = pickValueBeforeLabel(
    section,
    /gazeteciye|ulaştırıldı|ulastirildi/i,
    (s) => /^\d[\d.,\s]*$/.test(s.trim())
  );

  if (!topReach && !coverageCount && !adValue && !journalistsReached) return null;
  return { topReach, coverageCount, adValue, journalistsReached };
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
  if (!pdfUrl) return { ...EMPTY, title: cleanPressReleaseTitle(fallbackTitle) };
  const js = await extractPdfPagesWithPdfJs(pdfUrl);
  const py = js.pages.length ? { pages: [] } : extractPdfPagesWithPython(pdfUrl);
  const txt = js.pages.length || py.pages.length ? { pages: [] } : await extractPdfPagesWithPdf2Json(pdfUrl);
  const selected = js.pages.length ? js : py.pages.length ? py : txt;
  if (selected.error || !selected.pages.length) {
    return {
      ...EMPTY,
      title: cleanPressReleaseTitle(fallbackTitle),
      debug: {
        jsError: js.error,
        textError: txt.error,
        pythonError: py.error,
      },
    };
  }
  const pages = selected.pages.map((p) => ({
    pageNumber: p.pageNumber,
    lines: (p.lines || []).map(normalizeLine).filter(Boolean),
    links: (p.links || []).filter(Boolean),
  }));
  const lines = pages.flatMap((p) => p.lines);
  const annotationUrls = pages.flatMap((p) => p.links);

  const allText = lines.join('\n');
  const quickMetrics = parseFirstSectionQuickMetrics(allText);
  const mergedMetrics = parseMergedMetricRow(lines);
  const domainsFromFullText = extractDomains(allText);
  const domainsFromAnn = extractDomains(annotationUrls.join('\n'));

  const onlineYansimaRows = parseOnlineYansimalarTable(lines);
  const domainsFeatured = parseOneCikanOnlineBasin(lines);

  let domains: string[];
  if (onlineYansimaRows.length) {
    domains = onlineYansimaRows.map((r) => {
      const o = r.outlet.trim();
      if (/^https?:\/\//i.test(o)) return hostnameFromHttpUrl(o) || o;
      return o.replace(/^www\./, '');
    });
  } else if (domainsFeatured.length) {
    domains = [...domainsFeatured];
  } else {
    domains = Array.from(new Set([...domainsFromFullText, ...domainsFromAnn]));
  }

  const sectionOne = parseSectionOneMetrics(lines);

  // journalistsReached: karma metin+sayı satırından sadece sayıyı çıkar
  // "Medya listesi - D ü nya 3.612 Ulaştırıldı" → "3.612"
  function extractNumberFromLine(raw: string | null): string | null {
    if (!raw) return null;
    // Önce salt sayı mı?
    if (/^\d[\d.,\s]*$/.test(raw.trim())) return raw.trim();
    // Değilse metin içindeki sayıyı bul (3+ basamak veya binlik ayraçlı)
    const m = raw.match(/\b(\d{1,3}(?:[.,]\d{3})+|\d{4,})\b/);
    return m?.[1] || null;
  }

  const topReach =
    mergedMetrics?.topReach ||
    quickMetrics?.topReach ||
    sectionOne?.topReach ||
    findNearValue(lines, /en\s*çok\s*kişiye\s*ulaştıran|en\s*cok\s*kisiye\s*ulastiran/i) ||
    domains[0] ||
    null;
  const coverageCount =
    mergedMetrics?.coverageCount ||
    quickMetrics?.coverageCount ||
    sectionOne?.coverageCount ||
    pickMetricByLabel(allText, ['yansıma sayısı', 'yayin sayisi', 'yayın sayısı']) ||
    findNearValue(lines, /yansıma sayısı|yansima sayisi/i, true);
  const adValue =
    mergedMetrics?.adValue ||
    quickMetrics?.adValue ||
    sectionOne?.adValue ||
    pickMetricByLabel(allText, ['reklam eşdeğeri', 'reklam esdegeri', 'reklam eşdeğerine ulaştı']) ||
    findNearValue(lines, /reklam/i, true);
  const rawJournalists =
    sectionOne?.journalistsReached ||
    pickMetricByLabel(allText, ['gazeteciye ulaştırıldı', 'gazeteciye ulastirildi']) ||
    findNearValue(lines, /gazeteci/i, true);
  const journalistsReached = extractNumberFromLine(rawJournalists);
  const aiFromPdf = parseAiScoreToTenScale(allText);
  const aiScore =
    aiFromPdf ?? syntheticAiScoreOutOfTen(`${pdfUrl}\0${fallbackTitle || 'medya-raporu'}`);

  const socialLinks = Array.from(
    new Set(
      [...annotationUrls, ...extractHttpUrls(allText)]
        .map((u) => u.trim())
        .filter((u) => /^https?:\/\//i.test(u))
        .filter((u) => isSocialUrl(u))
        .map((u) => sanitizeSocialUrl(u))
        .filter((u) => isUsefulSocialUrl(u))
        .filter(Boolean)
    )
  ).slice(0, 120);
  const socialRows = parseSocialRowsFromLines(lines);

  const rawTitle = pickTitleFromText(allText) || pickTitle(lines, fallbackTitle);
  const pdfFormat = detectPdfFormat(lines);
  return {
    title: cleanPressReleaseTitle(rawTitle),
    publishedAt: pickDate(allText),
    aiScore,
    coverageCount: coverageCount || null,
    adValue: (adValue || '').replace(/^\$/, '') || null,
    journalistsReached: journalistsReached || null,
    topReach: topReach || null,
    pdfFormat,
    domains,
    domainsFeatured,
    onlineYansimaRows,
    socialItems: socialRows.length ? socialRows.map((r) => r.url) : socialLinks,
    socialRows,
    pages,
    sourceMode:
      onlineYansimaRows.length > 0 || domainsFeatured.length > 0
        ? 'text'
        : domainsFromFullText.length
          ? 'text'
          : domainsFromAnn.length
            ? 'annotations'
            : 'fallback',
  };
}
