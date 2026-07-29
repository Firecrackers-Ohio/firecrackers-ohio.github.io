/**
 * One-off: add tryout contact details to the migrated teams.
 *
 * Phone numbers come from the previous hardcoded tryouts page (they were
 * identical in both the old and current versions of that file).
 *
 * Birth year ranges are shifted forward one season from the last generic
 * tryouts page, which covered 2026:
 *   2026: 10U = SEPT 2014 - DEC 2015, 12U = SEPT 2012 - DEC 2013, 13U = SEPT 2011 - DEC 2012
 *   2027: 11U = SEPT 2014 - DEC 2015, 13U = SEPT 2012 - DEC 2013, 14U = SEPT 2011 - DEC 2012
 * A player born SEPT 2014 - DEC 2015 was 10U in 2026 and is 11U in 2027, so the
 * ranges carry over intact — but these are worth a human check.
 *
 * Run from the studio/ folder:
 *   npx sanity exec scripts/add-tryout-details.mjs --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

const DETAILS = {
  "team-brown": {
    tryoutPhone: "(614) 989-6569",
    birthYears: "SEPT 2014 - DEC 2015",
  },
  "team-allen": {
    tryoutPhone: "(614) 917-8858",
    birthYears: "SEPT 2012 - DEC 2013",
  },
  "team-jones": {
    tryoutPhone: "(614) 440-8009",
    birthYears: "SEPT 2011 - DEC 2012",
  },
};

for (const [id, fields] of Object.entries(DETAILS)) {
  const result = await client.patch(id).set(fields).commit();
  console.log(`${result._id}: ${fields.birthYears}, ${fields.tryoutPhone}`);
}

const check = await client.fetch(
  `*[_type == "team"]|order(name asc){name, birthYears, tryoutPhone, "headCoach": staff[0].name, "email": staff[0].email}`
);
console.log("\nResulting tryout contact data:");
console.table(check);
