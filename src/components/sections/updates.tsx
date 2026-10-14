import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { UpdateCard } from "@/components/update-card";
import { Wrap } from "@/components/wrap";
import { updates } from "@/content/updates";

/** How many emails the home page shows; the rest live on /updates. */
const HOME_COUNT = 2;

// Only the newest full email is expanded on load; the rest collapse behind their toggle.
export const newestFullMessageId = updates.find((update) => update.sections)?.id;

export function Updates() {
  const recent = updates.slice(0, HOME_COUNT);

  return (
    <section id="updates" className="py-16 sm:py-20">
      <Wrap>
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <div className="mb-1.5 font-display text-xs uppercase tracking-[0.1em] text-rust">
              Team Updates
            </div>
            <h2 className="font-display text-2xl uppercase sm:text-[34px]">
              Latest Messages to Teams
            </h2>
          </div>
          <p className="text-[13px] font-semibold uppercase text-navy/50">Newest first</p>
        </div>

        <div className="flex flex-col gap-4">
          {recent.map((update) => (
            <UpdateCard
              key={update.id}
              update={update}
              detailsOpen={update.id === newestFullMessageId ? "desktop" : "closed"}
            />
          ))}
        </div>

        {updates.length > HOME_COUNT && (
          <Link
            href="/updates"
            className="clip-slant mt-8 inline-flex items-center gap-2 bg-navy px-7 py-3.5 pr-9 font-display text-sm uppercase text-white transition-opacity hover:opacity-90"
          >
            All {updates.length} Messages
            <ArrowRight className="h-4 w-4 flex-none" aria-hidden />
          </Link>
        )}
      </Wrap>
    </section>
  );
}
