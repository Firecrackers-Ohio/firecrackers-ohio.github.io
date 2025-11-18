// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import compress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  site: "https://firecrackersohio.com",
  integrations: [sitemap(), compress()],

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
