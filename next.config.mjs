/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: isProd ? 'export' : undefined, // Sadece production'da static export
  basePath: isProd ? '/join-pr' : '', // Development'ta basePath yok
  images: {
    unoptimized: true,
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
