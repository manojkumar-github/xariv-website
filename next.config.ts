import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/atlas", destination: "/products/atlas", permanent: false },
      { source: "/atlas/:path*", destination: "/products/atlas", permanent: false },
    ];
  },
};

export default nextConfig;
