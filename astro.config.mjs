// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import compress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  site: "https://firecrackersohio.com",
  integrations: [sitemap(), compress()],

  // Pages for teams that no longer exist. On a static build Astro emits a small
  // HTML page with a meta refresh and a canonical link, since GitHub Pages can't
  // issue a real 301. Add an entry here whenever a team is retired, so old links
  // shared on social media land somewhere useful instead of on a 404.
  redirects: {
    "/teams/evans": "/teams",
    "/teams/nieman": "/teams",
  },

  // Build optimizations
  build: {
    inlineStylesheets: "auto",
  },

  // Image optimization
  image: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.gstatic.com",
      },
    ],
  },

  // Prefetch configuration
  prefetch: {
    defaultStrategy: "viewport",
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true,
  },

  vite: {
    plugins: [tailwindcss()],

    // Build optimizations
    build: {
      // Must stay "esbuild" — do not change this to `true`.
      //
      // Vite 8 changed what `true` means: it now runs Lightning CSS, which
      // rewrites `@media (min-width: 48rem)` into the equivalent modern range
      // syntax `@media (width >= 48rem)`. The @playform/compress integration
      // then minifies dist/ a second time with a parser that doesn't
      // understand that syntax, and silently drops every one of those blocks.
      //
      // The result is a build that succeeds, type-checks and lints clean while
      // shipping a site with no responsive styles at all — no `md:` or `lg:`
      // utility survives, so the mobile menu shows on desktop and the desktop
      // nav never appears. Pinning esbuild keeps the old output syntax, which
      // compress handles, and produces byte-identical CSS to Astro 5.
      cssMinify: "esbuild",
      // There was a `rollupOptions.output.manualChunks` entry here splitting a
      // "vendor" chunk out of `astro`. It never produced one — the whole site
      // ships a single 2 KB script, Astro's prefetch helper — and Vite 8 dropped
      // `manualChunks` for Rolldown's `advancedChunks`. Removed rather than
      // ported: there is no client bundle here worth chunking.
    },
  },
});
