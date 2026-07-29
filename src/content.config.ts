import { defineCollection, z } from "astro:content";

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
 * A Sanity image reference. The asset ID plus optional crop and hotspot data is
 * everything the URL builder in lib/sanity/image.ts needs.
 */
const sanityImage = z
  .object({ asset: z.object({ _ref: z.string() }).passthrough() })
  .passthrough();

/**
 * The About page, edited in Sanity Studio.
 *
 * A single document, so the collection holds exactly one entry, keyed "about".
 */
const about = defineCollection({
  loader: sanityLoader({
    query: `*[_type == "aboutPage"][0...1]{
      pageTitle,
      sections[]{ heading, body }
    }`,
    entryId: () => "about",
  }),
  schema: z.object({
    pageTitle: z.string(),
    sections: z
      .array(
        z.object({
          heading: z.string(),
          body: portableText,
        })
      )
      .min(1),
  }),
});

/**
 * Teams, edited in Sanity Studio.
 *
 * The entry ID is the team's slug, so `/teams/jones` keeps working and the
 * dynamic route needs no translation layer.
 *
 * Note `staff` requires at least one coach but `roster` may be empty — a team
 * between seasons legitimately has no players listed yet, and the page shows
 * "Coming soon" in that case.
 */
const teams = defineCollection({
  loader: sanityLoader({
    query: `*[_type == "team" && defined(slug.current)]|order(name asc){
      name,
      "slug": slug.current,
      cardDescription,
      birthYears,
      tryoutPhone,
      teamPhoto,
      instagramUrl,
      facebookUrl,
      scheduleHeading,
      resultsHeading,
      staff[]{ name, role, email, bio },
      roster[]{ name, number, position, gradYear, highSchool, photo },
      schedule[]{ dates, tournament, location },
      results[]{ date, tournament, location, result }
    }`,
    entryId: doc => String(doc.slug),
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    cardDescription: z.string(),
    birthYears: z.string().optional(),
    tryoutPhone: z.string().optional(),
    teamPhoto: sanityImage.optional(),
    instagramUrl: z.string().url().optional(),
    facebookUrl: z.string().url().optional(),
    scheduleHeading: z.string(),
    resultsHeading: z.string(),
    staff: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          email: z.string().email().optional(),
          bio: portableText.optional(),
        })
      )
      .min(1),
    roster: z
      .array(
        z.object({
          name: z.string(),
          number: z.number(),
          position: z.string(),
          gradYear: z.number(),
          highSchool: z.string(),
          photo: sanityImage.optional(),
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
          date: z.string(),
          tournament: z.string(),
          location: z.string(),
          result: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { teams, about };
