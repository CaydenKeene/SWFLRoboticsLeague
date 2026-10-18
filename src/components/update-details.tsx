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
  openOnLoad = false,
}: {
  id: string;
  sections: UpdateSection[];
  defaultOpen?: boolean;
  /** Open at every width, phones included — for an email shown on its own page. */
  openOnLoad?: boolean;
}) {
  const [override, setOverride] = useState<boolean | null>(openOnLoad ? true : null);
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
              <SectionBody section={section} />
            </p>
            {section.table && <SectionTable table={section.table} />}
          </li>
        ))}
      </ol>
    </>
  );
}

function SectionTable({ table }: { table: NonNullable<UpdateSection["table"]> }) {
  return (
    <table className="mt-2.5 w-full max-w-[70ch] border-collapse text-left text-sm">
      <thead>
        <tr className="border-b-2 border-navy/15">
          {table.columns.map((column) => (
            <th
              key={column}
              scope="col"
              className="px-3 py-1.5 font-display text-[11px] font-normal uppercase tracking-[0.1em] text-navy/50"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {table.rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? "bg-navy/[0.04]" : ""}>
            {row.map((cell, j) => (
              <td
                key={j}
                className={cn(
                  "px-3 py-1.5 align-top leading-snug",
                  j === 0 ? "whitespace-nowrap font-bold text-navy" : "text-navy/75",
                )}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A section's text, with its `link` phrase (if any) turned into an anchor. */
function SectionBody({ section }: { section: UpdateSection }) {
  const { body, link } = section;
  const at = link ? body.indexOf(link.text) : -1;
  // A phrase that doesn't match the body renders as plain text rather than breaking.
  if (!link || at === -1) return body;

  return (
    <>
      {body.slice(0, at)}
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-rust underline decoration-rust/30 underline-offset-2 transition-colors hover:decoration-rust"
      >
        {link.text}
      </a>
      {body.slice(at + link.text.length)}
    </>
  );
}
