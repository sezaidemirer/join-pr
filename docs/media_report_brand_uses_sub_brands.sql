-- Medya yansıma: bazı markalar alt marka kullanmaz; doğrudan marka altında çok sayıda rapor/bülten.
-- Supabase SQL Editor veya migration olarak çalıştırın.

ALTER TABLE media_report_brands
ADD COLUMN IF NOT EXISTS uses_sub_brands BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN media_report_brands.uses_sub_brands IS
  'true: adminde alt marka mantığı; false: aynı tabloda (sub_brands) rapor/bülten satırları, üst marka tek.';
