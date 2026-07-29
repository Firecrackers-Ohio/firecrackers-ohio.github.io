/**
 * One-off: add tryout contact details to the migrated teams.
 *
 * Phone numbers come from the previous hardcoded tryouts page (they were
 * identical in both the old and current versions of that file).
 *
 * Birth year ranges belong to the age group, not to the team, and do NOT shift
 * from season to season. 11U is always the same window; it's the teams that move
 * between age groups. So each team takes the range for whichever age group it now
 * plays in, read straight off the previous tryouts page:
 *
 *   10U = SEPT 2014 - DEC 2015
 *   11U = SEPT 2013 - DEC 2014
 *   12U = SEPT 2012 - DEC 2013
 *   13U = SEPT 2011 - DEC 2012
 *   14U = SEPT 2010 - DEC 2011
 *
 * Run from the studio/ folder:
 *   npx sanity exec scripts/add-tryout-details.mjs --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

const DETAILS = {
  // 11U Brown
  "team-brown": {
    tryoutPhone: "(614) 989-6569",
    birthYears: "SEPT 2013 - DEC 2014",
  },
  // 13U Allen
  "team-allen": {
    tryoutPhone: "(614) 917-8858",
    birthYears: "SEPT 2011 - DEC 2012",
  },
  // 14U Jones
  "team-jones": {
    tryoutPhone: "(614) 440-8009",
    birthYears: "SEPT 2010 - DEC 2011",
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
