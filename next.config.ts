import type { NextConfig } from "next";

const nextConfig: NextConfig = {
cacheComponents:true,
  images:{
    remotePatterns:[
      {
        protocol:'https',
        hostname:'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com', // Add this new block
      }
    ]
  },

  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
