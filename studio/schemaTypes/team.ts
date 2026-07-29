import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Rich text configuration shared by coach bios.
 *
 * Kept deliberately narrow — paragraphs, bold, italic and links — because the
 * website template has no styling for headings or lists.
 */
const bioBlock = defineArrayMember({
  type: "block",
  styles: [{ title: "Paragraph", value: "normal" }],
  lists: [],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" },
      { title: "Italic", value: "em" },
    ],
    annotations: [
      {
        name: "link",
        type: "object",
        title: "Link",
        fields: [
          {
            name: "href",
            type: "url",
            title: "URL",
            validation: Rule => Rule.required(),
          },
          {
            name: "newTab",
            type: "boolean",
            title: "Open in a new tab",
            initialValue: true,
          },
        ],
      },
    ],
  },
});

/**
 * A team: roster, coaching staff, schedule and results.
 *
 * One document per team. Field groups mirror the tabs on the website so the
 * Studio lines up with what a coach sees on the page.
 */
export const team = defineType({
  name: "team",
  title: "Team",
  type: "document",
  groups: [
    { name: "details", title: "Details", default: true },
    { name: "roster", title: "Roster" },
    { name: "coaches", title: "Coaches" },
    { name: "schedule", title: "Schedule" },
    { name: "results", title: "Results" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Team name",
      type: "string",
      group: "details",
      description:
        'Include the age group, e.g. "14U Jones" — update this when the team ages up. The website capitalises it for the big heading and adds "Team" where a longer name is needed, so this is the only place it needs changing.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      group: "details",
      description:
        '⚠️ Determines the page address, e.g. "jones" makes firecrackersohio.com/teams/jones. Locked once saved, because changing it would break every existing link to this team. Ask a developer if it genuinely needs changing.',
      options: { source: "name", maxLength: 40 },
      // Settable when the team is first created, then locked.
      readOnly: ({ value }) => Boolean(value),
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "cardDescription",
      title: "Short description",
      type: "text",
      rows: 2,
      group: "details",
      description:
        "One or two lines shown on the Teams listing page, under the team name. Keep it short — long text makes the cards uneven.",
      validation: Rule => Rule.required().max(160),
    }),
    defineField({
      name: "teamPhoto",
      title: "Team photo",
      type: "image",
      group: "details",
      description:
        "Wide group shot, shown above the tabs. Hidden on phones. Optional.",
      options: { hotspot: true },
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram page",
      type: "url",
      group: "details",
      description:
        "Optional. Falls back to the main Firecrackers Ohio account if empty.",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook page",
      type: "url",
      group: "details",
      description:
        "Optional. Falls back to the main Firecrackers Ohio page if empty.",
    }),

    defineField({
      name: "birthYears",
      title: "Birth year range",
      type: "string",
      group: "details",
      description:
<<<<<<< Updated upstream
        'Eligibility window for this age group, shown on the Tryouts page, e.g. "SEPT 2014 - DEC 2015". Shifts by a year each season.',
=======
        'Eligibility window for this age group, shown on the Tryouts page, e.g. "SEPT 2013 - DEC 2014"',
>>>>>>> Stashed changes
    }),
    defineField({
      name: "tryoutPhone",
      title: "Contact phone",
      type: "string",
      group: "details",
      description:
        "Head coach's phone number, shown on the Tryouts page next to their email. Leave empty to show only the email.",
    }),

    defineField({
      name: "roster",
      title: "Players",
      type: "array",
      group: "roster",
      description:
        'Drag to reorder. Players appear in this order on the page. Leave empty and the tab shows "Coming soon".',
      of: [
        defineArrayMember({
          type: "object",
          name: "player",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "number",
              title: "Jersey number",
              type: "number",
              validation: Rule => Rule.required().integer().min(0).max(99),
            }),
            defineField({
              name: "position",
              title: "Position",
              type: "string",
              description:
                'Free text — write it however you like, e.g. "P/SS/OF" or "Catcher".',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "gradYear",
              title: "Graduation year",
              type: "number",
              validation: Rule => Rule.required().integer().min(2020).max(2050),
            }),
            defineField({
              name: "highSchool",
              title: "High school",
              type: "string",
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "photo",
              title: "Headshot",
              type: "image",
              description:
                "Optional. Portrait orientation works best. Use the crop tool to centre the face.",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: {
              title: "name",
              number: "number",
              position: "position",
              media: "photo",
            },
            prepare: ({ title, number, position, media }) => ({
              title: `#${number ?? "?"} ${title || "Unnamed player"}`,
              subtitle: position,
              media,
            }),
          },
        }),
      ],
    }),

    defineField({
      name: "staff",
      title: "Coaching staff",
      type: "array",
      group: "coaches",
      description: "Drag to reorder. Usually head coach first.",
      validation: Rule => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "coach",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              description: 'Just the name, e.g. "Phil Jones".',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              description: 'e.g. "Head Coach", "Assistant Coach".',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "email",
              title: "Email address",
              type: "string",
              description:
                'Optional. When set, the page shows an "Email Coach ..." link.',
              validation: Rule =>
                Rule.email().error("Must be a valid email address"),
            }),
            defineField({
              name: "bio",
              title: "Biography",
              type: "array",
              of: [bioBlock],
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "role", media: "photo" },
          },
        }),
      ],
    }),

    defineField({
      name: "scheduleHeading",
      title: "Schedule heading",
      type: "string",
      group: "schedule",
      description:
        'Shown above the schedule table, in capitals. Update each season, e.g. "2026 Spring/Summer Schedule".',
      initialValue: "2026 Spring/Summer Schedule",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "schedule",
      title: "Tournaments",
      type: "array",
      group: "schedule",
      description:
        'Drag to reorder. Leave empty and the tab shows "Coming soon".',
      of: [
        defineArrayMember({
          type: "object",
          name: "event",
          fields: [
            defineField({
              name: "dates",
              title: "Dates",
              type: "string",
              description: 'Free text, e.g. "5/22 - 5/24".',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "tournament",
              title: "Tournament",
              type: "string",
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "tournament", subtitle: "dates" },
          },
        }),
      ],
    }),

    defineField({
      name: "resultsHeading",
      title: "Results heading",
      type: "string",
      group: "results",
      description:
        'Shown above the results table, in capitals. Update each season, e.g. "2025 Fall Results".',
      initialValue: "2025 Fall Results",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "results",
      title: "Finishes",
      type: "array",
      group: "results",
      description:
        'Drag to reorder. Leave empty and the tab shows "Coming soon".',
      of: [
        defineArrayMember({
          type: "object",
          name: "result",
          fields: [
            defineField({
              name: "date",
              title: "Date",
              type: "string",
              description: 'Free text, e.g. "Oct 11".',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "tournament",
              title: "Tournament",
              type: "string",
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "result",
              title: "Finish",
              type: "string",
              description:
                'Free text, e.g. "Champions", "2nd Place", "Semi-Finalist".',
              validation: Rule => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "tournament", subtitle: "result" },
          },
        }),
      ],
    }),
  ],

  preview: {
    select: { title: "name", subtitle: "cardDescription", media: "teamPhoto" },
  },

  orderings: [
    {
      title: "Team name",
      name: "nameAsc",
      by: [{ field: "name", direction: "asc" }],
    },
  ],
});
