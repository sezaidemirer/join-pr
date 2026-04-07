-- Supabase Dashboard → SQL → çalıştır (bir kez).
-- Haber / mecra logo dosyaları: kökte seed isimleri (sondakika.webp) + uploads/ altında admin yüklemeleri.
--
-- Seed görselleri yüklemek (repo kökünde, .env.local dolu iken):
--   npm run upload-haber-logos

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'haber-platform-logos',
  'haber-platform-logos',
  true,
  52428800,
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'image/avif',
    'image/tiff',
    'image/bmp',
    'image/heic',
    'image/heif'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Herkes okuyabilsin (tarayıcıda <img src="...public URL">).
DROP POLICY IF EXISTS "haber_platform_logos_public_select" ON storage.objects;
CREATE POLICY "haber_platform_logos_public_select"
ON storage.objects FOR SELECT
USING (bucket_id = 'haber-platform-logos');

-- Yükleme: API route SUPABASE_SERVICE_ROLE_KEY ile yapılır (RLS bypass).
-- İsterseniz ek olarak authenticated insert politikası da tanımlayabilirsiniz.
