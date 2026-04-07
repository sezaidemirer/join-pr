/**
 * PDF / metin çıktısındaki görünmez karakterleri ve ligatür sonrası oluşan
 * "misa fi rlerine" / "misafi rlerine" (ﬁ tek glif + boşluk) gibi kırıkları düzeltir.
 */
export function cleanPressReleaseTitle(raw: string): string {
  let s = String(raw || '')
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
    .normalize('NFC')
    // PDF / font tek glif ligatürleri → ASCII (U+FB01 ﬁ vb.)
    .replace(/\uFB03/gi, 'ffi')
    .replace(/\uFB04/gi, 'ffl')
    .replace(/\uFB00/gi, 'ff')
    .replace(/\uFB01/gi, 'fi')
    .replace(/\uFB02/gi, 'fl')
    .replace(/\s+/g, ' ')
    .trim();

  let prev = '';
  while (prev !== s) {
    prev = s;
    // "misa fi rlerine" — fi etrafında boşluk
    s = s.replace(
      /([A-Za-zÇĞİÖŞÜçğıöşü]{2,})\s+fi\s+([A-Za-zÇĞİÖŞÜçğıöşü]{2,})/gi,
      '$1fi$2'
    );
    s = s.replace(
      /([A-Za-zÇĞİÖŞÜçğıöşü]{2,})\s+fl\s+([A-Za-zÇĞİÖŞÜçğıöşü]{2,})/gi,
      '$1fl$2'
    );
    // "misafi rlerine" — fi bitişik, sonrasında yanlış boşluk (ligatür açıldıktan sonra tipik)
    s = s.replace(
      /([A-Za-zÇĞİÖŞÜçğıöşü]{2,})fi\s+([A-Za-zÇĞİÖŞÜçğıöşü]{2,})/gi,
      '$1fi$2'
    );
    s = s.replace(
      /([A-Za-zÇĞİÖŞÜçğıöşü]{2,})fl\s+([A-Za-zÇĞİÖŞÜçğıöşü]{2,})/gi,
      '$1fl$2'
    );
  }
  return s;
}
