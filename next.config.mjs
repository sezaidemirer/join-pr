/** @type {import('next').NextConfig} */
const staticExport = process.env.STATIC_EXPORT === '1';

const nextConfig = {
  ...(staticExport ? { output: 'export' } : {}),
  ...(staticExport ? { distDir: '.next-static-export' } : {}),
  basePath: '', // Root dizin - joinpr.com.tr için
  // Vercel / Node: HTML ve API eski kalmasin; hashed _next/static uzun omurlu kalsin
  ...(staticExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: '/_next/static/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
            {
              source: '/api/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'private, no-store, no-cache, must-revalidate',
                },
              ],
            },
            {
              source: '/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=0, must-revalidate, s-maxage=0',
                },
              ],
            },
          ];
        },
      }),
  images: {
    unoptimized: staticExport,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/**' },
    ],
  },
  trailingSlash: true,
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: ['**/node_modules', '**/.next'],
    };
    return config;
  },
};

export default nextConfig;
