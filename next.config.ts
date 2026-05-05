import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const isNetlify = !!process.env.NETLIFY;

// Only use the /LearnJapanese subpath for GitHub Pages (non-Netlify production builds)
const basePath = (isProd && !isNetlify) ? '/LearnJapanese' : '';

const nextConfig: NextConfig = {
  output: 'export',      // Required for static hosting
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : '', 
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,   // Required for static export
  },
};

export default nextConfig;