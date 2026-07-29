/**
 * One-off migration: src/content/teams/*.json  ->  Sanity NDJSON
 *
 * Run from the studio/ folder:
 *   node scripts/migrate-teams.mjs
 *
 * Writes seed/teams.ndjson, then import it with:
 *   npx sanity dataset import seed/teams.ndjson --dataset production --replace
 *
 * Photos are attached with Sanity's `_sanityAsset` helper, which uploads the
 * local file during import and swaps in the resulting asset reference. Paths
 * must be absolute or the importer can't find them.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const studioDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(studioDir, "..");
const teamsDir = join(repoRoot, "src/content/teams");
const assetsDir = join(repoRoot, "src/assets/rosters");

const PHOTO_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

/**
 * The teams carrying forward into the new season, with their new age group.
 *
 * Evans and Nieman are deliberately absent — those teams aren't returning, so
 * they are not migrated. Their old data stays recoverable from git history.
 *
 * `name` replaces the old title/displayName pair: the website derives the
 * capitalised heading and the longer "... Team" form from this one value.
 *
 * `cardDescription` is the blurb previously hardcoded in src/pages/teams.astro.
 * Carried over as-is so coaches can reword it themselves.
 */
const RETURNING_TEAMS = {
  brown: {
    name: "11U Brown",
    cardDescription:
      "Building fundamentals and fostering a love for the game in young athletes.",
  },
  allen: {
    name: "13U Allen",
    cardDescription:
      "Advanced skill development and competitive preparation for elite play.",
  },
  jones: {
    name: "14U Jones",
    cardDescription:
      "Building well-rounded athletes through hard work and team-first mentality.",
  },
};

/** Coach names arrive as "Phil Jones - Head Coach". Two teams use an en dash. */
function splitNameAndRole(raw) {
  const match = raw.match(/^(.*?)\s+[-–—]\s+(.*)$/);
  if (!match) {
    return { name: raw.trim(), role: "Coach", guessed: true };
  }
  return { name: match[1].trim(), role: match[2].trim(), guessed: false };
}

/** Turn an array of plain paragraphs into Portable Text blocks. */
function toPortableText(paragraphs, keyPrefix) {
  return (paragraphs ?? []).map((text, i) => ({
    _key: `${keyPrefix}-p${i}`,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: `${keyPrefix}-s${i}`, _type: "span", text, marks: [] }],
  }));
}

/** Absolute path to a player's headshot, or null if there isn't one. */
function findPlayerPhoto(teamId, number) {
  for (const ext of PHOTO_EXTENSIONS) {
    const path = join(assetsDir, teamId, `${number}.${ext}`);
    if (existsSync(path)) return path;
  }
  return null;
}

function imageField(absolutePath) {
  return { _type: "image", _sanityAsset: `image@file://${absolutePath}` };
}

const teamFiles = readdirSync(teamsDir)
  .filter(f => f.endsWith(".json"))
  .sort();

const documents = [];
const report = [];

for (const file of teamFiles) {
  const teamId = file.replace(/\.json$/, "");
  const config = RETURNING_TEAMS[teamId];

  if (!config) {
    report.push(
      `  ${teamId.padEnd(8)} SKIPPED — team not returning this season`
    );
    continue;
  }

  const data = JSON.parse(readFileSync(join(teamsDir, file), "utf8"));

  const roster = (data.roster ?? []).map((player, i) => {
    const photo = findPlayerPhoto(teamId, player.number);
    return {
      _key: `player-${player.number}-${i}`,
      _type: "player",
      name: player.name,
      number: player.number,
      position: player.position,
      gradYear: player.gradYear,
      highSchool: player.highSchool,
      ...(photo ? { photo: imageField(photo) } : {}),
    };
  });

  const staff = (data.staff ?? []).map((coach, i) => {
    const { name, role, guessed } = splitNameAndRole(coach.name);
    if (guessed) {
      report.push(
        `  ! ${teamId}: could not split "${coach.name}" — role set to "Coach"`
      );
    }
    return {
      _key: `coach-${i}`,
      _type: "coach",
      name,
      role,
      ...(coach.email ? { email: coach.email } : {}),
      bio: toPortableText(coach.bio, `coach${i}`),
    };
  });

  const schedule = (data.schedule ?? []).map((event, i) => ({
    _key: `event-${i}`,
    _type: "event",
    dates: event.dates,
    tournament: event.tournament,
    location: event.location,
  }));

  const results = (data.results ?? []).map((entry, i) => ({
    _key: `result-${i}`,
    _type: "result",
    date: entry.date,
    tournament: entry.tournament,
    location: entry.location,
    result: entry.result,
  }));

  const teamPhotoPath = data.teamPhoto
    ? join(assetsDir, teamId, data.teamPhoto)
    : null;
  if (teamPhotoPath && !existsSync(teamPhotoPath)) {
    throw new Error(
      `${teamId}: teamPhoto "${data.teamPhoto}" not found at ${teamPhotoPath}`
    );
  }

  documents.push({
    // IMPORTANT: no dot in the ID. Sanity treats dotted ID prefixes as
    // reserved namespaces (the same mechanism as `drafts.`) and refuses
    // unauthenticated reads of them. Using `team.brown` made every team
    // invisible to the public API, which would have failed the production
    // build — it reads with no token — with an empty collection.
    _id: `team-${teamId}`,
    _type: "team",
    name: config.name,
    slug: { _type: "slug", current: teamId },
    cardDescription: config.cardDescription,
    ...(teamPhotoPath ? { teamPhoto: imageField(teamPhotoPath) } : {}),
    ...(data.instagramUrl ? { instagramUrl: data.instagramUrl } : {}),
    ...(data.facebookUrl ? { facebookUrl: data.facebookUrl } : {}),
    scheduleHeading: "2026 Spring/Summer Schedule",
    resultsHeading: "2025 Fall Results",
    staff,
    roster,
    schedule,
    results,
  });

  const withPhotos = roster.filter(p => p.photo).length;
  report.push(
    `  ${teamId.padEnd(8)} ${data.title.padEnd(11)} -> ${config.name.padEnd(11)} ` +
      `${String(roster.length).padStart(2)} players ` +
      `(${withPhotos} with photos), ${staff.length} coaches, ` +
      `${schedule.length} events, ${results.length} results` +
      `${teamPhotoPath ? ", team photo" : ""}`
  );
}

const outPath = join(studioDir, "seed/teams.ndjson");
writeFileSync(outPath, documents.map(d => JSON.stringify(d)).join("\n") + "\n");

console.log(`Wrote ${documents.length} team documents to seed/teams.ndjson\n`);
console.log(report.join("\n"));

const totalPhotos = documents.reduce(
  (n, d) => n + d.roster.filter(p => p.photo).length + (d.teamPhoto ? 1 : 0),
  0
);
console.log(`\n${totalPhotos} images will be uploaded on import.`);
