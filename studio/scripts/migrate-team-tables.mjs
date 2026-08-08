/**
 * One-off: bring existing teams onto the new Schedule and Results structure.
 *
 * Two changes, both of which need existing documents filled in — `initialValue`
 * in the schema only applies to documents created after it:
 *
 * 1. The Schedule tab gained a fall table alongside the spring/summer one, so
 *    every team needs a `fallScheduleHeading`. The tournaments themselves stay
 *    empty until a coach adds them, which renders as "Coming soon".
 *
 * 2. Results used to be one fixed table per team — `resultsHeading` plus a flat
 *    `results` array — so a new season meant deleting last season's finishes.
 *    They are now a list of tables, one per year, that coaches add to. This
 *    copies what each team has today into its first table.
 *
 * Run from the studio/ folder, BEFORE merging the branch that reads the new
 * fields. Nothing reads them until then, so this is invisible to the live site,
 * and merging afterwards finds the data already in place:
 *
 *   npx sanity exec scripts/migrate-team-tables.mjs --with-user-token
 *
 * Re-running is safe: anything already done is skipped.
 *
 * The old results fields are deliberately left behind as a backup. Once the live
 * site is confirmed good, clear them with:
 *
 *   npx sanity exec scripts/migrate-team-tables.mjs --with-user-token -- --cleanup
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();
const cleanup = process.argv.includes("--cleanup");

/** Matches the schema's initialValue, so new and existing teams start alike. */
const FALL_HEADING = "2026 Fall Schedule";

/**
 * Sanity needs a `_key` on every array member. The rows already have one from
 * their old array; the table wrapping them is new, so it needs its own.
 */
function keyed(rows) {
  return (rows ?? []).map((row, i) => ({
    ...row,
    _key: row._key ?? `row-${i}`,
  }));
}

// Drafts matter: patching only the published document would leave a coach's
// in-progress draft without the new fields, and publishing it later would wipe
// what this script just wrote.
const teams = await client.fetch(
  `*[_type == "team"]|order(name asc){
    _id, name, fallScheduleHeading, resultsHeading, results, resultTables
  }`
);

if (teams.length === 0) {
  throw new Error("No team documents found — is the dataset right?");
}

for (const team of teams) {
  const isDraft = team._id.startsWith("drafts.");
  const label = `${team.name ?? team._id}${isDraft ? " (draft)" : ""}`;

  // Loose `== null` throughout: a GROQ projection returns null for an unset
  // field rather than omitting it, so `=== undefined` would never match and
  // every team would look like it had already been done.
  if (cleanup) {
    if (team.resultsHeading == null && team.results == null) {
      console.log(`${label}: already clean`);
      continue;
    }
    await client.patch(team._id).unset(["resultsHeading", "results"]).commit();
    console.log(`${label}: removed legacy resultsHeading/results`);
    continue;
  }

  const changes = {};
  const notes = [];

  if (team.fallScheduleHeading == null) {
    changes.fallScheduleHeading = FALL_HEADING;
    notes.push(`fall heading "${FALL_HEADING}"`);
  }

  // A team with no finishes recorded gets no table at all — the tab shows
  // "Coming soon", exactly as it does today.
  if (team.resultTables == null && team.results?.length > 0) {
    changes.resultTables = [
      {
        _key: "table-0",
        _type: "resultTable",
        heading: team.resultsHeading ?? "Results",
        rows: keyed(team.results),
      },
    ];
    notes.push(
      `results table "${changes.resultTables[0].heading}" with ${changes.resultTables[0].rows.length} row(s)`
    );
  }

  if (notes.length === 0) {
    console.log(`${label}: nothing to do`);
    continue;
  }

  await client.patch(team._id).set(changes).commit();
  console.log(`${label}: ${notes.join(", ")}`);
}

const check = await client.fetch(
  `*[_type == "team"]|order(name asc){
    name,
    fallScheduleHeading,
    scheduleHeading,
    "tables": count(resultTables),
    "rows": count(resultTables[].rows[]),
    "legacyRows": count(results)
  }`
);
console.log(`\nResulting team data${cleanup ? " (after cleanup)" : ""}:`);
console.table(check);
