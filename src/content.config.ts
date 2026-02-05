import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const teams = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/teams",
  }),
  schema: z.object({
    title: z.string(),
    displayName: z.string().optional(),
    instagramUrl: z.string().url().optional(),
    facebookUrl: z.string().url().optional(),
    staff: z.array(
      z.object({
        name: z.string(),
        email: z.string().email().optional(),
        bio: z.array(z.string()),
      })
    ),
  }),
});

export const collections = { teams };
