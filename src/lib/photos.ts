import { cache } from "react";
import { ListObjectsV2Command, S3Client, type _Object } from "@aws-sdk/client-s3";
import { site } from "@/content/site";

export type Photo = {
  /** Public URL of the original upload. Pages render it through next/image, never raw. */
  src: string;
  alt: string;
};

export type Album = {
  /** URL slug, e.g. "2026-09-12-kickoff-event", derived from the folder name. */
  id: string;
  title: string;
  /** Display date, e.g. "September 12, 2026". */
  date: string;
  photos: Photo[];
};

/** "2026-09-12 Kickoff Event" → date and title. Folders not named this way are ignored. */
const ALBUM_FOLDER = /^(\d{4})-(\d{2})-(\d{2})\s+(.+)$/;

/**
 * Formats next/image's optimizer can read. HEIC (the iPhone default) isn't one, so
 * it's skipped rather than rendered as a broken image; /add-photos converts it.
 */
const IMAGE = /\.(jpe?g|png|webp|avif|gif)$/i;

/**
 * The URL slug for an album folder. scripts/photos.mjs repeats this rule to print
 * each album's address, so change both together.
 */
export function albumSlug(folder: string) {
  return folder
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function albumPath(album: Album) {
  return `/photos/${album.id}`;
}

/**
 * Every album in the photo store, newest first. Read-only keys come from the
 * PHOTOS_S3_ACCESS_KEY / PHOTOS_S3_SECRET_KEY environment variables; without them
 * (or if the store is down) this returns no albums and /photos shows its empty state,
 * so the site never fails to build or render over photos.
 */
export const getAlbums = cache(async (): Promise<Album[]> => {
  const accessKeyId = process.env.PHOTOS_S3_ACCESS_KEY;
  const secretAccessKey = process.env.PHOTOS_S3_SECRET_KEY;
  if (!accessKeyId || !secretAccessKey) {
    console.warn("[photos] PHOTOS_S3_ACCESS_KEY / PHOTOS_S3_SECRET_KEY not set; no albums.");
    return [];
  }

  const { url, bucket } = site.photoStore;
  const s3 = new S3Client({
    // SeaweedFS ignores the region, but the SDK needs one to sign requests.
    region: "us-east-1",
    endpoint: url,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });

  const objects: _Object[] = [];
  try {
    let token: string | undefined;
    do {
      const page = await s3.send(
        new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: token }),
      );
      objects.push(...(page.Contents ?? []));
      token = page.IsTruncated ? page.NextContinuationToken : undefined;
    } while (token);
  } catch (error) {
    console.error("[photos] Couldn't list the photo store:", error);
    return [];
  }

  const byFolder = new Map<string, string[]>();
  for (const { Key } of objects) {
    const slash = Key?.indexOf("/") ?? -1;
    if (!Key || slash < 1) continue;
    const name = Key.slice(slash + 1);
    // Files directly in the album folder only; subfolders are a volunteer's workspace.
    if (!IMAGE.test(name) || name.includes("/")) continue;
    const folder = Key.slice(0, slash);
    byFolder.set(folder, [...(byFolder.get(folder) ?? []), name]);
  }

  const albums: { sortKey: string; album: Album }[] = [];
  for (const [folder, names] of byFolder) {
    const match = ALBUM_FOLDER.exec(folder);
    if (!match) continue;
    const [, year, month, day, title] = match;

    albums.push({
      sortKey: `${year}${month}${day}`,
      album: {
        id: albumSlug(folder),
        title: title.trim(),
        date: new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        // Phone and camera names sort by capture order, so the album reads in sequence.
        // Renaming a photo to start with "00" makes it the cover.
        photos: names
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          .map((name, i) => ({
            src: `${url}/${bucket}/${encodeURIComponent(folder)}/${encodeURIComponent(name)}`,
            alt: `${title.trim()}, photo ${i + 1} of ${names.length}`,
          })),
      },
    });
  }

  return albums.sort((a, b) => b.sortKey.localeCompare(a.sortKey)).map(({ album }) => album);
});

export async function findAlbum(id: string) {
  return (await getAlbums()).find((album) => album.id === id);
}
