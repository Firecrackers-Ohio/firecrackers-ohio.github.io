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
  /**
   * Fails the build if the query returns fewer documents than this.
   *
   * Zod validates each document, but an empty result set is valid to Zod and to
   * every page that maps over it — the site just builds without that content.
   * For teams that means a Teams page with no teams, a nav with no menu and a
   * Tryouts page with nothing to try out for, all from a green build. That has
   * come close to shipping before: document IDs containing a dot are silently
   * unreadable to the public API, which empties the collection rather than
   * erroring. Set this on any collection the site can't sensibly render without.
   */
  minEntries?: number;
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
    load: async ({ collection, store, parseData, generateDigest, logger }) => {
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

      const minEntries = options.minEntries ?? 0;
      if (documents.length < minEntries) {
        throw new Error(
          `[sanity-loader] The "${collection}" collection needs at least ${minEntries} ` +
            `document(s) but Sanity returned ${documents.length}. The site would build ` +
            `without this content rather than fail, so the build is stopped here.\n\n` +
            `Likely causes: nothing published yet, a document ID containing a dot ` +
            `(unreadable to the public API — see docs/sanity-cms.md), or a dataset or ` +
            `project ID mismatch in src/lib/sanity/client.ts.\n\n` +
            `Query: ${options.query}`
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
