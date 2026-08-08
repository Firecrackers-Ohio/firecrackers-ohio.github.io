import { defineCollection } from "astro:content";
// Astro 6 deprecated re-exporting `z` from "astro:content"; it comes from
// "astro/zod" now. Same Zod, just a different import path.
import { z } from "astro/zod";

import { sanityLoader } from "./lib/sanity/loader";

/**
 * Portable Text: Sanity's rich-text format, an array of block objects. The
 * shape is validated by the Studio schema, so here we only assert that it's a
 * non-empty array of objects and let the renderer interpret the rest.
 */
// `looseObject` is Zod 4's name for what used to be `.object().passthrough()`:
// keep the unknown keys rather than stripping them.
const portableText = z.array(z.looseObject({ _type: z.string() })).min(1);

/**
 * A Sanity image reference. The asset ID plus optional crop and hotspot data is
 * everything the URL builder in lib/sanity/image.ts needs.
 */
const sanityImage = z.looseObject({
  asset: z.looseObject({ _ref: z.string() }),
});

/**
 * Tournaments on a schedule. The fall and spring/summer tables hold the same
 * shape, and either may be empty — a season nobody has booked yet renders its
 * heading above "Coming soon" rather than disappearing.
 */
const scheduleEvents = z
  .array(
    z.object({
      dates: z.string(),
      tournament: z.string(),
      location: z.string(),
    })
  )
  .optional();

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
    minEntries: 1,
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
      fallScheduleHeading,
      scheduleHeading,
      staff[]{ name, role, email, bio },
      roster[]{ name, number, position, gradYear, highSchool, photo },
      fallSchedule[]{ dates, tournament, location },
      schedule[]{ dates, tournament, location },
      resultTables[]{ heading, rows[]{ date, tournament, location, result } }
    }`,
    entryId: doc => String(doc.slug),
    // The nav, the Teams page and the Tryouts page are all derived from this
    // collection, so an empty result would build a site with no teams at all
    // and no error to show for it.
    minEntries: 1,
  }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    cardDescription: z.string(),
    birthYears: z.string().optional(),
    tryoutPhone: z.string().optional(),
    teamPhoto: sanityImage.optional(),
    // Zod 4 moved the string format checks to the top level: z.url(), not
    // z.string().url().
    instagramUrl: z.url().optional(),
    facebookUrl: z.url().optional(),
    fallScheduleHeading: z.string(),
    scheduleHeading: z.string(),
    staff: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          email: z.email().optional(),
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
    fallSchedule: scheduleEvents,
    schedule: scheduleEvents,
    // One table per year, newest first, in whatever order the coach arranged
    // them. A table with no rows is legitimate — a season underway with nothing
    // to report yet — and renders its heading above "Coming soon".
    resultTables: z
      .array(
        z.object({
          heading: z.string(),
          rows: z
            .array(
              z.object({
                date: z.string(),
                tournament: z.string(),
                location: z.string(),
                result: z.string(),
              })
            )
            .optional(),
        })
      )
      .optional(),
  }),
});

export const collections = { teams, about };
