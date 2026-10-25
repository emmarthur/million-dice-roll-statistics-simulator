export const TOTAL_ROLLS = 1_000_000;

export type DiceResults = Record<number, number>;

export type ResultRow = {
  total: number;
  rolls: number;
  percentage: number;
};

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
