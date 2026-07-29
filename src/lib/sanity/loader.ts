import type { Loader } from "astro/loaders";

import { getSanityClient, isSanityConfigured } from "./client";

type SanityDocument = Record<string, unknown>;

interface SanityLoaderOptions {
  /** A GROQ query that returns an array of documents. */
  query: string;
  /** Optional parameters referenced by the query. */
  params?: Record<string, unknown>;
  /**
   * Derives the content-collection entry ID from a document. Defaults to the
   * document's `_id`. Useful for singletons, where a stable, readable ID such
   * as "about" is nicer than Sanity's internal one.
   */
  entryId?: (_doc: SanityDocument, _index: number) => string;
}

/**
 * Loads documents from Sanity into an Astro content collection.
 *
 * Data still passes through the collection's Zod schema, so a malformed or
 * incomplete document fails the build loudly rather than silently publishing a
 * broken page.
 *
 * Note this couples the whole site build to Sanity being reachable: if the API
 * is down, `npm run build` fails even for pages that don't use Sanity. That's
 * the intended trade-off — a hard failure is better than deploying a page with
 * missing content.
 */
export function sanityLoader(options: SanityLoaderOptions): Loader {
  return {
    name: "sanity-loader",
    load: async ({ store, parseData, generateDigest, logger }) => {
      // Leave the collection empty rather than crashing, so `astro check` and
      // linting still work on a checkout that hasn't been pointed at a Sanity
      // project yet. Pages that need the content raise their own error.
      if (!isSanityConfigured) {
        logger.warn(
          "Sanity project ID is not set — skipping. See src/lib/sanity/client.ts"
        );
        store.clear();
        return;
      }

      const documents = await getSanityClient().fetch<SanityDocument[]>(
        options.query,
        options.params ?? {}
      );

      if (!Array.isArray(documents)) {
        throw new Error(
          `[sanity-loader] Expected the GROQ query to return an array but got ${typeof documents}. ` +
            `Check the query: ${options.query}`
        );
      }

      store.clear();

      for (const [index, doc] of documents.entries()) {
        const id = options.entryId
          ? options.entryId(doc, index)
          : String(doc._id);

        const data = await parseData({ id, data: doc });
        store.set({ id, data, digest: generateDigest(data) });
      }

      logger.info(
        `Loaded ${documents.length} document${documents.length === 1 ? "" : "s"} from Sanity`
      );
    },
  };
}
