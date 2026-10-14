import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PhotoGallery } from "@/components/photo-gallery";
import { ShareLinkButton } from "@/components/share-link-button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Wrap } from "@/components/wrap";
import { site } from "@/content/site";
import { albumPath, findAlbum, getAlbums } from "@/lib/photos";

type Props = { params: Promise<{ id: string }> };

// Albums appear as folders are added to the photo store, so unknown ids are looked
// up on request rather than 404ing until the next deploy. Pages refresh every 5 min.
export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getAlbums()).map((album) => ({ id: album.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const album = await findAlbum((await params).id);
  if (!album) return {};

  const description = `${album.photos.length} photos from the ${album.title}, ${album.date}.`;
  // Link previews get a resized copy of the cover rather than the multi-MB original.
  const cover = `/_next/image?url=${encodeURIComponent(album.photos[0].src)}&w=1200&q=75`;

  return {
    title: `${album.title} Photos | ${site.name}`,
    description,
    openGraph: {
      title: `${album.title} Photos`,
      description,
      url: albumPath(album),
      siteName: site.name,
      images: [{ url: cover }],
    },
  };
}

/** One event's album: the thumbnail grid and its lightbox. */
export default async function AlbumPage({ params }: Props) {
  const album = await findAlbum((await params).id);
  if (!album) notFound();

  return (
    <>
      <SiteHeader />
      <main>
        <section className="py-16 sm:py-20">
          <Wrap>
            <Link
              href="/photos"
              className="mb-6 inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-[0.08em] text-rust transition-opacity hover:opacity-70"
            >
              <ArrowLeft className="h-3.5 w-3.5 flex-none" aria-hidden />
              All Photos
            </Link>

            <div className="mb-8 flex flex-wrap items-end gap-x-6 gap-y-2">
              <div>
                <div className="mb-1.5 text-xs font-semibold uppercase text-navy/50">
                  {album.date} · {album.photos.length}{" "}
                  {album.photos.length === 1 ? "photo" : "photos"}
                </div>
                <h1 className="font-display text-2xl uppercase sm:text-[34px]">{album.title}</h1>
              </div>
              <div className="ml-auto">
                <ShareLinkButton
                  path={albumPath(album)}
                  title={`${album.title} Photos | ${site.name}`}
                />
              </div>
            </div>

            <PhotoGallery photos={album.photos} />
          </Wrap>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
