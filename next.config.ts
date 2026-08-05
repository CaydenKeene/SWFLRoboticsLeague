import type { NextConfig } from "next";

// Deployed on Coolify via Nixpacks, which runs `npm run build` then `npm start`
// (`next start`). Do not set `output: "standalone"` here — that build expects to be
// launched with `node .next/standalone/server.js`, and `next start` warns against it.
const nextConfig: NextConfig = {};

export default nextConfig;
