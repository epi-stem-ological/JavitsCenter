/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The web app transpiles monorepo packages directly (no pre-build step).
  transpilePackages: ['@javits/domain', '@javits/providers', '@javits/mock-data'],
};

export default nextConfig;
