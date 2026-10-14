---
description: Add an event's photos to the website's photo library
argument-hint: "[event name] [photo folder, .zip, or Google Drive folder link]"
---

Add photos from a league event to the site's photo library: $ARGUMENTS

Background is in CLAUDE.md under "Event Photos". In short: every folder in the photo
store named `YYYY-MM-DD Event Title` is an album on `/photos`, and the live site picks
up new photos within 5 minutes without a deploy. `scripts/photos.mjs` does the upload.
It converts HEIC to JPEG, caps photos at 3000px, and strips GPS. Adding more photos to
an existing album is the same flow; the script skips photos already there.

## 1. Work out the event

- Match the event the user named against `src/content/schedule.ts`. Schedule dates
  have no year: the season is `site.season` (e.g. "2026–2027 Season"), so Aug–Dec
  dates are in the first year and Jan–Jul dates in the second. A date like
  "Oct 17 or 24" isn't settled, so ask which day it was.
- Album name: `YYYY-MM-DD <schedule title>`, e.g. `2026-09-12 Kickoff Event`.
- If the user named nothing, list past events without an `albumId` and ask which one.
- If the event isn't on the schedule, ask whether to add a schedule row (date, title,
  location), or to make the album without one. Never invent a date.
- If the row already has an `albumId`, this is a top-up: reuse that album. Its name
  is the slug with the date's hyphens kept, e.g. `2026-09-12-kickoff-event` is
  `2026-09-12 Kickoff Event`. Check the bucket listing if unsure.

## 2. Get the photos into a local folder

- **Local folder:** use it as is.
- **.zip** (Google Drive's folder download): extract it to a new, empty folder in the
  scratchpad (`Expand-Archive -Path <zip> -DestinationPath <new dir>` in PowerShell).
  Drive sometimes splits big folders into several zips, so extract them all into the
  same folder. If the photos land in a subfolder, use that subfolder.
- **Google Drive link:** if the Google Drive connector is available, list the
  folder's image files and download each into a new, empty scratchpad folder.
  Otherwise ask the user to download the folder from Drive (right-click → Download)
  and give you the zip's path.
- **Nothing given:** look in `~/Downloads` for recent zips or folders that look like
  event photos, and suggest them. Don't guess silently.

Count the photos (jpg, jpeg, png, webp, heic, heif, tif). Videos and other files are
skipped; mention any you saw.

## 3. Confirm before uploading

Uploading publishes the photos publicly within 5 minutes, so show this first and
wait for a yes:

- album name and the URL it will get (`https://swflrobotics.org/photos/<slug>`)
- source folder and photo count (and how many are HEIC, which will be converted)
- whether this is a new album or adding to an existing one

## 4. Upload

```
npm run photos -- "<folder>" "<YYYY-MM-DD Title>"
```

It prints a ✓ or ✗ per photo, then `albumId: <slug>`. If photos fail, show which ones
and the error. Re-running the same command retries only what's missing. If it says
keys are missing from `.env.local`, the user needs the SeaweedFS S3 keys there.

## 5. Link it from the schedule

Set `albumId: "<slug>"` on the event's row in `src/content/schedule.ts`, unless it's
already set. Commit straight to main with a message like
`Add Kickoff Event photos to the schedule`, then ask before pushing. The album is
live without a deploy, but the schedule's "Event Photos" link only appears once this
commit is deployed.

## 6. Wrap up

- Delete any scratchpad folder you created for extracted or downloaded photos.
- Tell the user: how many photos were added, the album URL (live within 5 minutes),
  and whether the schedule link is pushed.
- Mention once, briefly: photos of students should be covered by the league's photo
  releases. A photo that isn't can be deleted from the SeaweedFS dashboard (Buckets →
  event-photos → the album folder) and disappears from the site within 5 minutes.
