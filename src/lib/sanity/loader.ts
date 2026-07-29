import type { Loader } from "astro/loaders";

import { getSanityClient } from "./client";

type SanityDocument = Record<string, unknown>;

/**
 * Removes null values, recursively.
 *
 * A GROQ projection always returns every key it asks for, using null where the
 * field isn't set. Zod's `.optional()` rejects an explicit null, so without this
 * every optional field would need `.nullish()` and the schemas would stop
 * reading like plain descriptions of the data. Since a null from GROQ means
 * "absent", dropping the key is the accurate translation.
 */
function stripNulls(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.filter(item => item !== null).map(stripNulls);
  }

  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== null)
        .map(([k, v]) => [k, stripNulls(v)])
    );
  }

  return value;
}

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

        const data = await parseData({
          id,
          data: stripNulls(doc) as SanityDocument,
        });
        store.set({ id, data, digest: generateDigest(data) });
      }

      logger.info(
        `Loaded ${documents.length} document${documents.length === 1 ? "" : "s"} from Sanity`
      );
    },
  };
}
