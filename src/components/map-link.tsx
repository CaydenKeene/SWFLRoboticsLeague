"use client";

import { useEffect, useState } from "react";

/**
 * Google's URL API works on every platform and opens the Google Maps app when it's
 * installed. iPhones and iPads usually don't have it, though, so they get an Apple
 * Maps link instead, which hands off to the Maps app directly.
 */
function mapsUrl(query: string, preferAppleMaps: boolean) {
  const q = encodeURIComponent(query);
  return preferAppleMaps
    ? `https://maps.apple.com/?q=${q}`
    : `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export function MapLink({
  query,
  className,
  children,
}: {
  /** What to search for — venue name plus address matches better than either alone. */
  query: string;
  className?: string;
  children: React.ReactNode;
}) {
  // Renders as the Google link on the server so the address is tappable before
  // hydration and for anyone without JavaScript; iOS swaps it on mount.
  const [preferAppleMaps, setPreferAppleMaps] = useState(false);

  useEffect(() => {
    const { userAgent, platform, maxTouchPoints } = navigator;
    setPreferAppleMaps(
      /iPhone|iPad|iPod/.test(userAgent) ||
        // iPadOS 13+ reports itself as a Mac; touch points tell them apart.
        (platform === "MacIntel" && maxTouchPoints > 1),
    );
  }, []);

  return (
    <a
      href={mapsUrl(query, preferAppleMaps)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
