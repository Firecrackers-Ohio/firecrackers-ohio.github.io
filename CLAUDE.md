# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server on port 3000
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier format
npm run format:check # Prettier check (used in CI)
npm run type-check   # TypeScript validation
```

## Architecture

This is an **Astro 5** static site for Firecrackers Central Ohio (competitive youth fastpitch softball), deployed to GitHub Pages at firecrackersohio.com via `.github/workflows/deploy.yml` on push to `main`.

### Workflows

- `checks.yml` — on pull requests and pushes to `main`. Format, lint, type-check and build for the website; `tsc --noEmit` and `sanity build` for `studio/`.
- `deploy.yml` — builds and deploys the site to Pages on push to `main` and on the Sanity publish webhook.
- `studio.yml` — deploys the Sanity Studio when `studio/**` changes. See `docs/sanity-cms.md`.

Node is pinned to 22 by `.nvmrc`, which every workflow reads.

### Routing

File-based routing under `src/pages/`:

- `teams/[team].astro` — dynamic team detail pages driven by content collections
- `sitemap.xml.ts` — programmatic sitemap

### Content Collections

Both collections are backed by Sanity — there are no local content files. See `docs/sanity-cms.md`.

- `teams` — one document per team, keyed by slug so `/teams/jones` works. Covers `name`, `cardDescription`, `staff[]`, `roster[]`, `schedule[]`, `results[]`, photos, and tryout contact details.
- `about` — a singleton, keyed `"about"`.

Team photos and player headshots are Sanity assets served from its CDN via `src/lib/sanity/image.ts`. Headshots are cropped to 4:5 by the CDN so uploads of any shape render uniformly.

**The teams collection drives the nav menus, the Teams listing and the Tryouts page.** There is no hardcoded list of teams anywhere — don't reintroduce one. Age-group phrasing like "from 11U through 14U" is derived from team names by `src/lib/teams.ts`.

### Sanity CMS

The About page and all team content come from Sanity — see `docs/sanity-cms.md`.

- `studio/` is a **separate npm package** (its own `package.json`, excluded from the root `tsconfig.json`) holding the Studio config and schema. Its deps are deliberately kept out of the website build. It is a separate deploy from the website: `.github/workflows/studio.yml` runs `sanity deploy` on any push to `main` touching `studio/**`, and `npm run deploy` from `studio/` does it by hand. **Schema edits — including field titles and descriptions — do nothing on the hosted Studio until that runs.**
- `src/lib/sanity/loader.ts` is a generic Astro content-collection loader — reuse it for new document types rather than fetching in page frontmatter.
- Rich text (Portable Text) renders through `src/components/RichText.astro`; paragraph styling comes from `.rich-text` / `.rich-text-xl` in `global.css`.
- A Sanity webhook triggers `repository_dispatch: sanity-publish` in `deploy.yml` on publish.
- The project ID is duplicated in `src/lib/sanity/client.ts` and `studio/project.ts`; change both. It is not a secret.
- **Document IDs must not contain a dot.** Sanity treats dotted prefixes as reserved namespaces and blocks unauthenticated reads, which silently empties the collection at build time. Use `team-jones`, never `team.jones`.
- GROQ projections return `null` for unset fields; `stripNulls` in the loader removes them so Zod schemas can use plain `.optional()`.
- The loader's `minEntries` option fails the build when a collection comes back empty, which Zod treats as valid. Both collections set it to `1`; set it on any new collection the site can't render without.
- Editors get text, images and list ordering — never style or layout. New fields should follow that.
- Coaches are Sanity **Editors**; the site owner is an Administrator. `studio/roles.ts` exports `isAdmin()` and an `adminOnly` `hidden` callback — a handful of team fields, the About page and all create/delete actions are admin-only. It's UI clarity, not enforcement (per-field permissions are Enterprise-only). Never put `adminOnly` on a required field an Editor could leave empty: hidden + required + empty silently blocks publishing. See `docs/sanity-cms.md`.

### Adding a New Team

Create the document in Sanity Studio. The nav, Teams page, Tryouts page and `/teams/{slug}` route all pick it up automatically. Nothing to change in code.

### Styling

Tailwind CSS 4 with a custom `@theme` in `src/styles/global.css` defining brand colors (red `#c20202`, yellow `#fff200`, grays, blues). Reusable CSS component classes (`.card`, `.btn-red`, `.page-title`, etc.) are defined in a `@layer components` block there — add new shared styles there rather than inline.

Fonts: Poppins (default), Almarai, Orbitron (accent).

### Key Files

- `src/config.ts` — external URLs (store, tournament, social links)
- `src/layouts/Layout.astro` — root layout; handles SEO meta, Open Graph, dark mode, skip links
- `src/middleware.ts` — security and cache-control response headers
- `astro.config.mjs` — site URL, integrations (sitemap, @playform/compress), prefetch strategy, image domains
