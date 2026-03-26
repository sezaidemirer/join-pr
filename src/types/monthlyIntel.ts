// Aylık istihbarat tipleri – dashboard ve clinic verisi tarafından ortak kullanılır
export type MonthlyIntelRow = {
  id: string;
  year: number;
  month: number;
  total_search_volume: number | null;
  internal_search_volume: number | null;
  external_search_volume: number | null;
  demand_index: number | null;
  trends_index: number | null;
};

export type TrendKeyword = {
  id: string;
  keyword: string;
  category: string | null;
  market: string | null;
  volume: number | null;
  yoy_change_pct: number | null;
  mom_change_pct: number | null;
  source: string | null;
};

export type TrendTour = {
  id: string;
  tour_category: string;
  market: string | null;
  rank: number | null;
  notes: string | null;
};

export type MonthlyEvent = {
  id: string;
  start_date: string | null;
  end_date: string | null;
  event_type: string | null;
  title: string;
  description: string | null;
  impact_level: string | null;
  impacted_markets: string | null;
};

export type MonthlyNote = {
  id: string;
  insight: string;
};

export type MonthDetail = MonthlyIntelRow & {
  trend_keywords: TrendKeyword[];
  trend_tours: TrendTour[];
  events: MonthlyEvent[];
  notes: MonthlyNote[];
};
