import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Bakar in demoläget vid bygget. Netlify ger inte serverfunktionerna
  // variabler från netlify.toml när de körs, bara när sajten byggs.
  env: { DEMO: process.env.DEMO ?? "" },
};

export default nextConfig;
