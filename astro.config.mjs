// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import compress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  site: "https://firecrackersohio.com",
  integrations: [
    sitemap(),
    // Compresses the built output in place: sharp over the images, svgo over the
    // SVGs, html-minifier-terser over the HTML. That's worth about 2 MB on this
    // site, most of it images, so it stays.
    //
    // CSS is deliberately excluded. Vite has already minified it by this point,
    // and compress's CSS pass uses csso, which is old enough not to understand
    // media query range syntax (`@media (width >= 48rem)`) — when it meets one
    // it drops the whole block silently. That is how a build can pass every
    // check and ship a site with no responsive styles; see the cssMinify note
    // below. Skipping CSS here costs ~250 bytes and removes the trap.
    compress({ CSS: false }),
  ],

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
      // Kept as "esbuild" rather than `true`, which under Vite 8 means Lightning
      // CSS. Lightning CSS rewrites `@media (min-width: 48rem)` into the modern
      // range form `@media (width >= 48rem)`. That's valid CSS and 60 bytes
      // smaller across the whole site, but iOS Safari below 16.4 doesn't parse
      // it, and a browser that can't parse the media query loses every
      // responsive style on the page. Not a trade worth making for 60 bytes on
      // a site read on whatever phone a parent happens to own.
      //
      // Getting this wrong is quiet: the build succeeds, type-check and lint
      // pass, and the breakage is visible only in a browser. It is also how the
      // Astro 7 upgrade nearly shipped a site with no responsive CSS at all —
      // back then compress's csso pass deleted the range-syntax blocks outright
      // rather than merely leaving old browsers behind.
      cssMinify: "esbuild",
      // There was a `rollupOptions.output.manualChunks` entry here splitting a
      // "vendor" chunk out of `astro`. It never produced one — the whole site
      // ships a single 2 KB script, Astro's prefetch helper — and Vite 8 dropped
      // `manualChunks` for Rolldown's `advancedChunks`. Removed rather than
      // ported: there is no client bundle here worth chunking.
    },
  },
});
