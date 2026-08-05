# SWFL Robotics League

Website for the SWFL Robotics League — a FIRST Tech Challenge league serving Manatee,
Sarasota, Charlotte, Lee, and Collier Counties, organized by SWFL Robotics, Inc.

Built from the original design-session output (kept in [`design-reference/`](./design-reference)).

## Built With

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS 3**
- **Archivo Black** / **Barlow** via `next/font`
- **lucide-react** icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts: `npm run build`, `npm start`, `npm run lint`.

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

## Deploying to Coolify

The included `Dockerfile` builds a standalone Next.js server (`output: "standalone"`
in `next.config.ts`), producing a small runtime image that starts with `node server.js`.

1. Push this repo to GitHub.
2. In Coolify: **New Resource → Application → Public/Private Repository**, pick this repo.
3. Set **Build Pack** to `Dockerfile`.
4. Set **Port** to `3000`.
5. Add your domain and deploy.

No environment variables are required. The container listens on `0.0.0.0:3000` and runs
as a non-root `nextjs` user.
