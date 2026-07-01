import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/lens", destination: "/atlas", permanent: true },
      { source: "/lens/:path*", destination: "/atlas/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
