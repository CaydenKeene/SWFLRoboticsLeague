"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ShareState = "idle" | "copied" | "failed";

/** How long the confirmation stays up before the button returns to its resting label. */
const RESET_MS = 4_000;

/** Phones and tablets get the system share sheet; a mouse-driven desktop gets a copy. */
const TOUCH = "(pointer: coarse)";

/**
 * Shares a page on this site. Takes a path rather than a full URL so the link
 * always points at whatever origin the reader is on — localhost in dev, the live
 * domain in production.
 */
export function ShareLinkButton({ path, title }: { path: string; title: string }) {
  const [state, setState] = useState<ShareState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function share() {
    const url = new URL(path, window.location.origin).toString();

    if (navigator.share && window.matchMedia(TOUCH).matches) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // Closing the share sheet rejects with AbortError — that's the reader's
        // choice, not a failure. Anything else falls through to copying.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    let next: ShareState = "copied";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      next = "failed";
    }

    setState(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), RESET_MS);
  }

  return (
    <>
      <button
        type="button"
        onClick={share}
        className="font-display text-xs uppercase tracking-[0.08em] text-rust transition-opacity hover:opacity-70"
      >
        {/* Both labels share one grid cell so the swap can't shift the row. */}
        <span className="grid">
          <Label className={cn(state === "copied" && "invisible")}>
            <Link2 className="h-3.5 w-3.5 flex-none" aria-hidden />
            {state === "failed" ? "Couldn't copy" : "Share"}
          </Label>
          <Label className={cn(state !== "copied" && "invisible")}>
            <Check className="h-3.5 w-3.5 flex-none" aria-hidden />
            Link copied
          </Label>
        </span>
      </button>

      <span aria-live="polite" className="sr-only">
        {state === "copied" && "Link copied to your clipboard"}
        {state === "failed" && "Couldn't copy the link automatically"}
      </span>
    </>
  );
}

function Label({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "col-start-1 row-start-1 flex items-center justify-end gap-1.5 whitespace-nowrap",
        className,
      )}
      {...props}
    />
  );
}
