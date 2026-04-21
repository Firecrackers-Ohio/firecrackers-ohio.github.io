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
    teamPhoto: z.string().optional(),
    staff: z.array(
      z.object({
        name: z.string(),
        email: z.string().email().optional(),
        bio: z.array(z.string()),
      })
    ),
    roster: z
      .array(
        z.object({
          name: z.string(),
          number: z.number(),
          position: z.string(),
          gradYear: z.number(),
          highSchool: z.string(),
        })
      )
      .optional(),
    schedule: z
      .array(
        z.object({
          dates: z.string(),
          tournament: z.string(),
          location: z.string(),
        })
      )
      .optional(),
    results: z
      .array(
        z.object({
          tournament: z.string(),
          location: z.string(),
          date: z.string(),
          result: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { teams };
