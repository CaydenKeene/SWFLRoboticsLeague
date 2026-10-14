"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "@/lib/photos";
import { cn } from "@/lib/utils";

/** How long each photo stays up before the slideshow advances. */
const INTERVAL_MS = 5_000;

/** Horizontal travel, in px, that counts as a swipe rather than a tap. */
const SWIPE_PX = 50;

/** Past this many photos the dots get too small to tap, so a counter replaces them. */
const MAX_DOTS = 12;

/**
 * The latest album as a self-advancing slideshow on the home page. Pauses while
 * hovered or focused, and doesn't auto-advance for visitors who ask for reduced
 * motion. Clicking a photo opens the album's viewer at that photo.
 *
 * Only the current photo and its neighbors are mounted, so a large album doesn't
 * load every photo up front. A spinner sits under the images and shows through
 * until the current one has loaded.
 */
export function PhotoSlideshow({
  photos,
  albumPath,
  title,
  sizes,
  className,
  offsetMs = 0,
  startIndex = 0,
}: {
  photos: Photo[];
  albumPath: string;
  title: string;
  /** next/image `sizes` for the slides, matching the width the slideshow is laid out at. */
  sizes: string;
  /** Sets the frame's shape, e.g. an aspect ratio; photos are cropped to fill it. */
  className?: string;
  /**
   * Extra wait before the first advance. Slideshows side by side get different
   * offsets so they don't all change photo at the same moment.
   */
  offsetMs?: number;
  /** Which photo to open on, e.g. halfway in for a second slideshow of the same album. */
  startIndex?: number;
}) {
  const [index, setIndex] = useState(startIndex % photos.length);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchX = useRef<number | null>(null);
  const advanced = useRef(false);
  const count = photos.length;

  const go = (i: number) => setIndex((i + count) % count);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Restarts on every change of photo, so a manual switch gets a full interval too.
  useEffect(() => {
    if (paused || reducedMotion || count < 2) return;
    const delay = advanced.current ? INTERVAL_MS : INTERVAL_MS + offsetMs;
    const timer = setTimeout(() => {
      advanced.current = true;
      setIndex((i) => (i + 1) % count);
    }, delay);
    return () => clearTimeout(timer);
  }, [index, paused, reducedMotion, count, offsetMs]);

  const mounted = new Set([index, (index + 1) % count, (index - 1 + count) % count]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${title} photos`}
        className={cn("relative overflow-hidden bg-navy", className)}
        onTouchStart={(event) => {
          touchX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchX.current === null) return;
          const dx = event.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > SWIPE_PX) go(dx < 0 ? index + 1 : index - 1);
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
          <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/20 border-t-orange" />
        </div>

        {photos.map((photo, i) =>
          mounted.has(i) ? (
            <Link
              key={photo.src}
              href={`${albumPath}#${i + 1}`}
              tabIndex={i === index ? 0 : -1}
              aria-hidden={i !== index}
              aria-label={`Open ${title} photo ${i + 1} of ${count}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-700",
                i === index ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes={sizes}
                className="object-cover"
              />
            </Link>
          ) : null,
        )}

        {count > 1 && (
          <>
            <SlideButton side="left" onClick={() => go(index - 1)} />
            <SlideButton side="right" onClick={() => go(index + 1)} />
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-3 flex items-center justify-center">
          {count <= MAX_DOTS ? (
            <div className="flex gap-2">
              {photos.map((photo, i) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show photo ${i + 1} of ${count}`}
                  aria-current={i === index}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-colors",
                    i === index ? "bg-orange" : "bg-navy/20 hover:bg-navy/40",
                  )}
                />
              ))}
            </div>
          ) : (
            <span className="font-display text-xs uppercase tracking-[0.08em] text-navy/50">
              {index + 1} / {count}
            </span>
          )}
        </div>
      )}

      <span aria-live="polite" className="sr-only">
        {paused ? `Photo ${index + 1} of ${count}` : ""}
      </span>
    </div>
  );
}

function SlideButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 bg-navy/60 p-1.5 text-white transition-colors hover:bg-orange hover:text-navy",
        side === "left" ? "left-2" : "right-2",
      )}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
