import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const teams = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/content/teams",
  }),
  schema: z.object({
    title: z.string(),
    staff: z.array(
      z.object({
        name: z.string(),
        bio: z.array(z.string()),
      })
    ),
  }),
});

export const collections = { teams };
