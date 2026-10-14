import type { NextConfig } from "next";

// Production builds and starts with the standard scripts: `npm run build` then
// `npm start` (`next start`). Do not set `output: "standalone"` here — that build expects
// to be launched with `node .next/standalone/server.js`, and `next start` warns against it.
const nextConfig: NextConfig = {
  images: {
    // Event photos are full-size originals on the photo store (site.photoStore), which
    // next/image resizes on first view. Keep this host in step with site.photoStore.url.
    remotePatterns: [{ protocol: "https", hostname: "photos.swflrobotics.org" }],
    // Dashboard uploads carry no cache headers, which would otherwise have each resized
    // copy re-made every minute. A photo's URL doesn't change content, so keep copies a month.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
