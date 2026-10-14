# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Development Commands

- `npm run dev` — dev server at http://localhost:3000
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — ESLint

## Project Architecture

Single-page marketing site for the SWFL Robotics League, built with Next.js 15
(App Router), TypeScript, and Tailwind CSS 3. Everything renders statically — there is
no database, API route, or CMS — except the event photo pages, which read the photo
store at runtime (see Event Photos below).

### Structure

- `src/app/page.tsx` — composes the anchor sections in order; revalidates every 5 minutes
  because the photos section reads the photo store
- `src/app/thank-you/page.tsx` — the `/thank-you` route, where Stripe returns donors after
  a successful payment. The redirect is configured on the payment link in the Stripe
  dashboard, not in this repo; the page's copy lives in `donate.thankYou`
- `src/app/updates/` — `/updates` lists every league email; `/updates/[id]` gives each one
  its own shareable page, statically generated from `updates.ts`. The home page shows only
  the newest two. An update's `id` is its URL slug, so don't rename a live one
- `src/app/photos/` — `/photos` lists the event albums; `/photos/[id]` is one album's
  thumbnail grid. Both read the photo store via `src/lib/photos.ts` and refresh every
  5 minutes (ISR), so new uploads appear without a deploy
- `src/components/photo-gallery.tsx` — client component; an album's grid and its
  lightbox, a native `<dialog>` like the donate popup. The open photo is mirrored in the
  URL hash (`#12`) so single photos can be shared
- `src/components/update-card.tsx` — one league email, shared by all three places it
  appears; `share-link-button.tsx` is its client-side share/copy button
- `src/components/sections/` — one component per page section (`hero`, `photos`,
  `updates`, `schedule`, `contact`, `donate`). `photos` sits between the hero and updates:
  slideshows (`photo-slideshow.tsx`) of the two newest albums side by side — or, while
  there's only one, two slideshows of it — hidden until an album exists
- `src/components/site-header.tsx` — sticky header; client component
  (`"use client"` for the mobile menu toggle)
- `src/components/copy-email-button.tsx` — client component; copies `site.email` to the
  clipboard for the contact section, which stays a server component
- `src/components/donate-dialog.tsx` — client component; the donation popup, built on a
  native `<dialog>` so Esc, focus trapping and the backdrop come from the platform.
  Keeps the donate section a server component, same split as the contact section
- `src/components/wrap.tsx` — shared 1120px page gutter used by every section
- `src/content/` — all copy and season data; `donate.ts` holds the popup copy, the
  designation choices, and the check mailing address
- `src/lib/photos.ts` — lists the photo store's bucket and turns folders into albums
- `scripts/photos.mjs` — `npm run photos -- <folder> "YYYY-MM-DD Title"` uploads a
  folder as an album: HEIC → JPEG, capped at 3000px, metadata (GPS) stripped. Run by
  the `/add-photos` command in `.claude/commands/`
- `public/` — league logo (the 2026 contest winner) and the official FTC mark

### Content Convention

**Do not hardcode season content in JSX.** Copy, schedule rows, and team updates live in
`src/content/*.ts` as typed data; section components only render it. New content of an
existing kind should be a data entry, not new markup.

Conventions the components depend on:

- `ScheduleEvent.location === null` renders **TBD**
- A `ScheduleEvent` with no `flyerUrl`, `mapUrl` or `info` renders **TBD** in the
  Flyer column; the two URL fields point at PDFs in `public/docs/`
- An `Update` with a `flyerUrl` renders a PDF link under its summary — same
  `public/docs/` convention, but omitting it renders nothing rather than TBD
- `site.donateUrl === "#"` hides the card option in the donate popup, leaving only the
  mail-a-check path
- `ScheduleEvent.albumId` adds an "Event Photos" link to that row; it's the album's
  slug, e.g. `"2026-09-12-kickoff-event"`
- `donate.web3formsKey === ""` skips the check form and shows the mailing address
  directly — there is nowhere to deliver a submission until a key is set

### Styling Conventions

- Brand colors and fonts are Tailwind theme tokens (`navy`, `cream`, `orange`, `rust`,
  `teal`, `bone`; `font-display`, `font-sans`) — use them instead of arbitrary hex values.
- The design's angular geometry comes from three utilities in `src/app/globals.css`:
  `.clip-slant`, `.clip-notch`, `.hero-stripes`. Reuse these rather than writing new
  `clip-path` values.
- Headings use `font-display` (Archivo Black) and are uppercased via `uppercase`, not by
  uppercasing the source strings.
- No dark mode — this is a fixed-palette brand site.

### Event Photos

Photos are **not** in git or `public/`. They live in a SeaweedFS service on Coolify
(S3-compatible; `site.photoStore`), served at `photos.swflrobotics.org` through the
Cloudflare tunnel, with anonymous reads allowed.

- Each bucket folder named `YYYY-MM-DD Event Title` is an album; its slug (URL id) is
  that name lowercased and hyphenated. Other folders are ignored. Photos sort by file
  name; a name starting with `00` becomes the cover
- Originals are rendered through `next/image` (not `unoptimized`), which makes the
  thumbnails and screen-sized copies. HEIC can't be optimized and is skipped — upload
  JPEGs, or use the script, which converts
- Listing the bucket needs keys: `PHOTOS_S3_ACCESS_KEY` / `PHOTOS_S3_SECRET_KEY`. Locally
  they're in `.env.local` (admin keys, also used to upload); in production they're a
  read-only SeaweedFS user set on the website in Coolify. Without them, `/photos` shows
  its empty state rather than failing
- Through the tunnel, Cloudflare refuses signed HEAD requests on image paths — list the
  bucket instead of HEADing objects

### design-reference/

The original Claude design-session output (`.dc.html`, `styles.css`, `_ds/`, `uploads/`).
It is the source of truth for visual intent and is excluded from `tsconfig.json` and the
Docker build. Do not import from it.

## Deployment

Production runs the standard scripts — `npm ci` → `npm run build` → `npm start` — on port
3000. No Dockerfile and no custom build commands. The only environment variables are the
two read-only photo-store keys above.

This constrains `next.config.ts`: **do not add `output: "standalone"`.** That build must be
started with `node .next/standalone/server.js`, not `npm start`. Keep `next start` working
as the entrypoint. Do not switch to `output: "export"` either without checking first — it
disables `next/image` optimization and precludes server-side routes.
