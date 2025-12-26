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
  turbopack: {
    // Silence root inference warning during dev; this app is the root.
    root: __dirname,
  },
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
