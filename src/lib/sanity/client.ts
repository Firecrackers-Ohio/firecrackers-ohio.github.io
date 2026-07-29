import { createClient, type SanityClient } from "@sanity/client";

/**
 * Sanity project coordinates.
 *
 * Not secrets: a project ID and dataset name are public identifiers. Reading a
 * public dataset needs no token, which is why the GitHub Action can build the
 * site without any credentials. Only writing requires one.
 *
 * NOTE: these are duplicated in `studio/project.ts`. If you ever change them,
 * change both.
 */
export const SANITY_PROJECT_ID = "9mzt60a4";
export const SANITY_DATASET = "production";

const PLACEHOLDER = "REPLACE_WITH_SANITY_PROJECT_ID";

/** False until the project ID above has been filled in. */
export const isSanityConfigured = SANITY_PROJECT_ID !== PLACEHOLDER;

let client: SanityClient | undefined;

/**
 * Returns the shared read-only Sanity client.
 *
 * Built lazily rather than at module load so that importing this file (during
 * `astro check`, linting, or editor tooling) doesn't explode before the project
 * ID has been filled in.
 */
export function getSanityClient(): SanityClient {
  if (client) {
    return client;
  }

  if (!isSanityConfigured) {
    throw new Error(
      "Sanity is not configured yet. Replace SANITY_PROJECT_ID in " +
        "src/lib/sanity/client.ts (and studio/project.ts) with the project ID " +
        "shown at https://sanity.io/manage."
    );
  }

  client = createClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    // Pinned API date. Sanity treats this as a contract: bumping it opts in to
    // newer query behaviour, so leave it alone unless you mean to upgrade.
    apiVersion: "2026-07-27",
    // Deliberately NOT using the CDN. The cached endpoint is eventually
    // consistent, so a build kicked off moments after someone hits Publish
    // could otherwise fetch the previous version of the content.
    useCdn: false,
    // Never build drafts into the live site.
    perspective: "published",
  });

  return client;
}
