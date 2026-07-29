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

### Routing

File-based routing under `src/pages/`:
- `teams/[team].astro` — dynamic team detail pages driven by content collections
- `sitemap.xml.ts` — programmatic sitemap

### Content Collections

Teams are defined as JSON files in `src/content/teams/` (e.g., `brown.json`, `jones.json`). The schema (validated with Zod in `src/content.config.ts`) includes: `title`, `displayName`, `staff[]`, `roster[]`, `schedule[]`, `results[]`, `instagramUrl`, `facebookUrl`, `teamPhoto`.

Roster player photos live in `src/assets/rosters/{teamId}/{number}.jpg` and are loaded dynamically in the team page using Astro's `import.meta.glob`.

### Sanity CMS (About page only)

The About page content comes from Sanity, not from code — see `docs/sanity-cms.md`. Everything else is still hardcoded; this is a pilot.

- `studio/` is a **separate npm package** (its own `package.json`, excluded from the root `tsconfig.json`) holding the Studio config and schema. Its deps are deliberately kept out of the website build. Deployed on its own with `npm run deploy` from `studio/`.
- `src/lib/sanity/loader.ts` is a generic Astro content-collection loader — reuse it for new document types rather than fetching in page frontmatter.
- Rich text (Portable Text) renders through `src/components/RichText.astro`; paragraph styling comes from `.rich-text` / `.rich-text-xl` in `global.css`.
- A Sanity webhook triggers `repository_dispatch: sanity-publish` in `deploy.yml` on publish.
- The project ID is duplicated in `src/lib/sanity/client.ts` and `studio/project.ts`; change both. It is not a secret.

### Styling

Tailwind CSS 4 with a custom `@theme` in `src/styles/global.css` defining brand colors (red `#c20202`, yellow `#fff200`, grays, blues). Reusable CSS component classes (`.card`, `.btn-red`, `.page-title`, etc.) are defined in a `@layer components` block there — add new shared styles there rather than inline.

Fonts: Poppins (default), Almarai, Orbitron (accent).

### Key Files

- `src/config.ts` — external URLs (store, tournament, social links)
- `src/layouts/Layout.astro` — root layout; handles SEO meta, Open Graph, dark mode, skip links
- `src/middleware.ts` — security and cache-control response headers
- `astro.config.mjs` — site URL, integrations (sitemap, @playform/compress), prefetch strategy, image domains

### Adding a New Team

1. Create `src/content/teams/{id}.json` following the existing schema
2. Add roster photos to `src/assets/rosters/{id}/`
3. The dynamic route `teams/[team].astro` picks it up automatically
