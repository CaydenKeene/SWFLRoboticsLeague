# Documents

PDFs linked from the site — venue maps, event flyers, contest instructions, anything
else worth handing a coach or parent. Drop the file here, then point the entry that
should link to it at the file.

Schedule rows, in `src/content/schedule.ts`:

```ts
{ date: "Nov 14", title: "Meet 1", location: "Example HS",
  flyerUrl: "/docs/meet-1-flyer.pdf",
  mapUrl: "/docs/example-hs-map.pdf",
  info: "Park in the north lot; pits enter through the gym doors." },
```

Update messages, in `src/content/updates.ts` — same two fields, same behavior:

```ts
{ id: "logo-contest", date: "August 2026", title: "Team Logo Design Contest",
  summary: "…",
  flyerUrl: "/docs/logo-contest-flyer.pdf",
  flyerLabel: "Contest Rules & How to Enter" },
```

The path is the filename here with `/docs/` in front — `public/` is not part of the URL.
Filenames become public URLs, so keep them lowercase and hyphenated
(`example-hs-map.pdf`, not `Example HS Map FINAL (2).pdf`).

Multi-page PDFs are fine — links open in a new tab and the browser's built-in viewer
handles paging, zoom, download, and print.
