# SWFL Robotics League

Website for the SWFL Robotics League — a FIRST Tech Challenge league serving Manatee,
Sarasota, Charlotte, Lee, and Collier Counties, organized by SWFL Robotics, Inc.

**Live at [swflrobotics.org](https://swflrobotics.org)**

Built from the original design-session output (kept in [`design-reference/`](./design-reference)).

## Built With

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS 3**
- **Archivo Black** / **Barlow** via `next/font`
- **lucide-react** icons

## Running It Locally

You'll need [Node.js](https://nodejs.org) 20 or newer (`node --version` to check) and git.

```bash
git clone https://github.com/CaydenKeene/SWFLRoboticsLeague.git
cd SWFLRoboticsLeague
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server hot-reloads — save a
file and the page updates without a restart.

No environment variables, database, or API keys are required. Everything the site renders
is in this repo.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build — run this before opening a PR |
| `npm start` | Serve the production build (run `npm run build` first) |
| `npm run lint` | ESLint |

### Where things live

```
src/
├── app/
│   ├── layout.tsx        fonts, <head> metadata
│   ├── page.tsx          composes the page sections in order
│   └── globals.css       Tailwind entry + custom utilities
├── components/
│   ├── site-header.tsx   sticky header + mobile menu
│   ├── site-footer.tsx
│   ├── wrap.tsx          shared page gutter
│   └── sections/         one file per section of the page
├── content/              all copy and season data  ← usually what you want
└── lib/utils.ts
public/                   logos
design-reference/         original design output, not used at runtime
```

## Contributing

1. Branch off `main`.
2. Make your change — for content updates that means editing `src/content/`, not JSX.
3. Run `npm run lint` and `npm run build` to confirm nothing broke.
4. Open a pull request.

Merged changes to `main` are published to the live site by the maintainer.

## Editing Site Content

Season content is data, not markup — you shouldn't need to touch JSX to keep the site current.

| What to change | File |
| --- | --- |
| Contact email, donate link, nav, hero copy, "Our Story" | `src/content/site.ts` |
| Meet dates, titles, venues | `src/content/schedule.ts` |
| Messages to teams | `src/content/updates.ts` |

### Adding an update

Add an entry to the **top** of the `updates` array in `src/content/updates.ts` — the
section renders newest-first in array order.

```ts
{
  id: "unique-slug",
  date: "September 2026",
  title: "Kickoff Recap",
  tag: "New",          // optional pill next to the date
  summary: "Short lede paragraph.",
  sections: [          // optional numbered detail blocks
    { heading: "Attendance", body: "…" },
  ],
}
```

### Marking a venue as confirmed

In `src/content/schedule.ts`, set `location` to the venue name. Leaving it `null`
renders **TBD**.

### Turning on the donate button

Set `donateUrl` in `src/content/site.ts` to the real donation link. While it's `"#"`,
the Donate section shows a non-clickable "Donation Link Coming Soon" placeholder
instead of a button that goes nowhere.

## Brand

Palette and fonts are defined once in `tailwind.config.ts` and used as Tailwind
utilities (`bg-navy`, `text-orange`, `font-display`, …).

| Token | Hex | Use |
| --- | --- | --- |
| `navy` | `#0B2545` | Header, hero, schedule, footer |
| `cream` | `#F7EFDE` | Page background |
| `orange` | `#F26722` | Primary buttons, accents |
| `rust` | `#C4531A` | Eyebrow text on light backgrounds |
| `teal` | `#0E7C7B` | Donate section, status pills |
| `bone` | `#F2E4CD` | Logo fill |

Three custom utilities live in `src/app/globals.css`: `.clip-slant` (angled button
edge), `.clip-notch` (cut card corner), and `.hero-stripes` (diagonal hero accents).

## Assets

`public/league-logo-temp.svg` is the **temporary** league logo — it's a placeholder
pending the team logo design contest. Swap the file (keeping the name, or updating
the reference in `src/components/site-header.tsx`) once a winner is chosen.

`public/ftc-logo-horizontal-reverse.png` is the official FIRST Tech Challenge mark and
should be used unmodified. Additional official FTC logo formats are in
`design-reference/uploads/`.

## Deployment

Hosting is managed by the maintainer; contributors don't need to configure anything.

The one thing to know: production builds and starts the app with the standard scripts —
`npm ci` → `npm run build` → `npm start`, listening on port 3000. So `npm start` has to
keep working.

> **Don't add `output: "standalone"` to `next.config.ts`.** It looks harmless, but that
> build is meant to be launched with `node .next/standalone/server.js`, and `npm start`
> is not the intended runner for it.

Similarly, don't switch to `output: "export"` without discussing it first — it would
disable `next/image` optimization and rule out ever adding a server-side route.
