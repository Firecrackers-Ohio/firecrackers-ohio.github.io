import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes, singletonTypes } from "./schemaTypes";
import { dataset, projectId } from "./project";
import { isAdmin } from "./roles";

export default defineConfig({
  name: "default",
  title: "Firecrackers Central Ohio",
  projectId,
  dataset,

  plugins: [
    structureTool({
      // Custom sidebar. Because the About page is a singleton we link straight
      // to the one document instead of showing a list with a "create" button.
      // Coaches see only Teams — the About page isn't theirs to edit, so it
      // isn't in their sidebar at all.
      structure: (S, { currentUser }) =>
        S.list()
          .title("Website content")
          .items([
            S.listItem()
              .title("Teams")
              .schemaType("team")
              .child(
                S.documentTypeList("team")
                  .title("Teams")
                  .defaultOrdering([{ field: "name", direction: "asc" }])
              ),
            ...(isAdmin(currentUser)
              ? [
                  S.divider(),
                  S.listItem()
                    .title("About page")
                    .id("aboutPage")
                    .child(
                      S.document()
                        .schemaType("aboutPage")
                        .documentId("aboutPage")
                        .title("About page")
                    ),
                ]
              : []),
          ]),
    }),
    // Lets you run GROQ queries against the dataset from inside the Studio.
    // Handy for debugging; harmless to leave enabled.
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Remove singletons from the global "create new document" menu.
    templates: templates =>
      templates.filter(template => !singletonTypes.has(template.schemaType)),
  },

  document: {
    // Strip "duplicate", "delete" and "unpublish" from singletons so an editor
    // can't accidentally remove the only About page document. Coaches get the
    // same treatment on every type: edit and publish, nothing structural.
    actions: (actions, { schemaType, currentUser }) =>
      singletonTypes.has(schemaType) || !isAdmin(currentUser)
        ? actions.filter(action =>
            ["publish", "discardChanges", "restore"].includes(
              action.action ?? ""
            )
          )
        : actions,

    // Adding a team is an admin job — a coach who created one couldn't fill in
    // the (hidden) name and web address, so publishing would fail on validation
    // errors they can't see. This removes the "create" buttons for them.
    newDocumentOptions: (options, { currentUser }) =>
      isAdmin(currentUser) ? options : [],
  },
});
