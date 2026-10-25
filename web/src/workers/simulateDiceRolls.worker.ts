import {
  resultsToRows,
  simulateRolls,
  type ResultRow,
} from "@/lib/simulateDiceRolls";

export type WorkerRequest = {
  numberOfDice: number;
};

export type WorkerResponse =
  | { type: "progress"; percent: number }
  | { type: "done"; rows: ResultRow[] };

// Runs the 1M-roll loop off the main thread so the UI stays responsive.
self.onmessage = (event: MessageEvent<WorkerRequest>) => {
  const { numberOfDice } = event.data;
  const results = simulateRolls(numberOfDice, (percent) => {
    self.postMessage({ type: "progress", percent } satisfies WorkerResponse);
  });
  const rows = resultsToRows(results, numberOfDice);
  self.postMessage({ type: "done", rows } satisfies WorkerResponse);
};
