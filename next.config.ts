import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static marketing site: pages unmount on navigation so GSAP/Three.js
  // scenes clean themselves up instead of being kept hidden by <Activity>.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
