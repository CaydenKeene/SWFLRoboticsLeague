# Venue maps

Drop each venue's map PDF in this folder, then point the matching schedule row at it
in `src/content/schedule.ts`:

```ts
{ date: "Nov 14", title: "Meet 1", location: "Example HS",
  mapUrl: "/maps/example-hs.pdf",
  info: "Park in the north lot; pits enter through the gym doors." },
```

The path in `mapUrl` is the filename here with `/maps/` in front — `public/` itself is
not part of the URL. Filenames become public URLs, so keep them lowercase and hyphenated
(`charlotte-hs.pdf`, not `Charlotte HS Map FINAL (2).pdf`).

Multi-page PDFs are fine — the link opens in a new tab and the browser's built-in viewer
handles paging, zoom, download, and print.
