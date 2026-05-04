import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/LearnJapanese' : '';

const nextConfig: NextConfig = {
  output: 'export',      // Required for GitHub Pages static hosting
  basePath: basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,   // Required for static export
  },
};

export default nextConfig;