"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import type { Photo } from "@/lib/photos";

/** Horizontal travel, in px, that counts as a swipe rather than a tap. */
const SWIPE_PX = 50;

/**
 * An album's thumbnail grid and the lightbox it opens into.
 *
 * The lightbox is a native <dialog>, like the donate popup, so Esc, focus
 * trapping and the backdrop come from the platform. The open photo is mirrored
 * in the URL hash (#12), so a single photo can be linked to.
 *
 * Originals come straight from the photo store at full camera size, so every
 * image goes through next/image: the grid gets small thumbnails and the viewer a
 * screen-sized copy, with metadata stripped. Photo dimensions aren't known ahead
 * of time, so images fill boxes the layout sizes.
 */

/** Shared by the viewer and its preloads, so both request the same resized copy. */
const VIEWER_SIZES = "100vw";
export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const show = useCallback(
    (i: number) => {
      const next = (i + photos.length) % photos.length;
      setIndex(next);
      history.replaceState(null, "", `#${next + 1}`);
      if (!ref.current?.open) {
        ref.current?.showModal();
        document.body.style.overflow = "hidden";
      }
    },
    [photos.length],
  );

  // A shared link like /photos/kickoff-2026#12 opens straight to that photo.
  useEffect(() => {
    const n = Number(window.location.hash.slice(1));
    if (Number.isInteger(n) && n >= 1 && n <= photos.length) show(n - 1);
  }, [photos.length, show]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (index === null) return;
    if (event.key === "ArrowRight") show(index + 1);
    if (event.key === "ArrowLeft") show(index - 1);
  }

  const photo = index === null ? null : photos[index];

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => show(i)}
              aria-label={`Open photo ${i + 1} of ${photos.length}`}
              className="group relative block aspect-square w-full overflow-hidden bg-navy/10"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 270px, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={ref}
        aria-label="Photo viewer"
        onClose={() => {
          document.body.style.overflow = "";
          setIndex(null);
          history.replaceState(null, "", window.location.pathname);
        }}
        onClick={(event) => {
          // A click on the ::backdrop or the empty space around the photo closes it.
          if (event.target === event.currentTarget || event.target === stageRef.current) {
            ref.current?.close();
          }
        }}
        onKeyDown={onKeyDown}
        onTouchStart={(event) => {
          touchX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchX.current === null || index === null) return;
          const dx = event.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > SWIPE_PX) show(dx < 0 ? index + 1 : index - 1);
        }}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-transparent p-0 text-white backdrop:bg-navy"
      >
        {photo && index !== null && (
          <div className="flex h-full flex-col">
            <div className="flex flex-none items-center gap-4 px-4 py-3 sm:px-6">
              <span className="font-display text-sm uppercase tracking-[0.08em] text-white/70">
                {index + 1} / {photos.length}
              </span>
              <a
                href={photo.src}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.08em] text-white/70 transition-colors hover:text-orange"
              >
                <Download className="h-4 w-4 flex-none" aria-hidden />
                <span className="hidden sm:inline">Original</span>
              </a>
              <button
                type="button"
                onClick={() => ref.current?.close()}
                aria-label="Close"
                className="-mr-1.5 p-1.5 text-white/70 transition-colors hover:text-orange"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div
              ref={stageRef}
              className="relative min-h-0 flex-1 px-2 pb-4 sm:px-16"
            >
              <div className="relative h-full w-full">
                <Image
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes={VIEWER_SIZES}
                  className="object-contain"
                />
              </div>

              {photos.length > 1 && (
                <>
                  <NavButton side="left" onClick={() => show(index - 1)} />
                  <NavButton side="right" onClick={() => show(index + 1)} />
                </>
              )}
            </div>

            {/* Warm the cache for the neighbors so arrowing through doesn't stall. */}
            <div className="hidden" aria-hidden>
              {[index - 1, index + 1].map((i) => {
                const p = photos[(i + photos.length) % photos.length];
                return (
                  <div key={`preload-${i}`} className="relative h-px w-px">
                    <Image src={p.src} alt="" fill sizes={VIEWER_SIZES} loading="eager" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}

function NavButton({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photo" : "Next photo"}
      className={`absolute top-1/2 -translate-y-1/2 bg-navy/60 p-1.5 text-white transition-colors hover:bg-orange hover:text-navy sm:p-2.5 ${
        side === "left" ? "left-2 sm:left-3" : "right-2 sm:right-3"
      }`}
    >
      <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
    </button>
  );
}
