/**
 * One-off cleanup: remove the now-unused `style` field from About page sections.
 *
 * The About schema originally let editors choose a section's appearance. That
 * was a layout control, which editors shouldn't have, so the website now
 * alternates presentation by position instead. This unsets the leftover stored
 * values so the Studio doesn't flag them as unknown fields.
 *
 * Only touches `sections[].style` — all other content is left alone.
 *
 * Run from the studio/ folder:
 *   npx sanity exec scripts/unset-about-style.mjs --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

const before = await client.fetch(
  `*[_id == "aboutPage"][0]{ pageTitle, sections[]{ _key, style } }`
);

if (!before) {
  console.log("No aboutPage document found — nothing to do.");
  process.exit(0);
}

// A bare `sections[].style` wildcard does not match on unset — array members
// have to be addressed by their _key.
const paths = (before.sections ?? [])
  .filter(section => section.style !== undefined && section._key)
  .map(section => `sections[_key=="${section._key}"].style`);

if (paths.length === 0) {
  console.log("No `style` values stored — nothing to do.");
  process.exit(0);
}

console.log(`Unsetting ${paths.length} path(s):`);
paths.forEach(p => console.log(`  ${p}`));

const result = await client.patch("aboutPage").unset(paths).commit();

const after = await client.fetch(
  `*[_id == "aboutPage"][0]{ pageTitle, "styles": sections[].style, "headings": sections[].heading }`
);

console.log(`\nPatched ${result._id} (rev ${result._rev})`);
console.log(`  style values remaining: ${(after.styles ?? []).filter(Boolean).length}`);
console.log(`  pageTitle preserved:    ${JSON.stringify(after.pageTitle)}`);
console.log(`  headings preserved:     ${JSON.stringify(after.headings)}`);
