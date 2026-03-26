/** @type {import('next').NextConfig} */
const staticExport = process.env.STATIC_EXPORT === '1';

const nextConfig = {
  ...(staticExport ? { output: 'export' } : {}),
  basePath: '', // Root dizin - joinpr.com.tr için
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
