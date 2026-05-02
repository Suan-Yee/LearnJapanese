import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',      // Required for GitHub Pages static hosting
  images: {
    unoptimized: true,   // Required for static export
  },
  // If your GitHub URL is username.github.io/repo-name/
  // basePath: "/your-repo-name", 
};

export default nextConfig;