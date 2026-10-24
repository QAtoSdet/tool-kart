import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Tools do processing client-side; no server image optimization needed for user uploads.
  // Keeping images unoptimized avoids Vercel image-optimization limits on the free tier.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
