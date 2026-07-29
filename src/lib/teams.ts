/**
 * Helpers for describing the current set of teams in page copy.
 *
 * Several pages used to hardcode phrases like "from 10U through 14U". Those go
 * stale the moment a team is added, removed, or ages up, so they're derived
 * from the team names instead.
 */

/** Pulls the age group out of a team name, e.g. "13U Allen" -> 13. */
export function ageGroupNumber(teamName: string): number | undefined {
  const match = teamName.match(/(\d+)\s*U/i);
  return match ? Number(match[1]) : undefined;
}

/** Just the age group label, e.g. "13U Allen" -> "13U". */
export function ageGroupLabel(teamName: string): string | undefined {
  const number = ageGroupNumber(teamName);
  return number === undefined ? undefined : `${number}U`;
}

/**
 * A phrase describing the range of age groups, for use in prose.
 *
 * Returns "from 11U through 14U" for several teams, "at 14U" for one, and an
 * empty string when there are none — so a sentence built around it still reads
 * correctly in each case.
 */
export function ageRangeLabel(teamNames: string[]): string {
  const numbers = teamNames
    .map(ageGroupNumber)
    .filter((n): n is number => n !== undefined)
    .sort((a, b) => a - b);

  if (numbers.length === 0) {
    return "";
  }

  const lowest = numbers[0];
  const highest = numbers[numbers.length - 1];

  return lowest === highest
    ? `at ${lowest}U`
    : `from ${lowest}U through ${highest}U`;
}
