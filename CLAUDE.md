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
no database, API route, or CMS.

### Structure

- `src/app/page.tsx` — composes the five anchor sections in order
- `src/components/sections/` — one component per page section (`hero`, `updates`,
  `schedule`, `contact`, `donate`)
- `src/components/site-header.tsx` — sticky header; client component
  (`"use client"` for the mobile menu toggle)
- `src/components/copy-email-button.tsx` — client component; copies `site.email` to the
  clipboard for the contact section, which stays a server component
- `src/components/wrap.tsx` — shared 1120px page gutter used by every section
- `src/content/` — all copy and season data
- `public/` — league logo (temporary) and the official FTC mark

### Content Convention

**Do not hardcode season content in JSX.** Copy, schedule rows, and team updates live in
`src/content/*.ts` as typed data; section components only render it. New content of an
existing kind should be a data entry, not new markup.

Three conventions the components depend on:

- `ScheduleEvent.location === null` renders **TBD**
- A `ScheduleEvent` with neither `mapUrl` nor `info` renders **TBD** in the Map & Info
  column; `mapUrl` points at a PDF in `public/maps/`
- `site.donateUrl === "#"` renders a non-clickable placeholder instead of the donate button

### Styling Conventions

- Brand colors and fonts are Tailwind theme tokens (`navy`, `cream`, `orange`, `rust`,
  `teal`, `bone`; `font-display`, `font-sans`) — use them instead of arbitrary hex values.
- The design's angular geometry comes from three utilities in `src/app/globals.css`:
  `.clip-slant`, `.clip-notch`, `.hero-stripes`. Reuse these rather than writing new
  `clip-path` values.
- Headings use `font-display` (Archivo Black) and are uppercased via `uppercase`, not by
  uppercasing the source strings.
- No dark mode — this is a fixed-palette brand site.

### design-reference/

The original Claude design-session output (`.dc.html`, `styles.css`, `_ds/`, `uploads/`).
It is the source of truth for visual intent and is excluded from `tsconfig.json` and the
Docker build. Do not import from it.

## Deployment

Production runs the standard scripts — `npm ci` → `npm run build` → `npm start` — on port
3000. No Dockerfile, no custom build commands, no environment variables.

This constrains `next.config.ts`: **do not add `output: "standalone"`.** That build must be
started with `node .next/standalone/server.js`, not `npm start`. Keep `next start` working
as the entrypoint. Do not switch to `output: "export"` either without checking first — it
disables `next/image` optimization and precludes server-side routes.
