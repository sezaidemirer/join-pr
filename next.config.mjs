/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  assetPrefix: isGitHubPages ? '/join-pr/' : undefined,
  basePath: isGitHubPages ? '/join-pr' : undefined,
  trailingSlash: true,
};

export default nextConfig;
