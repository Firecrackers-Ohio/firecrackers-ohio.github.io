import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

import { sanityLoader } from "./lib/sanity/loader";

/**
 * Portable Text: Sanity's rich-text format, an array of block objects. The
 * shape is validated by the Studio schema, so here we only assert that it's a
 * non-empty array of objects and let the renderer interpret the rest.
 */
const portableText = z
  .array(z.object({ _type: z.string() }).passthrough())
  .min(1);

/**
 * The About page, edited in Sanity Studio.
 *
 * A single document, so the collection holds exactly one entry, keyed "about".
 */
const about = defineCollection({
  loader: sanityLoader({
    query: `*[_type == "aboutPage"][0...1]{
      pageTitle,
      sections[]{ heading, style, body }
    }`,
    entryId: () => "about",
  }),
  schema: z.object({
    pageTitle: z.string(),
    sections: z
      .array(
        z.object({
          heading: z.string(),
          style: z.enum(["centered", "card"]),
          body: portableText,
        })
      )
      .min(1),
  }),
});

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

export const collections = { teams, about };
