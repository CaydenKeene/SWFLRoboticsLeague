import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Wrap } from "@/components/wrap";
import { site } from "@/content/site";
import { albumPath, getAlbums } from "@/lib/photos";

// Re-read the photo store every 5 minutes, so dashboard uploads appear without a deploy.
export const revalidate = 300;

export const metadata: Metadata = {
  title: `Photos | ${site.name}`,
  description: `Photos from every event of the ${site.season}.`,
};

/** The photo library: one card per event album, newest first. */
export default async function PhotosIndex() {
  const albums = await getAlbums();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="py-16 sm:py-20">
          <Wrap>
            <div className="mb-1.5 font-display text-xs uppercase tracking-[0.1em] text-rust">
              {site.season}
            </div>
            <h1 className="mb-10 font-display text-2xl uppercase sm:text-[34px]">Event Photos</h1>

            {albums.length === 0 ? (
              <p className="max-w-[60ch] border-l-[6px] border-orange bg-white px-5 py-4 text-sm leading-relaxed text-navy/75">
                Photos from each league event will be posted here after it wraps up.
              </p>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {albums.map((album) => (
                  <li key={album.id}>
                    <Link
                      href={albumPath(album)}
                      className="group clip-notch block bg-white shadow-[0_2px_10px_rgba(0,0,0,0.06)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-navy/10">
                        <Image
                          src={album.photos[0].src}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="border-t-[6px] border-orange px-5 pb-6 pt-4">
                        <h2 className="font-display text-lg uppercase decoration-orange underline-offset-4 group-hover:underline">
                          {album.title}
                        </h2>
                        <p className="mt-1 text-xs font-semibold uppercase text-navy/50">
                          {album.date} · {album.photos.length}{" "}
                          {album.photos.length === 1 ? "photo" : "photos"}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Wrap>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
