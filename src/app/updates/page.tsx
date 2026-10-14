import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { newestFullMessageId } from "@/components/sections/updates";
import { UpdateCard } from "@/components/update-card";
import { Wrap } from "@/components/wrap";
import { site } from "@/content/site";
import { updates } from "@/content/updates";

export const metadata: Metadata = {
  title: `Messages to Teams | ${site.name}`,
  description: `Every league-wide email of the ${site.season}, newest first.`,
};

/** The full archive of league emails; the home page shows only the newest few. */
export default function UpdatesArchive() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="py-16 sm:py-20">
          <Wrap>
            <div className="mb-10 flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <div className="mb-1.5 font-display text-xs uppercase tracking-[0.1em] text-rust">
                  Team Updates · {site.season}
                </div>
                <h1 className="font-display text-2xl uppercase sm:text-[34px]">
                  All Messages to Teams
                </h1>
              </div>
              <p className="text-[13px] font-semibold uppercase text-navy/50">Newest first</p>
            </div>

            <div className="flex flex-col gap-4">
              {updates.map((update) => (
                <UpdateCard
                  key={update.id}
                  update={update}
                  detailsOpen={update.id === newestFullMessageId ? "desktop" : "closed"}
                />
              ))}
            </div>
          </Wrap>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
