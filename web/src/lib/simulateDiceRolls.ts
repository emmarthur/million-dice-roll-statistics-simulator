/** Book uses exactly one million iterations for stable percentage estimates. */
export const TOTAL_ROLLS = 1_000_000;

export type DiceResults = Record<number, number>;

export type ResultRow = {
  total: number;
  rolls: number;
  percentage: number;
};

/** Keys are every possible sum from N dice (min N, max N×6); counts start at zero. */
export function createEmptyResults(numberOfDice: number): DiceResults {
  const results: DiceResults = {};
  for (let i = numberOfDice; i <= numberOfDice * 6; i += 1) {
    results[i] = 0;
  }
  return results;
}

/** Same loop structure as Al Sweigart's milliondicestats.py */
export function simulateRolls(
  numberOfDice: number,
  onProgress?: (percent: number) => void,
): DiceResults {
  const results = createEmptyResults(numberOfDice);
  let lastReportTime = performance.now();

  for (let i = 0; i < TOTAL_ROLLS; i += 1) {
    // Book: about once per second, print round(i / 10000, 1) as "% done..."
    if (onProgress && performance.now() > lastReportTime + 1000) {
      onProgress(Math.round(i / 1000) / 10);
      lastReportTime = performance.now();
    }

    // Roll N dice (1–6 each) and tally the sum — same as random.randint(1, 6) in Python.
    let total = 0;
    for (let j = 0; j < numberOfDice; j += 1) {
      total += Math.floor(Math.random() * 6) + 1;
    }
    results[total] += 1;
  }

  if (onProgress) {
    onProgress(100);
  }

  return results;
}

/** Book prints percentage as round(count / 10000, 1) — equivalent to count / 1_000_000 × 100. */
export function resultsToRows(
  results: DiceResults,
  numberOfDice: number,
): ResultRow[] {
  const rows: ResultRow[] = [];
  for (let total = numberOfDice; total <= numberOfDice * 6; total += 1) {
    const rolls = results[total] ?? 0;
    const percentage = Math.round(rolls / 1000) / 10;
    rows.push({ total, rolls, percentage });
  }
  return rows;
}
