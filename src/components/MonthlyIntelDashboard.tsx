'use client';

import { useEffect, useState } from 'react';
import { MOCK_MONTH_DATA_CLINIC } from '@/data/monthlyIntelClinic';
import type { MonthDetail, MonthlyIntelRow } from '@/types/monthlyIntel';

const MONTH_NAMES = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

export type { MonthDetail, MonthlyIntelRow };

type TrendKeyword = {
  id: string;
  keyword: string;
  category: string | null;
  market: string | null;
  volume: number | null;
  yoy_change_pct: number | null;
  mom_change_pct: number | null;
  source: string | null;
};

type TrendTour = {
  id: string;
  tour_category: string;
  market: string | null;
  rank: number | null;
  notes: string | null;
};

type MonthlyEvent = {
  id: string;
  start_date: string | null;
  end_date: string | null;
  event_type: string | null;
  title: string;
  description: string | null;
  impact_level: string | null;
  impacted_markets: string | null;
};

type MonthlyNote = {
  id: string;
  insight: string;
};

const MOCK_GRID: MonthlyIntelRow[] = [
  { id: 'mock-1', year: 2025, month: 1, total_search_volume: 118000, internal_search_volume: 72000, external_search_volume: 46000, demand_index: 0.82, trends_index: 42 },
  { id: 'mock-2', year: 2025, month: 2, total_search_volume: 95200, internal_search_volume: 58100, external_search_volume: 37100, demand_index: 0.71, trends_index: 38 },
  { id: 'mock-3', year: 2025, month: 3, total_search_volume: 142000, internal_search_volume: 98400, external_search_volume: 43600, demand_index: 1.05, trends_index: 55 },
  { id: 'mock-4', year: 2025, month: 4, total_search_volume: 128500, internal_search_volume: 72400, external_search_volume: 56100, demand_index: 0.98, trends_index: 52 },
  { id: 'mock-5', year: 2025, month: 5, total_search_volume: 135200, internal_search_volume: 61200, external_search_volume: 74000, demand_index: 1.02, trends_index: 58 },
  { id: 'mock-6', year: 2025, month: 6, total_search_volume: 168400, internal_search_volume: 89200, external_search_volume: 79200, demand_index: 1.24, trends_index: 68 },
  { id: 'mock-7', year: 2025, month: 7, total_search_volume: 184200, internal_search_volume: 68500, external_search_volume: 115700, demand_index: 1.32, trends_index: 72 },
  { id: 'mock-8', year: 2025, month: 8, total_search_volume: 176800, internal_search_volume: 58200, external_search_volume: 118600, demand_index: 1.28, trends_index: 70 },
  { id: 'mock-9', year: 2025, month: 9, total_search_volume: 112600, internal_search_volume: 53400, external_search_volume: 59200, demand_index: 0.89, trends_index: 48 },
  { id: 'mock-10', year: 2025, month: 10, total_search_volume: 108200, internal_search_volume: 62800, external_search_volume: 45400, demand_index: 0.85, trends_index: 45 },
  { id: 'mock-11', year: 2025, month: 11, total_search_volume: 124800, internal_search_volume: 72800, external_search_volume: 52000, demand_index: 0.94, trends_index: 50 },
  { id: 'mock-12', year: 2025, month: 12, total_search_volume: 148600, internal_search_volume: 91200, external_search_volume: 57400, demand_index: 1.12, trends_index: 62 },
];

// Türkiye turizmine göre aylık istihbarat: özel günler, sağlık turizmi, termal, medikal/diş/estetik gündemleri
const MOCK_MONTH_DATA: Record<number, Omit<MonthDetail, keyof MonthlyIntelRow>> = {
  1: {
    trend_keywords: [
      { id: 'k1', keyword: 'kapadokya kış turu', category: 'destination', market: 'internal', volume: 9800, yoy_change_pct: 12, mom_change_pct: -8, source: 'manual' },
      { id: 'k2', keyword: 'termal otel kış', category: 'health_tourism', market: 'internal', volume: 6200, yoy_change_pct: 18, mom_change_pct: 14, source: 'manual' },
      { id: 'k3', keyword: 'yılbaşı tatil', category: 'generic', market: 'both', volume: 18500, yoy_change_pct: 4, mom_change_pct: 15, source: 'manual' },
      { id: 'k4', keyword: 'check-up turizmi', category: 'health_tourism', market: 'external', volume: 3100, yoy_change_pct: 22, mom_change_pct: 8, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Kapadokya', market: 'internal', rank: 1, notes: 'Kış sezonu talep yüksek' },
      { id: 't2', tour_category: 'Termal / Kaplıca', market: 'internal', rank: 2, notes: 'Kış termal sezonu; Afyon, Bursa, Yalova talebi' },
      { id: 't3', tour_category: 'Uzak Doğu', market: 'external', rank: 3, notes: 'Japonya depremi nedeniyle talep düştü' },
    ],
    events: [
      { id: 'e1', start_date: '2024-01-01', end_date: '2024-01-01', event_type: 'holiday', title: '1 Ocak Yılbaşı – resmi tatil', description: '', impact_level: 'high', impacted_markets: 'both' },
      { id: 'e2', start_date: '2024-01-01', end_date: null, event_type: 'disaster', title: "Japonya Noto depremi (7.5 büyüklük) – uzak doğu turizminde düşüş", description: 'Deprem sonrası Japonya aramaları belirgin düştü.', impact_level: 'high', impacted_markets: 'external' },
      { id: 'e3', start_date: '2024-01-01', end_date: '2024-01-31', event_type: 'health_tourism', title: 'Kış termal sezonu – sağlık turizmi talebi (termal otel, kaplıca)', description: 'İç pazar termal ve wellness aramaları artışta.', impact_level: 'med', impacted_markets: 'internal' },
    ],
    notes: [{ id: 'n1', insight: 'Ocak ayı Japonya depremi nedeniyle Uzak Doğu rotalarında belirgin talep düşüşü yaşandı. İç pazar Kapadokya kış turlarına ve termal/kaplıca otellerine odaklandı. Yıl başı check-up ve medikal turizm talebi (özellikle yurt dışından) arttı. Önümüzdeki ay yerel seçim öncesi beklentiler ve faiz kararları takip edilmeli.' }],
  },
  2: {
    trend_keywords: [
      { id: 'k1', keyword: 'balkan turu', category: 'destination', market: 'external', volume: 11200, yoy_change_pct: 8, mom_change_pct: 5, source: 'manual' },
      { id: 'k2', keyword: 'termal tatil şubat', category: 'health_tourism', market: 'internal', volume: 5400, yoy_change_pct: 14, mom_change_pct: 6, source: 'manual' },
      { id: 'k3', keyword: 'antep turu', category: 'destination', market: 'internal', volume: 6800, yoy_change_pct: 15, mom_change_pct: 3, source: 'manual' },
      { id: 'k4', keyword: 'ucuz tatil', category: 'deal', market: 'both', volume: 14500, yoy_change_pct: 18, mom_change_pct: -5, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Balkan', market: 'external', rank: 1, notes: 'Bütçe dostu alternatif talep artıyor' },
      { id: 't2', tour_category: 'Termal / Wellness', market: 'internal', rank: 2, notes: 'Sevgililer Günü ve kış termal paketleri' },
      { id: 't3', tour_category: 'Güneydoğu Anadolu', market: 'internal', rank: 3, notes: 'Kültür turizminde artış' },
    ],
    events: [
      { id: 'e1', start_date: '2024-02-14', end_date: '2024-02-14', event_type: 'holiday', title: '14 Şubat Sevgililer Günü – romantik tatil ve wellness paketleri talebi', description: '', impact_level: 'med', impacted_markets: 'internal' },
      { id: 'e2', start_date: '2024-02-01', end_date: '2024-02-28', event_type: 'fx', title: 'TL volatilitesi – döviz kuru belirsizliği', description: 'Yerel seçim öncesi TL dalgalı seyretti.', impact_level: 'high', impacted_markets: 'both' },
      { id: 'e3', start_date: '2024-02-01', end_date: null, event_type: 'health_tourism', title: 'Sağlık turizmi gündemi – diş ve estetik erken rezervasyon dönemi', description: 'Avrupa kaynaklı medikal turizm sorguları artıyor.', impact_level: 'med', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Şubat ayında döviz kuru ve seçim beklentisi tatil kararlarını etkiledi. Balkan rotaları daha uygun maliyet nedeniyle öne çıktı. Termal otel ve Sevgililer Günü wellness paketleri iç pazarda talep gördü. Sağlık turizmi (diş, estetik) erken rezervasyon dönemi başladı. Mart yerel seçimleri sonrası talep netleşmesi bekleniyor.' }],
  },
  3: {
    trend_keywords: [
      { id: 'k1', keyword: 'ramazan turu', category: 'generic', market: 'internal', volume: 15600, yoy_change_pct: 22, mom_change_pct: 18, source: 'manual' },
      { id: 'k2', keyword: 'umre', category: 'destination', market: 'internal', volume: 23400, yoy_change_pct: 10, mom_change_pct: 25, source: 'manual' },
      { id: 'k3', keyword: 'kadınlar günü tatil', category: 'generic', market: 'internal', volume: 4200, yoy_change_pct: 12, mom_change_pct: 20, source: 'manual' },
      { id: 'k4', keyword: 'balkan turu 2024', category: 'destination', market: 'external', volume: 9800, yoy_change_pct: 6, mom_change_pct: -3, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Umre', market: 'internal', rank: 1, notes: 'Ramazan dönemi zirve talep' },
      { id: 't2', tour_category: 'Balkan', market: 'external', rank: 2, notes: 'Erken bahar rezervasyonları' },
      { id: 't3', tour_category: 'Wellness / Spa', market: 'internal', rank: 3, notes: '8 Mart paketleri; termal devam' },
    ],
    events: [
      { id: 'e1', start_date: '2024-03-08', end_date: '2024-03-08', event_type: 'holiday', title: '8 Mart Dünya Kadınlar Günü – kısa tatil ve wellness/spa talebi', description: '', impact_level: 'med', impacted_markets: 'internal' },
      { id: 'e2', start_date: '2024-03-11', end_date: '2024-04-09', event_type: 'holiday', title: 'Ramazan ayı – umre ve ramazan turları zirve', description: '', impact_level: 'high', impacted_markets: 'internal' },
      { id: 'e3', start_date: '2024-03-31', end_date: null, event_type: 'regulation', title: 'Yerel seçimler – tüketici harcama davranışında bekleyiş', description: '', impact_level: 'med', impacted_markets: 'both' },
      { id: 'e4', start_date: '2024-03-01', end_date: null, event_type: 'health_tourism', title: 'Bahar termal sezonu başlangıcı – sağlık turizmi talebi', description: 'Termal otel ve kaplıca aramaları artışta.', impact_level: 'med', impacted_markets: 'internal' },
    ],
    notes: [{ id: 'n1', insight: 'Mart ayı ramazan ve umre talebinde güçlü artış getirdi. 8 Mart Kadınlar Günü kısa tatil ve wellness paketlerinde hareketlilik görüldü. Yerel seçimler (31 Mart) tatil harcamalarında kısa süreli tereddüt yarattı. Bahar termal sezonu ve sağlık turizmi gündemi güçlendi. Nisan ayında bahar turları, 23 Nisan tatili ve yaz rezervasyonları hızlanacak.' }],
  },
  4: {
    trend_keywords: [
      { id: 'k1', keyword: '23 nisan tatil', category: 'generic', market: 'internal', volume: 18900, yoy_change_pct: 14, mom_change_pct: 12, source: 'manual' },
      { id: 'k2', keyword: 'kapadokya balon turu', category: 'destination', market: 'both', volume: 14200, yoy_change_pct: 9, mom_change_pct: 8, source: 'manual' },
      { id: 'k3', keyword: 'ramazan bayramı tatil', category: 'generic', market: 'internal', volume: 22100, yoy_change_pct: 11, mom_change_pct: 18, source: 'manual' },
      { id: 'k4', keyword: 'yurt dışı tur', category: 'generic', market: 'external', volume: 9800, yoy_change_pct: 5, mom_change_pct: 6, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Kapadokya', market: 'both', rank: 1, notes: 'Bahar sezonu balon turları; 23 Nisan aile tatili' },
      { id: 't2', tour_category: 'Yunanistan', market: 'external', rank: 2, notes: 'Paskalya ve bahar turları' },
      { id: 't3', tour_category: 'Termal / Sağlık', market: 'internal', rank: 3, notes: 'Bahar termal ve check-up paketleri' },
    ],
    events: [
      { id: 'e1', start_date: '2024-04-10', end_date: '2024-04-10', event_type: 'holiday', title: '10 Nisan Ramazan Bayramı 1. gün – resmi tatil', description: '', impact_level: 'high', impacted_markets: 'internal' },
      { id: 'e2', start_date: '2024-04-23', end_date: '2024-04-23', event_type: 'holiday', title: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı – resmi tatil, aile tatili talebi', description: '', impact_level: 'high', impacted_markets: 'internal' },
      { id: 'e3', start_date: '2024-04-01', end_date: null, event_type: 'crisis', title: 'İran-İsrail gerilimi – Orta Doğu rotalarında belirsizlik', description: '', impact_level: 'high', impacted_markets: 'external' },
      { id: 'e4', start_date: '2024-04-01', end_date: null, event_type: 'health_tourism', title: 'Sağlık turizmi bahar kampanyaları – diş, estetik, check-up', description: 'Medikal turizm ajansları bahar dönemi fiyatlaması.', impact_level: 'med', impacted_markets: 'both' },
    ],
    notes: [{ id: 'n1', insight: 'Nisan ayı 23 Nisan ve Ramazan Bayramı ile iç pazar talebini yükseltti; aile ve çocuk odaklı paketler öne çıktı. İran-İsrail gerilimi Orta Doğu rotalarında rezervasyon iptalleri ve ertelemelere yol açtı. Avrupa ve Balkan alternatifleri güçlendi. Sağlık turizmi (diş, estetik, check-up) bahar kampanyaları başladı; termal destinasyonlar talep gördü.' }],
  },
  5: {
    trend_keywords: [
      { id: 'k1', keyword: 'yaz tatili', category: 'generic', market: 'both', volume: 28500, yoy_change_pct: 11, mom_change_pct: 22, source: 'manual' },
      { id: 'k2', keyword: 'antalya otel', category: 'destination', market: 'internal', volume: 19600, yoy_change_pct: 8, mom_change_pct: 15, source: 'manual' },
      { id: 'k3', keyword: 'anneler günü tatil', category: 'generic', market: 'internal', volume: 6800, yoy_change_pct: 16, mom_change_pct: 28, source: 'manual' },
      { id: 'k4', keyword: 'sağlık turizmi türkiye', category: 'health_tourism', market: 'external', volume: 4800, yoy_change_pct: 24, mom_change_pct: 12, source: 'manual' },
      { id: 'k5', keyword: 'cruise turu', category: 'destination', market: 'external', volume: 7800, yoy_change_pct: 18, mom_change_pct: 12, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Akdeniz', market: 'both', rank: 1, notes: 'Erken yaz rezervasyonları' },
      { id: 't2', tour_category: 'Cruise', market: 'external', rank: 2, notes: 'Artış trendinde' },
      { id: 't3', tour_category: 'Sağlık / Medikal Turizm', market: 'external', rank: 3, notes: 'Diş, estetik, saç ekimi erken yaz rezervasyonları' },
    ],
    events: [
      { id: 'e1', start_date: '2024-05-01', end_date: '2024-05-01', event_type: 'holiday', title: '1 Mayıs Emek ve Dayanışma Günü – resmi tatil', description: '', impact_level: 'med', impacted_markets: 'internal' },
      { id: 'e2', start_date: '2024-05-19', end_date: '2024-05-19', event_type: 'holiday', title: '19 Mayıs Atatürk\'ü Anma, Gençlik ve Spor Bayramı – resmi tatil', description: '', impact_level: 'med', impacted_markets: 'internal' },
      { id: 'e3', start_date: '2024-05-12', end_date: '2024-05-12', event_type: 'holiday', title: 'Anneler Günü – aile ve wellness tatil talebi', description: '', impact_level: 'low', impacted_markets: 'internal' },
      { id: 'e4', start_date: '2024-05-01', end_date: null, event_type: 'health_tourism', title: 'Medikal turizm sezonu açılışı – diş, estetik, saç ekimi', description: 'Yurt dışından Türkiye sağlık turizmi talebi artıyor.', impact_level: 'high', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Mayıs ayı yaz tatili rezervasyonlarında belirgin artış getirdi. 19 Mayıs ve Anneler Günü kısa tatil paketleri iç pazarda hareketlilik yarattı. Sağlık turizmi (diş, estetik, saç ekimi, check-up) sezonu açıldı; Türkiye medikal turizm aramaları yükseldi. İç pazar Antalya ve Ege’ye odaklandı. Önümüzdeki ay yaz sezonu açılışı ve Kurban Bayramı planlamaları kritik.' }],
  },
  6: {
    trend_keywords: [
      { id: 'k1', keyword: 'kurban bayramı tatil', category: 'generic', market: 'internal', volume: 31200, yoy_change_pct: 16, mom_change_pct: 28, source: 'manual' },
      { id: 'k2', keyword: 'avrupa turu', category: 'destination', market: 'external', volume: 12400, yoy_change_pct: 7, mom_change_pct: 10, source: 'manual' },
      { id: 'k3', keyword: 'diş turizmi türkiye', category: 'health_tourism', market: 'external', volume: 5200, yoy_change_pct: 28, mom_change_pct: 15, source: 'manual' },
      { id: 'k4', keyword: 'greek islands', category: 'destination', market: 'external', volume: 8900, yoy_change_pct: 12, mom_change_pct: 8, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Yurt İçi Paket', market: 'internal', rank: 1, notes: 'Kurban Bayramı zirve' },
      { id: 't2', tour_category: 'Yunan Adaları', market: 'external', rank: 2, notes: 'Yaz sezonu talep' },
      { id: 't3', tour_category: 'Sağlık Turizmi', market: 'external', rank: 3, notes: 'Diş, estetik, saç ekimi yaz sezonu' },
    ],
    events: [
      { id: 'e1', start_date: '2024-06-16', end_date: '2024-06-19', event_type: 'holiday', title: 'Kurban Bayramı (16-19 Haziran) – resmi tatil, tatil talebinde zirve', description: '', impact_level: 'high', impacted_markets: 'both' },
      { id: 'e2', start_date: '2024-06-01', end_date: null, event_type: 'fx', title: 'TCMB faiz artışı – TL kısa süreli güçlenme', description: '', impact_level: 'med', impacted_markets: 'both' },
      { id: 'e3', start_date: '2024-06-16', end_date: '2024-06-16', event_type: 'holiday', title: 'Babalar Günü – aile tatili talebi', description: '', impact_level: 'low', impacted_markets: 'internal' },
    ],
    notes: [{ id: 'n1', insight: 'Haziran ayı Kurban Bayramı ile tatil talebinde zirve yaptı. Yurt içi paket turlar ve yurt dışı Avrupa/Yunanistan rotaları güçlü performans gösterdi. Diş ve estetik turizmi aramaları (Türkiye) yurt dışı pazarında belirgin arttı. Babalar Günü kısa tatil paketleri talep gördü. Faiz kararı TL’yi kısa süre destekledi.' }],
  },
  7: {
    trend_keywords: [
      { id: 'k1', keyword: 'antalya all inclusive', category: 'destination', market: 'internal', volume: 26400, yoy_change_pct: 6, mom_change_pct: -5, source: 'manual' },
      { id: 'k2', keyword: 'bodrum otel', category: 'destination', market: 'both', volume: 19800, yoy_change_pct: 9, mom_change_pct: 4, source: 'manual' },
      { id: 'k3', keyword: 'estetik turizm türkiye', category: 'health_tourism', market: 'external', volume: 6100, yoy_change_pct: 32, mom_change_pct: 18, source: 'manual' },
      { id: 'k4', keyword: 'yunanistan tatil', category: 'destination', market: 'external', volume: 11200, yoy_change_pct: 15, mom_change_pct: 6, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Akdeniz', market: 'both', rank: 1, notes: 'Yaz sezonu zirve' },
      { id: 't2', tour_category: 'Ege', market: 'both', rank: 2, notes: 'Yüksek doluluk' },
      { id: 't3', tour_category: 'Medikal / Estetik Turizm', market: 'external', rank: 3, notes: 'Yaz dönemi estetik, diş, saç ekimi zirve' },
    ],
    events: [
      { id: 'e1', start_date: '2024-07-15', end_date: '2024-07-15', event_type: 'holiday', title: '15 Temmuz Demokrasi ve Millî Birlik Günü – resmi tatil', description: '', impact_level: 'med', impacted_markets: 'internal' },
      { id: 'e2', start_date: '2024-07-01', end_date: null, event_type: 'disaster', title: 'Yunanistan orman yangınları – bazı rotalarda etki', description: 'Rhodes ve diğer adalarda yangınlar tatil planlarını etkiledi.', impact_level: 'med', impacted_markets: 'external' },
      { id: 'e3', start_date: '2024-07-20', end_date: null, event_type: 'crisis', title: 'Avrupa sıcak hava dalgası – bazı destinasyonlarda etki', description: '', impact_level: 'low', impacted_markets: 'external' },
      { id: 'e4', start_date: '2024-07-01', end_date: null, event_type: 'health_tourism', title: 'Sağlık turizmi yaz zirvesi – estetik, diş, saç ekimi', description: 'Türkiye medikal turizm talebi yaz aylarında en yüksek seviyede.', impact_level: 'high', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Temmuz ayı yaz sezonunda zirve dönem. 15 Temmuz resmi tatil iç pazar hareketliliğini artırdı. Yunanistan orman yangınları Rhodes ve bazı adalarda rezervasyon hareketlerine etki etti. Sağlık turizmi (estetik, diş, saç ekimi) yurt dışından Türkiye talebinde zirve görüldü. İç pazar Antalya ve Bodrum’da güçlü. Döviz fiyatlaması dikkatle izlenmeli.' }],
  },
  8: {
    trend_keywords: [
      { id: 'k1', keyword: 'son dakika tatil', category: 'deal', market: 'both', volume: 16800, yoy_change_pct: 22, mom_change_pct: 18, source: 'manual' },
      { id: 'k2', keyword: '30 ağustos tatil', category: 'generic', market: 'internal', volume: 14200, yoy_change_pct: 8, mom_change_pct: 12, source: 'manual' },
      { id: 'k3', keyword: 'mısır turu', category: 'destination', market: 'external', volume: 7200, yoy_change_pct: -5, mom_change_pct: 2, source: 'manual' },
      { id: 'k4', keyword: 'saç ekimi turkiye', category: 'health_tourism', market: 'external', volume: 5800, yoy_change_pct: 26, mom_change_pct: 10, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Akdeniz', market: 'both', rank: 1, notes: 'Ağustos zirve sezon' },
      { id: 't2', tour_category: 'Mısır', market: 'external', rank: 2, notes: 'Orta Doğu belirsizliği devam' },
      { id: 't3', tour_category: 'Sağlık Turizmi', market: 'external', rank: 3, notes: 'Estetik, saç ekimi yaz sonu talebi' },
    ],
    events: [
      { id: 'e1', start_date: '2024-08-30', end_date: '2024-08-30', event_type: 'holiday', title: '30 Ağustos Zafer Bayramı – resmi tatil', description: '', impact_level: 'med', impacted_markets: 'internal' },
      { id: 'e2', start_date: '2024-08-01', end_date: null, event_type: 'war', title: 'Ukrayna-Rusya savaşı devam – Karadeniz ve Doğu Avrupa rotaları etkilendi', description: '', impact_level: 'high', impacted_markets: 'external' },
      { id: 'e3', start_date: '2024-08-01', end_date: null, event_type: 'health_tourism', title: 'Sağlık turizmi yaz sonu – saç ekimi, estetik talebi yüksek', description: '', impact_level: 'med', impacted_markets: 'external' },
    ],
    notes: [{ id: 'n1', insight: 'Ağustos ayı yaz sezonunun son zirvesi. 30 Ağustos Zafer Bayramı iç pazar kısa tatil talebini artırdı. Son dakika fırsatları arttı. Sağlık turizmi (saç ekimi, estetik) yurt dışı talebi yüksek seyretti. Ukrayna-Rusya savaşı Doğu Avrupa ve Karadeniz rotalarında etkisini sürdürdü. Mısır rotasında Orta Doğu gerilimi talep artışını sınırladı.' }],
  },
  9: {
    trend_keywords: [
      { id: 'k1', keyword: 'okul açılışı', category: 'generic', market: 'internal', volume: 4200, yoy_change_pct: -8, mom_change_pct: -35, source: 'manual' },
      { id: 'k2', keyword: 'kapadokya sonbahar', category: 'destination', market: 'both', volume: 9800, yoy_change_pct: 14, mom_change_pct: 12, source: 'manual' },
      { id: 'k3', keyword: 'termal otel eylül', category: 'health_tourism', market: 'internal', volume: 5100, yoy_change_pct: 16, mom_change_pct: 22, source: 'manual' },
      { id: 'k4', keyword: 'cruise eylül', category: 'destination', market: 'external', volume: 6500, yoy_change_pct: 9, mom_change_pct: 5, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Kapadokya', market: 'both', rank: 1, notes: 'Sonbahar balon sezonu' },
      { id: 't2', tour_category: 'Termal / Kaplıca', market: 'internal', rank: 2, notes: 'Sonbahar termal sezonu açılışı' },
      { id: 't3', tour_category: 'Cruise', market: 'external', rank: 3, notes: 'Sezon sonu fırsatlar' },
    ],
    events: [
      { id: 'e1', start_date: '2024-09-01', end_date: null, event_type: 'holiday', title: 'Okul açılışı – aile tatil talebi düşüşü', description: '', impact_level: 'med', impacted_markets: 'internal' },
      { id: 'e2', start_date: '2024-09-16', end_date: '2024-09-16', event_type: 'holiday', title: '16 Eylül 2024 İlköğretim Haftası – eğitim dönemi başlangıcı', description: '', impact_level: 'low', impacted_markets: 'internal' },
      { id: 'e3', start_date: '2024-09-06', end_date: null, event_type: 'disaster', title: 'Türkiye sel felaketleri (Eylül) – bazı bölgelerde etki', description: '', impact_level: 'med', impacted_markets: 'internal' },
      { id: 'e4', start_date: '2024-09-01', end_date: null, event_type: 'health_tourism', title: 'Sonbahar termal sezonu – sağlık ve wellness turizmi', description: 'Termal otel ve kaplıca talebi artıyor.', impact_level: 'med', impacted_markets: 'internal' },
    ],
    notes: [{ id: 'n1', insight: 'Eylül ayı okul açılışıyla aile tatil talebi düştü. Kapadokya sonbahar ve cruise sezon sonu fırsatları öne çıktı. Sonbahar termal sezonu başladı; Afyon, Bursa, Yalova termal otel aramaları arttı. Ülke genelinde sel felaketleri bazı destinasyonlarda turizm hareketini etkiledi. Sağlık turizmi (check-up, diş) sonbahar paketleri talep gördü.' }],
  },
  10: {
    trend_keywords: [
      { id: 'k1', keyword: '29 ekim tatil', category: 'generic', market: 'internal', volume: 12800, yoy_change_pct: 10, mom_change_pct: 22, source: 'manual' },
      { id: 'k2', keyword: 'balkan turu ekim', category: 'destination', market: 'external', volume: 8200, yoy_change_pct: 7, mom_change_pct: 4, source: 'manual' },
      { id: 'k3', keyword: 'dubai turu', category: 'destination', market: 'external', volume: 6800, yoy_change_pct: 15, mom_change_pct: 8, source: 'manual' },
      { id: 'k4', keyword: 'termal tatil ekim', category: 'health_tourism', market: 'internal', volume: 4600, yoy_change_pct: 14, mom_change_pct: 8, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Balkan', market: 'external', rank: 1, notes: 'Sonbahar turları' },
      { id: 't2', tour_category: 'Dubai', market: 'external', rank: 2, notes: 'Kış öncesi erken rezervasyon' },
      { id: 't3', tour_category: 'Termal / Sağlık', market: 'internal', rank: 3, notes: '29 Ekim ve sonbahar termal paketleri' },
    ],
    events: [
      { id: 'e1', start_date: '2024-10-29', end_date: '2024-10-29', event_type: 'holiday', title: '29 Ekim Cumhuriyet Bayramı – resmi tatil', description: '', impact_level: 'med', impacted_markets: 'internal' },
      { id: 'e2', start_date: '2024-10-01', end_date: null, event_type: 'fx', title: 'Dolar/TL rekor seviyeler – yurt dışı maliyetler arttı', description: '', impact_level: 'high', impacted_markets: 'external' },
      { id: 'e3', start_date: '2024-10-01', end_date: null, event_type: 'health_tourism', title: 'Sağlık turizmi sonbahar dönemi – termal, check-up', description: 'İç pazar termal ve wellness talebi yüksek.', impact_level: 'med', impacted_markets: 'internal' },
    ],
    notes: [{ id: 'n1', insight: 'Ekim ayı 29 Ekim Cumhuriyet Bayramı ile iç pazar talebini destekledi. Döviz kurundaki artış yurt dışı tur maliyetlerini yükseltti; bütçe dostu Balkan rotaları tercih edildi. Termal ve sağlık turizmi (kaplıca, check-up) sonbahar paketleri talep gördü. Dubai’de erken kış rezervasyonları başladı.' }],
  },
  11: {
    trend_keywords: [
      { id: 'k1', keyword: 'yılbaşı turu', category: 'generic', market: 'both', volume: 15200, yoy_change_pct: 12, mom_change_pct: 25, source: 'manual' },
      { id: 'k2', keyword: 'kayak tatili', category: 'destination', market: 'internal', volume: 7800, yoy_change_pct: 18, mom_change_pct: 15, source: 'manual' },
      { id: 'k3', keyword: 'dubai yılbaşı', category: 'destination', market: 'external', volume: 9200, yoy_change_pct: 14, mom_change_pct: 20, source: 'manual' },
      { id: 'k4', keyword: 'check-up turizmi', category: 'health_tourism', market: 'external', volume: 3800, yoy_change_pct: 20, mom_change_pct: 12, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Yılbaşı Paket', market: 'both', rank: 1, notes: 'Rezervasyonlar hızlandı' },
      { id: 't2', tour_category: 'Kayak / Kış', market: 'internal', rank: 2, notes: 'Kış sezonu hazırlığı' },
      { id: 't3', tour_category: 'Sağlık Turizmi', market: 'external', rank: 3, notes: 'Yıl sonu check-up ve medikal paketler' },
    ],
    events: [
      { id: 'e1', start_date: '2024-11-10', end_date: '2024-11-10', event_type: 'holiday', title: '10 Kasım Atatürk\'ü Anma Günü – anma etkinlikleri', description: '', impact_level: 'low', impacted_markets: 'internal' },
      { id: 'e2', start_date: '2024-11-01', end_date: null, event_type: 'crisis', title: 'ABD seçimleri – küresel piyasa belirsizliği', description: '', impact_level: 'med', impacted_markets: 'external' },
      { id: 'e3', start_date: '2024-11-01', end_date: null, event_type: 'health_tourism', title: 'Sağlık turizmi yıl sonu – check-up, medikal paketler', description: 'Yıl sonu sağlık turizmi kampanyaları.', impact_level: 'med', impacted_markets: 'both' },
    ],
    notes: [{ id: 'n1', insight: 'Kasım ayı yılbaşı rezervasyonlarında artış getirdi. 10 Kasım anma dönemi iç pazar kısa turlarda hareketlilik yarattı. Kayak tatili ve Dubai yılbaşı paketleri öne çıktı. Sağlık turizmi (check-up, medikal) yıl sonu paketleri talep gördü. ABD seçimleri döviz ve küresel belirsizlik yarattı. Aralık için son rezervasyon fırsatları izlenmeli.' }],
  },
  12: {
    trend_keywords: [
      { id: 'k1', keyword: 'yılbaşı tatil', category: 'generic', market: 'both', volume: 28400, yoy_change_pct: 9, mom_change_pct: 35, source: 'manual' },
      { id: 'k2', keyword: 'kapadokya yılbaşı', category: 'destination', market: 'internal', volume: 11200, yoy_change_pct: 14, mom_change_pct: 22, source: 'manual' },
      { id: 'k3', keyword: 'termal otel yılbaşı', category: 'health_tourism', market: 'internal', volume: 4200, yoy_change_pct: 18, mom_change_pct: 25, source: 'manual' },
      { id: 'k4', keyword: 'vienna yılbaşı', category: 'destination', market: 'external', volume: 6800, yoy_change_pct: 8, mom_change_pct: 12, source: 'manual' },
    ],
    trend_tours: [
      { id: 't1', tour_category: 'Yılbaşı', market: 'both', rank: 1, notes: 'Zirve talep dönemi' },
      { id: 't2', tour_category: 'Kapadokya', market: 'internal', rank: 2, notes: 'Kış balon ve kar manzarası' },
      { id: 't3', tour_category: 'Termal / Wellness', market: 'internal', rank: 3, notes: 'Yılbaşı termal paketleri' },
    ],
    events: [
      { id: 'e1', start_date: '2024-12-31', end_date: '2025-01-01', event_type: 'holiday', title: '31 Aralık - 1 Ocak Yılbaşı – tatil talebinde zirve', description: '', impact_level: 'high', impacted_markets: 'both' },
      { id: 'e2', start_date: '2024-12-01', end_date: null, event_type: 'fx', title: 'Yıl sonu döviz hareketleri – TL baskı altında', description: '', impact_level: 'high', impacted_markets: 'both' },
      { id: 'e3', start_date: '2024-12-01', end_date: null, event_type: 'health_tourism', title: 'Kış termal sezonu – yılbaşı wellness ve kaplıca talebi', description: 'Termal otel yılbaşı paketleri talep görüyor.', impact_level: 'med', impacted_markets: 'internal' },
    ],
    notes: [{ id: 'n1', insight: 'Aralık ayı yılbaşı tatil talebinde zirve. Kapadokya yılbaşı paketleri, termal otel yılbaşı ve Avrupa şehir turları (Viyana, Prag vb.) güçlü. Kış termal ve sağlık turizmi talebi arttı. Döviz kuru yurt dışı maliyetleri artırdı. Yeni yıl için Ocak ayı Japonya, kış rotaları ve sağlık turizmi planlaması başlamalı.' }],
  },
};

export function MonthlyIntelDashboard({ variant = 'turizm' }: { variant?: 'turizm' | 'clinic' }) {
  const [year, setYear] = useState(2025);
  const [grid, setGrid] = useState<MonthlyIntelRow[]>(MOCK_GRID);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [detail, setDetail] = useState<MonthDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const isClinic = variant === 'clinic';
  const monthData = isClinic ? MOCK_MONTH_DATA_CLINIC : MOCK_MONTH_DATA;

  const fetchGrid = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/monthly-intel?year=${year}&country=TR`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setGrid(data);
      }
    } catch {
      setGrid(MOCK_GRID);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (month: number) => {
    const intel = grid.find((r) => r.month === month);
    if (!intel?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/monthly-intel/${intel.id}`);
      if (res.ok) {
        const data = await res.json();
        setDetail(data);
      } else {
        setDetail({
          ...intel,
          trend_keywords: [],
          trend_tours: [],
          events: [],
          notes: [],
        });
      }
    } catch {
      setDetail({
        ...intel,
        trend_keywords: [],
        trend_tours: [],
        events: [],
        notes: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrid();
  }, [year]);

  const handleMonthClick = (month: number) => {
    setSelectedMonth(month);
    const intel = grid.find((r) => r.month === month);
    if (intel?.id?.startsWith('mock-')) {
      const data = monthData[month];
      setDetail({
        ...intel,
        trend_keywords: data?.trend_keywords ?? [],
        trend_tours: data?.trend_tours ?? [],
        events: data?.events ?? [],
        notes: data?.notes ?? [],
      });
    } else {
      fetchDetail(month);
    }
  };

  const demandHeat = (di: number | null) => {
    if (di == null) return 3;
    if (di <= 0.7) return 2;
    if (di <= 1) return 5;
    if (di <= 1.2) return 8;
    return 10;
  };

  return (
    <div className="group relative flex min-h-[400px] flex-col overflow-hidden rounded-3xl border border-sky-500/20 bg-gradient-to-br from-zinc-900/95 via-sky-950/20 to-zinc-950 p-6 shadow-2xl shadow-sky-950/20 transition-all duration-500 hover:border-sky-400/40 hover:shadow-sky-500/15">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(56,189,248,0.1),_transparent_50%)]" />
      <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl transition-opacity group-hover:opacity-80" />
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20">
            <svg className="h-5 w-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-white">{isClinic ? 'Aylık Klinik İstihbarat' : 'Aylık Turizm İstihbarat'}</h4>
            <p className="text-xs text-zinc-500">{isClinic ? 'Talep sinyalleri & medikal pazar' : 'Talep sinyalleri & pazar bağlamı'}</p>
          </div>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value, 10))}
          className="rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-200 focus:border-sky-400 focus:outline-none"
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {grid.map((m) => {
          const heat = demandHeat(m.demand_index);
          return (
            <button
              key={m.month}
              type="button"
              onClick={() => handleMonthClick(m.month)}
              className="min-h-[72px] sm:min-h-[88px] rounded-xl px-4 py-4 text-center transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
              style={{
                backgroundColor: `rgba(56,189,248,${heat * 0.08})`,
                borderWidth: '1px',
                borderColor: heat >= 7 ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.05)',
                boxShadow: heat >= 8 ? '0 0 20px rgba(56,189,248,0.2)' : 'none',
              }}
            >
              <span className={`block text-base sm:text-lg font-medium ${heat >= 7 ? 'text-sky-200' : 'text-zinc-400'}`}>{MONTH_NAMES[m.month - 1]}</span>
              <div className="mt-2 flex justify-center gap-1">
                {Array.from({ length: Math.min(heat, 5) }).map((_, j) => (
                  <div key={j} className="h-2 w-2 rounded-full bg-sky-400/60" />
                ))}
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4">
        <div className="h-2 w-2 rounded-full bg-sky-500" />
        <span className="text-xs text-zinc-500">Yoğunluk = Talep İndeksi (yıllık ort. / ay)</span>
      </div>

      {selectedMonth != null && detail && (
        <MonthDetailPanel
          detail={detail}
          onClose={() => setSelectedMonth(null)}
          variant={variant}
        />
      )}
    </div>
  );
}

function MonthDetailPanel({ detail, onClose, variant = 'turizm' }: { detail: MonthDetail; onClose: () => void; variant?: 'turizm' | 'clinic' }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-sky-500/30 bg-zinc-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {MONTH_NAMES[detail.month - 1]} {detail.year} — İstihbarat Özeti
          </h3>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white">✕</button>
        </div>

        <div className="space-y-4 text-sm">
          <section className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="mb-3 font-semibold text-sky-200">1. Talep Özeti</h4>
            <div className="grid grid-cols-2 gap-3 text-zinc-300">
              <div>Toplam Arama Hacmi: <span className="font-medium text-white">{detail.total_search_volume?.toLocaleString() ?? '—'}</span></div>
              <div>İç Pazar: <span className="font-medium text-white">{detail.internal_search_volume?.toLocaleString() ?? '—'}</span></div>
              <div>Dış Pazar: <span className="font-medium text-white">{detail.external_search_volume?.toLocaleString() ?? '—'}</span></div>
              <div>Talep İndeksi: <span className="font-medium text-white">{detail.demand_index != null ? `${detail.demand_index.toFixed(2)}x` : '—'}</span></div>
            </div>
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="mb-3 font-semibold text-sky-200">2. Trend Anahtar Kelimeler</h4>
            {detail.trend_keywords.length === 0 ? (
              <p className="text-zinc-500">Henüz veri yok</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left text-zinc-400">
                      <th className="pb-2">Kelime</th>
                      <th className="pb-2">Kategori</th>
                      <th className="pb-2">Pazar</th>
                      <th className="pb-2">Hacim</th>
                      <th className="pb-2">Önceki Ay %</th>
                      <th className="pb-2">Önceki Yıl %</th>
                    </tr>
                  </thead>
                  <tbody className="text-zinc-300">
                    {detail.trend_keywords.map((k) => (
                      <tr key={k.id} className="border-t border-white/5">
                        <td className="py-1.5">{k.keyword}</td>
                        <td>{k.category === 'health_tourism' ? 'Sağlık Turizmi' : k.category === 'dental' ? 'Diş' : k.category === 'esthetic' ? 'Estetik' : k.category === 'medical' ? 'Tıbbi' : (k.category ?? '—')}</td>
                        <td>{k.market ?? '—'}</td>
                        <td>{k.volume?.toLocaleString() ?? '—'}</td>
                        <td>{k.mom_change_pct != null ? `%${k.mom_change_pct}` : '—'}</td>
                        <td>{k.yoy_change_pct != null ? `%${k.yoy_change_pct}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="mb-3 font-semibold text-sky-200">{variant === 'clinic' ? '3. Trend Kategoriler' : '3. Trend Turlar'}</h4>
            {detail.trend_tours.length === 0 ? (
              <p className="text-zinc-500">Henüz veri yok</p>
            ) : (
              <ul className="space-y-2 text-zinc-300">
                {detail.trend_tours.map((t) => (
                  <li key={t.id} className="flex justify-between">
                    <span>{t.tour_category}</span>
                    <span className="text-zinc-500">{t.market ?? '—'} {t.notes && `· ${t.notes}`}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="mb-3 font-semibold text-sky-200">4. Pazar Olayları & Makro Bağlam</h4>
            {detail.events.length === 0 ? (
              <p className="text-zinc-500">Henüz veri yok</p>
            ) : (
              <ul className="space-y-2 text-zinc-300">
                {detail.events.map((e) => (
                  <li key={e.id} className="flex gap-2">
                    <span className="shrink-0 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300">{e.event_type ?? '—'}</span>
                    <span>{e.title}</span>
                    {e.impact_level && <span className="text-zinc-500">({e.impact_level})</span>}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-white/10 bg-white/5 p-4">
            <h4 className="mb-3 font-semibold text-sky-200">5. Editöryal İçgörüler</h4>
            {detail.notes.length === 0 ? (
              <p className="text-zinc-500">Henüz not yok</p>
            ) : (
              <p className="whitespace-pre-wrap text-zinc-300">{detail.notes[0].insight}</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
