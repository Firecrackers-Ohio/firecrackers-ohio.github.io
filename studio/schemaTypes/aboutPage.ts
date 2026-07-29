import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The About page.
 *
 * This is a "singleton" — exactly one document of this type ever exists, with a
 * fixed ID of `aboutPage`. The Studio config hides the create/delete actions so
 * editors can only edit the one that's there.
 *
 * The rich text options below are intentionally narrow: only paragraphs, bold,
 * italic, and links. Headings and lists are left out because the website
 * template has no styling for them, so allowing them would let an editor
 * produce something that renders badly.
 */
export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle",
      title: "Page title",
      type: "string",
      description:
        'The large heading under the logo. Displayed in capitals, e.g. "About Us".',
      initialValue: "About Us",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      description:
        "Drag to reorder. Sections appear on the page top to bottom in this order.",
      type: "array",
      validation: Rule => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "section",
          title: "Section",
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "style",
              title: "Appearance",
              type: "string",
              description:
                "Centred: plain text, slightly larger. Boxed: sits inside a grey card.",
              options: {
                list: [
                  { title: "Centred text", value: "centered" },
                  { title: "Boxed card", value: "card" },
                ],
                layout: "radio",
              },
              initialValue: "centered",
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "array",
              validation: Rule => Rule.required().min(1),
              of: [
                defineArrayMember({
                  type: "block",
                  // Paragraphs only — no headings or quote styles.
                  styles: [{ title: "Paragraph", value: "normal" }],
                  // No bulleted or numbered lists.
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
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "heading", subtitle: "style" },
            prepare: ({ title, subtitle }) => ({
              title: title || "Untitled section",
              subtitle: subtitle === "card" ? "Boxed card" : "Centred text",
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "About Page" }),
  },
});
