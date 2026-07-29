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

let client: SanityClient | undefined;

/**
 * Returns the shared read-only Sanity client.
 *
 * Built lazily rather than at module load so that importing this file doesn't
 * open a connection during linting or editor tooling.
 */
export function getSanityClient(): SanityClient {
  if (client) {
    return client;
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
