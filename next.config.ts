import type { NextConfig } from "next";

const backendProxyTarget =
  process.env.BACKEND_API_BASE ??
  (process.env.NEXT_PUBLIC_API_BASE?.startsWith("http")
    ? process.env.NEXT_PUBLIC_API_BASE
    : undefined) ??
  "http://localhost:8000/api";

const normalizedProxyTarget = backendProxyTarget.replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: `${normalizedProxyTarget}/:path*`,
      },
    ];
  },
};

export default nextConfig;
