import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PhotoSlideshow } from "@/components/photo-slideshow";
import { Wrap } from "@/components/wrap";
import { albumPath, getAlbums, type Album } from "@/lib/photos";

/** How many of the newest albums the home page shows side by side. */
const HOME_ALBUMS = 2;

/** Matches the half-width columns both layouts use. */
const SLIDE_SIZES = "(min-width: 1120px) 524px, (min-width: 640px) 50vw, 100vw";

/**
 * Slideshows of the newest event albums, right under the hero, so a first-time
 * visitor sees the league posts photos. Two albums sit side by side; while there's
 * only one, it gets both columns as two slideshows. Renders nothing until the first
 * album exists.
 */
export async function Photos() {
  const albums = await getAlbums();
  const latest = albums.slice(0, HOME_ALBUMS);
  if (latest.length === 0) return null;

  return (
    <section id="photos" className="bg-white py-16 sm:py-20">
      <Wrap>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div>
            <div className="mb-1.5 font-display text-xs uppercase tracking-[0.1em] text-rust">
              Event Photos
            </div>
            <h2 className="font-display text-2xl uppercase sm:text-[34px]">
              {latest.length === 1 ? "Latest Event" : "Latest Events"}
            </h2>
          </div>
          <Link
            href="/photos"
            className="clip-slant inline-flex items-center gap-2 bg-orange px-7 py-3.5 pr-9 font-display text-sm uppercase text-navy transition-opacity hover:opacity-90"
          >
            See All Photos
            <ArrowRight className="h-4 w-4 flex-none" aria-hidden />
          </Link>
        </div>

        {latest.length === 1 ? (
          <SingleAlbum album={latest[0]} />
        ) : (
          <div className="grid gap-12 sm:grid-cols-2 sm:gap-8">
            {latest.map((album, i) => (
              <article key={album.id} className="min-w-0">
                <AlbumHeading album={album} />
                <PhotoSlideshow
                  photos={album.photos}
                  albumPath={albumPath(album)}
                  title={album.title}
                  sizes={SLIDE_SIZES}
                  className="aspect-[4/3]"
                  offsetMs={i * 2_500}
                />
                <AlbumButton album={album} />
              </article>
            ))}
          </div>
        )}
      </Wrap>
    </section>
  );
}

/**
 * One album across both columns: two slideshows, the second starting halfway in,
 * so they never show the same photo. Phones get just the first.
 */
function SingleAlbum({ album }: { album: Album }) {
  const half = Math.ceil(album.photos.length / 2);
  const twoUp = album.photos.length > 1;

  return (
    <article>
      <AlbumHeading album={album} />
      <div className="grid gap-8 sm:grid-cols-2">
        <PhotoSlideshow
          photos={album.photos}
          albumPath={albumPath(album)}
          title={album.title}
          sizes={SLIDE_SIZES}
          className="aspect-[4/3]"
        />
        {twoUp && (
          <div className="hidden sm:block">
            <PhotoSlideshow
              photos={album.photos}
              albumPath={albumPath(album)}
              title={album.title}
              sizes={SLIDE_SIZES}
              className="aspect-[4/3]"
              startIndex={half}
              offsetMs={2_500}
            />
          </div>
        )}
      </div>
      <AlbumButton album={album} />
    </article>
  );
}

function AlbumHeading({ album }: { album: Album }) {
  return (
    <div className="mb-4">
      <h3 className="font-display text-lg uppercase">{album.title}</h3>
      <p className="mt-0.5 text-xs font-semibold uppercase text-navy/50">
        {album.date} · {album.photos.length} {album.photos.length === 1 ? "photo" : "photos"}
      </p>
    </div>
  );
}

function AlbumButton({ album }: { album: Album }) {
  return (
    <Link
      href={albumPath(album)}
      className="clip-slant mt-5 inline-flex items-center gap-2 bg-navy px-6 py-3 pr-8 font-display text-xs uppercase text-white transition-opacity hover:opacity-90"
    >
      View {album.title} Album
      <ArrowRight className="h-4 w-4 flex-none" aria-hidden />
    </Link>
  );
}
