/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/join-pr',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
