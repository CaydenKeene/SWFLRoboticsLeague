"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

type CopyState = "idle" | "copied" | "failed";

/** How long the confirmation stays up before the button returns to its resting label. */
const RESET_MS = 10_000;

export function CopyEmailButton() {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    let next: CopyState = "copied";
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      // Clipboard access is blocked in some browsers and insecure contexts —
      // fall back to showing the address so it can be copied by hand.
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
        onClick={copy}
        className="clip-slant bg-orange px-8 py-4 pr-10 font-display text-sm uppercase text-navy transition-opacity hover:opacity-90 sm:text-[15px]"
      >
        {/*
          Both resting labels are always in the layout, stacked in one grid cell, so
          swapping between them can't change the button's size or nudge it on the page.
        */}
        <span className="grid">
          <Label className={cn(state !== "idle" && "invisible")}>
            <Copy className="h-4 w-4 flex-none" aria-hidden />
            Copy {site.email}
          </Label>
          <Label className={cn(state !== "copied" && "invisible")}>
            <Check className="h-4 w-4 flex-none" aria-hidden />
            Email address copied
          </Label>
          {state === "failed" && <Label>Couldn&apos;t copy — {site.email}</Label>}
        </span>
      </button>

      {/* Announced for screen readers; the visible swap above carries it for everyone else. */}
      <span aria-live="polite" className="sr-only">
        {state === "copied" && `${site.email} copied to your clipboard`}
        {state === "failed" && `Couldn't copy automatically. The address is ${site.email}`}
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
        "col-start-1 row-start-1 flex items-center justify-center gap-2.5 whitespace-nowrap",
        className,
      )}
      {...props}
    />
  );
}
