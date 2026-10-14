// Uploads a folder of event photos to the photo store as one album. Usually run by
// the /add-photos Claude command rather than by hand:
//
//   npm run photos -- <folder> "2026-09-12 Kickoff Event"
//
// The second argument is the album folder in the bucket. The site turns any folder
// named "YYYY-MM-DD Title" into an album on /photos within five minutes, so this
// script is optional — uploading through the SeaweedFS dashboard works too. What it
// adds over the dashboard:
//
//   - HEIC photos (the iPhone default) become JPEGs, which the site can display
//   - metadata is stripped, so the originals don't carry GPS coordinates
//   - photos are capped at 3000px, so the store isn't filled with 8 MB originals
//
// Re-running it for the same album uploads only photos that aren't there yet.
//
// Upload keys (the SeaweedFS S3 user, with write access) live in .env.local:
//
//   PHOTOS_S3_ACCESS_KEY=…
//   PHOTOS_S3_SECRET_KEY=…

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import heicConvert from "heic-convert";
import sharp from "sharp";

// Keep in step with site.photoStore in src/content/site.ts.
const STORE_URL = "https://photos.swflrobotics.org";
const BUCKET = "event-photos";

const MAX_PX = 3000;
const EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".tif", ".tiff"]);
const ALBUM_FOLDER = /^\d{4}-\d{2}-\d{2} \S.*$/;

const [folder, album] = process.argv.slice(2);

if (!folder || !album) {
  fail('Usage: npm run photos -- <folder> "YYYY-MM-DD Event Title"');
}
if (!ALBUM_FOLDER.test(album) || album.includes("/")) {
  fail(`Album "${album}" must look like "2026-09-12 Kickoff Event" — the site reads the date and title from it.`);
}

const missing = ["PHOTOS_S3_ACCESS_KEY", "PHOTOS_S3_SECRET_KEY"].filter((n) => !process.env[n]);
if (missing.length) fail(`Missing from .env.local: ${missing.join(", ")}`);

const s3 = new S3Client({
  // SeaweedFS ignores the region, but the SDK needs one to sign requests.
  region: "us-east-1",
  endpoint: STORE_URL,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.PHOTOS_S3_ACCESS_KEY,
    secretAccessKey: process.env.PHOTOS_S3_SECRET_KEY,
  },
});

const files = (await readdir(folder, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (!files.length) fail(`No photos found in ${folder}.`);

// What's already in the album, so a re-run only sends new photos. (Listing, not a
// per-file HEAD: HEAD requests on image paths are refused through the Cloudflare tunnel.)
const existing = new Set();
let token;
do {
  const page = await s3.send(
    new ListObjectsV2Command({ Bucket: BUCKET, Prefix: `${album}/`, ContinuationToken: token }),
  );
  for (const { Key } of page.Contents ?? []) existing.add(Key);
  token = page.IsTruncated ? page.NextContinuationToken : undefined;
} while (token);

let added = 0;
let skipped = 0;
const failed = [];

for (const [i, name] of files.entries()) {
  const label = `[${i + 1}/${files.length}] ${name}`;
  // Every upload is a JPEG named after its source, so capture order is kept.
  const key = `${album}/${path.parse(name).name}.jpg`;

  if (existing.has(key)) {
    skipped++;
    continue;
  }

  try {
    let input = await readFile(path.join(folder, name));
    if (/\.hei[cf]$/i.test(name)) {
      input = Buffer.from(await heicConvert({ buffer: input, format: "JPEG", quality: 1 }));
    }

    // .rotate() applies the EXIF orientation before sharp drops the metadata.
    const output = await sharp(input)
      .rotate()
      .resize(MAX_PX, MAX_PX, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: output,
        ContentType: "image/jpeg",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );
    existing.add(key);
    added++;
    console.log(`${label} ✓`);
  } catch (error) {
    failed.push(name);
    const status = error.$metadata?.httpStatusCode;
    console.error(`${label} ✗ ${error.name}${status ? ` (HTTP ${status})` : ""}: ${error.message}`);
  }
}

// Same rule as albumSlug() in src/lib/photos.ts.
const slug = album.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

console.log(`\n${album}: ${added} added, ${skipped} already there, ${existing.size} total.`);
if (failed.length) console.log(`Couldn't process ${failed.length}: ${failed.join(", ")}`);
console.log(`Album: /photos/${slug}  (live within 5 minutes)`);
console.log(`albumId: ${slug}`);

function fail(message) {
  console.error(message);
  process.exit(1);
}
