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
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["astro"],
          },
        },
      },
    },
  },
});
