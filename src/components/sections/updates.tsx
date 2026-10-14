import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PhotoSlideshow } from "@/components/photo-slideshow";
import { UpdateCard } from "@/components/update-card";
import { Wrap } from "@/components/wrap";
import { updates } from "@/content/updates";
import { albumPath, getAlbums } from "@/lib/photos";

// The /updates archive opens the newest full email on load and collapses the rest.
export const newestFullMessageId = updates.find((update) => update.sections)?.id;

/**
 * The newest league email beside the newest photo album. The email is shown
 * compact — summary plus a link to its own page — so both halves stay a fixed
 * height and line up. Until an album exists the email takes the full width.
 */
export async function Updates() {
  const latestUpdate = updates[0];
  const album = (await getAlbums())[0];

  return (
    <section id="updates" className="py-16 sm:py-20">
      <Wrap className={album ? "grid gap-14 lg:grid-cols-2 lg:gap-10" : undefined}>
        <div className="flex min-w-0 flex-col">
          <div className="mb-8">
            <div className="mb-1.5 font-display text-xs uppercase tracking-[0.1em] text-rust">
              Team Updates
            </div>
            <h2 className="font-display text-2xl uppercase sm:text-[34px]">Latest Message</h2>
          </div>

          {/* Stretches to the slideshow's height so the two halves line up. */}
          <UpdateCard update={latestUpdate} compact className="lg:flex-1" />

          <div className="mt-6">
            <Link
              href="/updates"
              className="clip-slant inline-flex items-center gap-2 bg-navy px-7 py-3.5 pr-9 font-display text-sm uppercase text-white transition-opacity hover:opacity-90"
            >
              See All Updates
              <ArrowRight className="h-4 w-4 flex-none" aria-hidden />
            </Link>
          </div>
        </div>

        {album && (
          <div id="photos" className="flex min-w-0 flex-col">
            <div className="mb-8">
              <div className="mb-1.5 font-display text-xs uppercase tracking-[0.1em] text-rust">
                Event Photos · {album.date}
              </div>
              <h2 className="font-display text-2xl uppercase sm:text-[34px]">{album.title}</h2>
            </div>

            <PhotoSlideshow
              photos={album.photos}
              albumPath={albumPath(album)}
              title={album.title}
              sizes="(min-width: 1120px) 528px, (min-width: 1024px) 45vw, 100vw"
              className="aspect-[4/3]"
            />

            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="/photos"
                className="clip-slant inline-flex items-center gap-2 bg-navy px-7 py-3.5 pr-9 font-display text-sm uppercase text-white transition-opacity hover:opacity-90"
              >
                See All Photos
                <ArrowRight className="h-4 w-4 flex-none" aria-hidden />
              </Link>
              <Link
                href={albumPath(album)}
                className="font-display text-xs uppercase tracking-[0.08em] text-rust underline decoration-rust/30 underline-offset-4 transition-colors hover:decoration-rust"
              >
                View {album.title} Album
              </Link>
            </div>
          </div>
        )}
      </Wrap>
    </section>
  );
}
