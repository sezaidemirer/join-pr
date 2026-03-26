import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type MonthlyIntel = {
  id: string;
  country: string;
  year: number;
  month: number;
  total_search_volume: number | null;
  internal_search_volume: number | null;
  external_search_volume: number | null;
  demand_index: number | null;
  trends_index: number | null;
  created_at: string;
  updated_at: string;
};

export type TrendKeyword = {
  id: string;
  monthly_intel_id: string;
  keyword: string;
  category: string | null;
  market: string | null;
  volume: number | null;
  yoy_change_pct: number | null;
  mom_change_pct: number | null;
  source: string | null;
  created_at: string;
};

export type TrendTour = {
  id: string;
  monthly_intel_id: string;
  tour_category: string;
  market: string | null;
  rank: number | null;
  notes: string | null;
  created_at: string;
};

export type MonthlyEvent = {
  id: string;
  monthly_intel_id: string;
  start_date: string | null;
  end_date: string | null;
  event_type: string | null;
  title: string;
  description: string | null;
  impact_level: string | null;
  impacted_markets: string | null;
  created_at: string;
};

export type MonthlyNote = {
  id: string;
  monthly_intel_id: string;
  insight: string;
  created_at: string;
};
