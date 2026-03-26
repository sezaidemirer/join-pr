-- Aylık Turizm İstihbarat Modülü
-- Run in Supabase SQL Editor

-- 1) monthly_intel
CREATE TABLE IF NOT EXISTS monthly_intel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT DEFAULT 'TR',
  year INT NOT NULL,
  month INT NOT NULL CHECK (month >= 1 AND month <= 12),
  total_search_volume INT,
  internal_search_volume INT,
  external_search_volume INT,
  demand_index NUMERIC,
  trends_index NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(country, year, month)
);

-- 2) monthly_trend_keywords
CREATE TABLE IF NOT EXISTS monthly_trend_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_intel_id UUID NOT NULL REFERENCES monthly_intel(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  category TEXT, -- destination/generic/brand/deal
  market TEXT,   -- internal/external/both
  volume INT,
  yoy_change_pct NUMERIC,
  mom_change_pct NUMERIC,
  source TEXT,   -- manual/trends/planner
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3) monthly_trend_tours
CREATE TABLE IF NOT EXISTS monthly_trend_tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_intel_id UUID NOT NULL REFERENCES monthly_intel(id) ON DELETE CASCADE,
  tour_category TEXT NOT NULL,
  market TEXT,
  rank INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4) monthly_events
CREATE TABLE IF NOT EXISTS monthly_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_intel_id UUID NOT NULL REFERENCES monthly_intel(id) ON DELETE CASCADE,
  start_date DATE,
  end_date DATE,
  event_type TEXT, -- war/crisis/fx/disaster/regulation/holiday
  title TEXT NOT NULL,
  description TEXT,
  impact_level TEXT, -- low/med/high
  impacted_markets TEXT, -- internal/external/both
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5) monthly_notes
CREATE TABLE IF NOT EXISTS monthly_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monthly_intel_id UUID NOT NULL REFERENCES monthly_intel(id) ON DELETE CASCADE,
  insight TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) - enable if needed
ALTER TABLE monthly_intel ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_trend_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_trend_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_notes ENABLE ROW LEVEL SECURITY;

-- Allow public read for now (adjust per your auth setup)
CREATE POLICY "Allow all" ON monthly_intel FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON monthly_trend_keywords FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON monthly_trend_tours FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON monthly_events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON monthly_notes FOR ALL USING (true) WITH CHECK (true);
