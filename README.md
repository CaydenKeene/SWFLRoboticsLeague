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

Deployed with **Nixpacks**, which detects Next.js and runs `npm ci` → `npm run build` →
`npm start` with no extra configuration.

In Coolify: **New Resource → Application → Public Repository**, then:

| Setting | Value |
| --- | --- |
| Repository URL | `https://github.com/CaydenKeene/SWFLRoboticsLeague` |
| Branch | `main` |
| Build Pack | `Nixpacks` |
| Base Directory | `/` |
| Port / Ports Exposes | `3000` |
| Is it a static site? | unchecked |
| Install / Build / Start Command | leave blank |

Add your domain under **Configuration → General → Domains** and deploy. No environment
variables are required.

> **Do not set `output: "standalone"` in `next.config.ts`.** That build must be launched
> with `node .next/standalone/server.js`, but Nixpacks runs `npm start` (`next start`),
> which warns and is not the intended runner for it.

The site is fully static — "Is it a static site?" is still left unchecked so Next serves
it, which keeps `next/image` optimization working.
