import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/atlas", destination: "/products/atlas", permanent: false },
      { source: "/atlas/:path*", destination: "/products/atlas", permanent: false },
      // www → apex (after xarivlabs.com is connected in Vercel)
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.xarivlabs.com" }],
        destination: "https://xarivlabs.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
