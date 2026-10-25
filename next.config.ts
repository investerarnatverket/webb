import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Bakar in demoläget vid bygget. Netlify ger inte serverfunktionerna
  // variabler från netlify.toml när de körs, bara när sajten byggs.
  env: { DEMO: process.env.DEMO ?? "" },
  // Designförslagen är avgjorda (A valdes 2026-10-25); gamla länkar går till startsidan.
  async redirects() {
    return [
      { source: "/forslag", destination: "/", permanent: false },
      { source: "/forslag/:tema", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
