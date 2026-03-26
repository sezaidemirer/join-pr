import type { MonthDetail, MonthlyIntelRow } from '@/types/monthlyIntel';

// Klinik sayfası için: tur/tatil kelimesi yok; diş hekimi, saç ekimi, estetik, check-up türkiye
export const MOCK_MONTH_DATA_CLINIC: Record<number, Omit<MonthDetail, keyof MonthlyIntelRow>> = {
  1: {
    trend_keywords: [
      { id: 'c1', keyword: 'diş hekimi türkiye', category: 'dental', market: 'external', volume: 12400, yoy_change_pct: 18, mom_change_pct: 12, source: 'manual' },
      { id: 'c2', keyword: 'saç ekimi türkiye', category: 'esthetic', market: 'external', volume: 15800, yoy_change_pct: 22, mom_change_pct: 15, source: 'manual' },
      { id: 'c3', keyword: 'check-up türkiye', category: 'medical', market: 'external', volume: 5200, yoy_change_pct: 20, mom_change_pct: 18, source: 'manual' },
      { id: 'c4', keyword: 'estetik türkiye', category: 'esthetic', market: 'external', volume: 9800, yoy_change_pct: 16, mom_change_pct: 10, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Saç Ekimi', market: 'external', rank: 1, notes: 'Yurt dışı talep yüksek' },
      { id: 't2', tour_category: 'Diş Hekimliği', market: 'external', rank: 2, notes: 'İmplant ve tedavi talebi' },
      { id: 't3', tour_category: 'Estetik', market: 'external', rank: 3, notes: 'Yıl başı rezervasyonları' },
    ],
    events: [
      { id: 'e1', start_date: '2024-01-01', end_date: null, event_type: 'health_tourism', title: 'Yıl başı medikal rezervasyon dönemi', description: '', impact_level: 'high', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Ocak ayı yurt dışından diş hekimi, saç ekimi ve estetik aramalarında artış görüldü. Check-up paketleri talep gördü. Avrupa kaynaklı medikal talep güçlü.' }],
  },
  2: {
    trend_keywords: [
      { id: 'c1', keyword: 'diş hekimi türkiye', category: 'dental', market: 'external', volume: 11800, yoy_change_pct: 14, mom_change_pct: -3, source: 'manual' },
      { id: 'c2', keyword: 'saç ekimi türkiye', category: 'esthetic', market: 'external', volume: 14200, yoy_change_pct: 20, mom_change_pct: -5, source: 'manual' },
      { id: 'c3', keyword: 'göz lazer türkiye', category: 'medical', market: 'external', volume: 4100, yoy_change_pct: 18, mom_change_pct: 8, source: 'manual' },
      { id: 'c4', keyword: 'implant türkiye', category: 'dental', market: 'external', volume: 8600, yoy_change_pct: 22, mom_change_pct: 6, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Saç Ekimi', market: 'external', rank: 1, notes: 'Erken rezervasyon yoğun' },
      { id: 't2', tour_category: 'Diş / İmplant', market: 'external', rank: 2, notes: 'Fiyat avantajı talebi' },
      { id: 't3', tour_category: 'Göz Lazer', market: 'external', rank: 3, notes: 'Talep artıyor' },
    ],
    events: [
      { id: 'e1', start_date: '2024-02-01', end_date: null, event_type: 'health_tourism', title: 'Medikal erken rezervasyon dönemi – diş, estetik', description: '', impact_level: 'med', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Şubat ayında diş hekimi, saç ekimi ve implant aramaları yurt dışı pazarında güçlü. Göz lazer talebi arttı. Döviz kuru medikal fiyatlamayı etkiliyor.' }],
  },
  3: {
    trend_keywords: [
      { id: 'c1', keyword: 'saç ekimi türkiye', category: 'esthetic', market: 'external', volume: 18200, yoy_change_pct: 28, mom_change_pct: 22, source: 'manual' },
      { id: 'c2', keyword: 'diş hekimi türkiye', category: 'dental', market: 'external', volume: 13200, yoy_change_pct: 16, mom_change_pct: 10, source: 'manual' },
      { id: 'c3', keyword: 'estetik türkiye', category: 'esthetic', market: 'external', volume: 11200, yoy_change_pct: 20, mom_change_pct: 14, source: 'manual' },
      { id: 'c4', keyword: 'check-up türkiye', category: 'medical', market: 'external', volume: 4800, yoy_change_pct: 18, mom_change_pct: 8, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Saç Ekimi', market: 'external', rank: 1, notes: 'Bahar sezonu zirve' },
      { id: 't2', tour_category: 'Estetik', market: 'external', rank: 2, notes: 'Yurt dışı talep yüksek' },
      { id: 't3', tour_category: 'Diş Hekimliği', market: 'external', rank: 3, notes: 'İmplant talebi artıyor' },
    ],
    events: [
      { id: 'e1', start_date: '2024-03-01', end_date: null, event_type: 'health_tourism', title: 'Bahar medikal sezonu – saç ekimi, estetik talebi', description: '', impact_level: 'high', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Mart ayı saç ekimi ve estetik aramalarında belirgin artış. Diş hekimi ve implant talebi yüksek. Check-up paketleri talep gördü. Yurt dışı hasta akışı güçlendi.' }],
  },
  4: {
    trend_keywords: [
      { id: 'c1', keyword: 'diş hekimi türkiye', category: 'dental', market: 'external', volume: 14800, yoy_change_pct: 18, mom_change_pct: 10, source: 'manual' },
      { id: 'c2', keyword: 'saç ekimi türkiye', category: 'esthetic', market: 'external', volume: 19600, yoy_change_pct: 26, mom_change_pct: 6, source: 'manual' },
      { id: 'c3', keyword: 'estetik türkiye', category: 'esthetic', market: 'external', volume: 12800, yoy_change_pct: 22, mom_change_pct: 12, source: 'manual' },
      { id: 'c4', keyword: 'göz lazer türkiye', category: 'medical', market: 'external', volume: 5400, yoy_change_pct: 16, mom_change_pct: 14, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Saç Ekimi', market: 'external', rank: 1, notes: 'Nisan talep zirvesi' },
      { id: 't2', tour_category: 'Estetik', market: 'external', rank: 2, notes: 'Yurt dışı rezervasyonlar' },
      { id: 't3', tour_category: 'Diş Hekimliği', market: 'external', rank: 3, notes: 'İmplant ve tedavi' },
    ],
    events: [
      { id: 'e1', start_date: '2024-04-01', end_date: null, event_type: 'health_tourism', title: 'Sağlık turizmi bahar kampanyaları', description: '', impact_level: 'high', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Nisan ayı diş hekimi, saç ekimi ve estetik aramalarında güçlü talep. Göz lazer talebi arttı. Yurt dışı medikal rezervasyonlar hızlandı.' }],
  },
  5: {
    trend_keywords: [
      { id: 'c1', keyword: 'saç ekimi türkiye', category: 'esthetic', market: 'external', volume: 22400, yoy_change_pct: 30, mom_change_pct: 12, source: 'manual' },
      { id: 'c2', keyword: 'diş hekimi türkiye', category: 'dental', market: 'external', volume: 16200, yoy_change_pct: 20, mom_change_pct: 8, source: 'manual' },
      { id: 'c3', keyword: 'estetik türkiye', category: 'esthetic', market: 'external', volume: 14200, yoy_change_pct: 24, mom_change_pct: 10, source: 'manual' },
      { id: 'c4', keyword: 'implant türkiye', category: 'dental', market: 'external', volume: 10200, yoy_change_pct: 26, mom_change_pct: 14, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Saç Ekimi', market: 'external', rank: 1, notes: 'Yaz öncesi zirve' },
      { id: 't2', tour_category: 'Diş / İmplant', market: 'external', rank: 2, notes: 'Yurt dışı talep yüksek' },
      { id: 't3', tour_category: 'Estetik', market: 'external', rank: 3, notes: 'Rezervasyonlar arttı' },
    ],
    events: [
      { id: 'e1', start_date: '2024-05-01', end_date: null, event_type: 'health_tourism', title: 'Medikal turizm yaz sezonu açılışı', description: '', impact_level: 'high', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Mayıs ayı saç ekimi, diş hekimi ve estetik aramalarında zirve. İmplant talebi güçlü. Yurt dışı hasta rezervasyonları yaz sezonu için hızlandı.' }],
  },
  6: {
    trend_keywords: [
      { id: 'c1', keyword: 'saç ekimi türkiye', category: 'esthetic', market: 'external', volume: 24800, yoy_change_pct: 32, mom_change_pct: 8, source: 'manual' },
      { id: 'c2', keyword: 'diş hekimi türkiye', category: 'dental', market: 'external', volume: 17800, yoy_change_pct: 22, mom_change_pct: 8, source: 'manual' },
      { id: 'c3', keyword: 'estetik türkiye', category: 'esthetic', market: 'external', volume: 15600, yoy_change_pct: 26, mom_change_pct: 8, source: 'manual' },
      { id: 'c4', keyword: 'check-up türkiye', category: 'medical', market: 'external', volume: 6200, yoy_change_pct: 20, mom_change_pct: 12, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Saç Ekimi', market: 'external', rank: 1, notes: 'Yaz sezonu zirve' },
      { id: 't2', tour_category: 'Estetik', market: 'external', rank: 2, notes: 'Yurt dışı talep çok yüksek' },
      { id: 't3', tour_category: 'Diş Hekimliği', market: 'external', rank: 3, notes: 'İmplant ve tedavi' },
    ],
    events: [
      { id: 'e1', start_date: '2024-06-01', end_date: null, event_type: 'health_tourism', title: 'Yaz medikal sezonu – saç ekimi, diş, estetik zirve', description: '', impact_level: 'high', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Haziran ayı saç ekimi ve estetik aramalarında yıllık zirve. Diş hekimi ve implant talebi güçlü. Check-up paketleri talep gördü.' }],
  },
  7: {
    trend_keywords: [
      { id: 'c1', keyword: 'saç ekimi türkiye', category: 'esthetic', market: 'external', volume: 26200, yoy_change_pct: 28, mom_change_pct: 4, source: 'manual' },
      { id: 'c2', keyword: 'diş hekimi türkiye', category: 'dental', market: 'external', volume: 19200, yoy_change_pct: 24, mom_change_pct: 6, source: 'manual' },
      { id: 'c3', keyword: 'estetik türkiye', category: 'esthetic', market: 'external', volume: 16800, yoy_change_pct: 28, mom_change_pct: 6, source: 'manual' },
      { id: 'c4', keyword: 'göz lazer türkiye', category: 'medical', market: 'external', volume: 5800, yoy_change_pct: 18, mom_change_pct: 6, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Saç Ekimi', market: 'external', rank: 1, notes: 'Temmuz zirve dönemi' },
      { id: 't2', tour_category: 'Estetik', market: 'external', rank: 2, notes: 'Yurt dışı talep yüksek' },
      { id: 't3', tour_category: 'Diş Hekimliği', market: 'external', rank: 3, notes: 'Yaz sezonu doluluk' },
    ],
    events: [
      { id: 'e1', start_date: '2024-07-01', end_date: null, event_type: 'health_tourism', title: 'Yaz medikal zirvesi – estetik, diş, saç ekimi', description: '', impact_level: 'high', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Temmuz ayı saç ekimi, diş hekimi ve estetik aramalarında yaz zirvesi. Göz lazer talebi arttı. Yurt dışı hasta doluluk oranları yüksek.' }],
  },
  8: {
    trend_keywords: [
      { id: 'c1', keyword: 'saç ekimi türkiye', category: 'esthetic', market: 'external', volume: 22800, yoy_change_pct: 26, mom_change_pct: -10, source: 'manual' },
      { id: 'c2', keyword: 'diş hekimi türkiye', category: 'dental', market: 'external', volume: 17200, yoy_change_pct: 20, mom_change_pct: -8, source: 'manual' },
      { id: 'c3', keyword: 'estetik türkiye', category: 'esthetic', market: 'external', volume: 14800, yoy_change_pct: 24, mom_change_pct: -8, source: 'manual' },
      { id: 'c4', keyword: 'implant türkiye', category: 'dental', market: 'external', volume: 9800, yoy_change_pct: 22, mom_change_pct: -4, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Saç Ekimi', market: 'external', rank: 1, notes: 'Ağustos yoğun talep' },
      { id: 't2', tour_category: 'Diş / İmplant', market: 'external', rank: 2, notes: 'Yaz sonu rezervasyonlar' },
      { id: 't3', tour_category: 'Estetik', market: 'external', rank: 3, notes: 'Talep yüksek' },
    ],
    events: [
      { id: 'e1', start_date: '2024-08-01', end_date: null, event_type: 'health_tourism', title: 'Yaz sonu medikal sezonu', description: '', impact_level: 'med', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Ağustos ayı saç ekimi, diş hekimi ve estetik aramalarında yaz sonu yoğunluğu. İmplant talebi güçlü. Eylül rezervasyonları başladı.' }],
  },
  9: {
    trend_keywords: [
      { id: 'c1', keyword: 'diş hekimi türkiye', category: 'dental', market: 'external', volume: 15200, yoy_change_pct: 18, mom_change_pct: -8, source: 'manual' },
      { id: 'c2', keyword: 'saç ekimi türkiye', category: 'esthetic', market: 'external', volume: 18600, yoy_change_pct: 24, mom_change_pct: -12, source: 'manual' },
      { id: 'c3', keyword: 'estetik türkiye', category: 'esthetic', market: 'external', volume: 12200, yoy_change_pct: 20, mom_change_pct: -14, source: 'manual' },
      { id: 'c4', keyword: 'check-up türkiye', category: 'medical', market: 'external', volume: 5600, yoy_change_pct: 22, mom_change_pct: 10, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Saç Ekimi', market: 'external', rank: 1, notes: 'Sonbahar talep iyi' },
      { id: 't2', tour_category: 'Diş Hekimliği', market: 'external', rank: 2, notes: 'Eylül rezervasyonları' },
      { id: 't3', tour_category: 'Check-up', market: 'external', rank: 3, notes: 'Sonbahar paketleri' },
    ],
    events: [
      { id: 'e1', start_date: '2024-09-01', end_date: null, event_type: 'health_tourism', title: 'Sonbahar medikal rezervasyon dönemi', description: '', impact_level: 'med', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Eylül ayı saç ekimi ve diş hekimi aramalarında sonbahar talebi. Check-up paketleri talep gördü. Estetik aramaları normal seviyede.' }],
  },
  10: {
    trend_keywords: [
      { id: 'c1', keyword: 'diş hekimi türkiye', category: 'dental', market: 'external', volume: 14200, yoy_change_pct: 16, mom_change_pct: -4, source: 'manual' },
      { id: 'c2', keyword: 'saç ekimi türkiye', category: 'esthetic', market: 'external', volume: 16800, yoy_change_pct: 22, mom_change_pct: -6, source: 'manual' },
      { id: 'c3', keyword: 'estetik türkiye', category: 'esthetic', market: 'external', volume: 11400, yoy_change_pct: 18, mom_change_pct: -4, source: 'manual' },
      { id: 'c4', keyword: 'göz lazer türkiye', category: 'medical', market: 'external', volume: 5000, yoy_change_pct: 16, mom_change_pct: 6, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Saç Ekimi', market: 'external', rank: 1, notes: 'Ekim talep iyi' },
      { id: 't2', tour_category: 'Diş Hekimliği', market: 'external', rank: 2, notes: 'Sonbahar rezervasyonlar' },
      { id: 't3', tour_category: 'Göz Lazer', market: 'external', rank: 3, notes: 'Talep artıyor' },
    ],
    events: [
      { id: 'e1', start_date: '2024-10-01', end_date: null, event_type: 'health_tourism', title: 'Sonbahar sağlık turizmi – check-up, göz lazer', description: '', impact_level: 'med', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Ekim ayı diş hekimi, saç ekimi ve estetik aramalarında sonbahar talebi. Göz lazer ve check-up paketleri talep gördü. Döviz kuru fiyatlamayı etkiliyor.' }],
  },
  11: {
    trend_keywords: [
      { id: 'c1', keyword: 'diş hekimi türkiye', category: 'dental', market: 'external', volume: 13800, yoy_change_pct: 18, mom_change_pct: -2, source: 'manual' },
      { id: 'c2', keyword: 'saç ekimi türkiye', category: 'esthetic', market: 'external', volume: 16200, yoy_change_pct: 24, mom_change_pct: -2, source: 'manual' },
      { id: 'c3', keyword: 'check-up türkiye', category: 'medical', market: 'external', volume: 6200, yoy_change_pct: 24, mom_change_pct: 14, source: 'manual' },
      { id: 'c4', keyword: 'estetik türkiye', category: 'esthetic', market: 'external', volume: 10800, yoy_change_pct: 16, mom_change_pct: -4, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Saç Ekimi', market: 'external', rank: 1, notes: 'Yıl sonu rezervasyonlar' },
      { id: 't2', tour_category: 'Diş Hekimliği', market: 'external', rank: 2, notes: 'Kasım talep iyi' },
      { id: 't3', tour_category: 'Check-up', market: 'external', rank: 3, notes: 'Yıl sonu paketleri' },
    ],
    events: [
      { id: 'e1', start_date: '2024-11-01', end_date: null, event_type: 'health_tourism', title: 'Yıl sonu medikal rezervasyon dönemi', description: '', impact_level: 'med', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Kasım ayı diş hekimi, saç ekimi ve check-up aramalarında yıl sonu talebi. Estetik aramaları stabil. Aralık için rezervasyonlar hızlanıyor.' }],
  },
  12: {
    trend_keywords: [
      { id: 'c1', keyword: 'diş hekimi türkiye', category: 'dental', market: 'external', volume: 14800, yoy_change_pct: 20, mom_change_pct: 6, source: 'manual' },
      { id: 'c2', keyword: 'saç ekimi türkiye', category: 'esthetic', market: 'external', volume: 17200, yoy_change_pct: 22, mom_change_pct: 4, source: 'manual' },
      { id: 'c3', keyword: 'estetik türkiye', category: 'esthetic', market: 'external', volume: 11800, yoy_change_pct: 18, mom_change_pct: 8, source: 'manual' },
      { id: 'c4', keyword: 'check-up türkiye', category: 'medical', market: 'external', volume: 7200, yoy_change_pct: 26, mom_change_pct: 14, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Saç Ekimi', market: 'external', rank: 1, notes: 'Yıl sonu talep' },
      { id: 't2', tour_category: 'Diş Hekimliği', market: 'external', rank: 2, notes: 'Aralık rezervasyonlar' },
      { id: 't3', tour_category: 'Check-up', market: 'external', rank: 3, notes: 'Yıl başı paketleri' },
    ],
    events: [
      { id: 'e1', start_date: '2024-12-01', end_date: null, event_type: 'health_tourism', title: 'Yıl sonu medikal talep – check-up, yeni yıl rezervasyonları', description: '', impact_level: 'high', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Aralık ayı diş hekimi, saç ekimi ve estetik aramalarında yıl sonu hareketliliği. Check-up paketleri yıl başı için talep gördü. Ocak rezervasyonları planlanmalı.' }],
  },
};
