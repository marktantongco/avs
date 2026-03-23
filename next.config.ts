import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/avs",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
