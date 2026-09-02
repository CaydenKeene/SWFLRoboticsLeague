"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { UpdateSection } from "@/content/updates";
import { cn } from "@/lib/utils";

/**
 * The numbered body of a league email, behind a show/hide toggle so a page full of
 * long messages stays scannable. The summary above it always stays visible.
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
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `${id}-details`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-expanded={open}
        aria-controls={panelId}
        className="mt-3.5 flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.08em] text-rust transition-opacity hover:opacity-70"
      >
        {open ? "Hide Full Message" : "Read Full Message"}
        <ChevronDown
          className={cn("h-3.5 w-3.5 flex-none transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <ol id={panelId} className="mt-3.5 flex flex-col gap-3.5">
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
      )}
    </>
  );
}
