"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { UpdateSection } from "@/content/updates";
import { cn } from "@/lib/utils";

/** Matches Tailwind's `sm` breakpoint, which drives the collapsed-on-mobile classes. */
const DESKTOP = "(min-width: 640px)";

/**
 * The numbered body of a league email, behind a show/hide toggle so a page full of
 * long messages stays scannable. The summary above it always stays visible.
 *
 * The newest message opens on load, but only on desktop — on a phone an expanded
 * message buries everything under it. Until the reader touches the toggle that split
 * is made in CSS rather than in state, so the server-rendered markup is correct at
 * both widths and neither layout flashes on hydration.
 */
export function UpdateDetails({
  id,
  sections,
  defaultOpen = false,
}: {
  id: string;
  sections: UpdateSection[];
  defaultOpen?: boolean;
}) {
  const [override, setOverride] = useState<boolean | null>(null);
  const openOnDesktopOnly = override === null && defaultOpen;
  const open = override ?? false;
  const panelId = `${id}-details`;

  function toggle() {
    // The viewport is only knowable in an event handler, never during render.
    const openNow = override ?? (defaultOpen && window.matchMedia(DESKTOP).matches);
    setOverride(!openNow);
  }

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={openOnDesktopOnly ? defaultOpen : open}
        aria-controls={panelId}
        className="mt-3.5 flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.08em] text-rust transition-opacity hover:opacity-70"
      >
        {openOnDesktopOnly ? (
          <>
            <span className="sm:hidden">Read Full Message</span>
            <span className="hidden sm:inline">Hide Full Message</span>
          </>
        ) : (
          <span>{open ? "Hide Full Message" : "Read Full Message"}</span>
        )}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 flex-none transition-transform",
            openOnDesktopOnly ? "sm:rotate-180" : open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <ol
        id={panelId}
        className={cn(
          "mt-3.5 flex-col gap-3.5",
          openOnDesktopOnly ? "hidden sm:flex" : open ? "flex" : "hidden",
        )}
      >
        {sections.map((section, i) => (
          <li key={section.heading}>
            <p className="mb-1 text-[13px] font-extrabold text-navy">
              {i + 1}. {section.heading}
            </p>
            <p className="max-w-[70ch] text-sm leading-relaxed text-navy/75">
              {section.body}
            </p>
          </li>
        ))}
      </ol>
    </>
  );
}
