import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
  default-src 'self';
  script-src 'self' ${isDev ? "'unsafe-eval' 'unsafe-inline'" : "'unsafe-inline'"} https:;
  style-src 'self' 'unsafe-inline' https:;
  img-src 'self' data: https:;
  font-src 'self' https:;
  connect-src 'self' https://api.example.com https://my-json-server.typicode.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["encrypted-tbn0.gstatic.com", "images.unsplash.com", "encrypted-tbn3.gstatic.com", "treemart.com"],
  },
  async headers() {
    return [
      {
        source: "/(.*)", // applies to all routes
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
