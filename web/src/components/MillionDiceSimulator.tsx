"use client";

import { useCallback, useMemo, useState } from "react";
import type { ResultRow } from "@/lib/simulateDiceRolls";
import type { WorkerResponse } from "@/workers/simulateDiceRolls.worker";
import { DemoHelpSection } from "@/components/DemoHelpSection";

const MIN_DICE = 1;
const MAX_DICE = 50;

export function MillionDiceSimulator() {
  const [numberOfDice, setNumberOfDice] = useState(2);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [rows, setRows] = useState<ResultRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Scale bar chart widths relative to the most common sum.
  const maxPercentage = useMemo(() => {
    if (!rows?.length) return 0;
    return Math.max(...rows.map((r) => r.percentage));
  }, [rows]);

  const runSimulation = useCallback(() => {
    setError(null);
    setRows(null);
    setProgress(0);
    setRunning(true);

    // Heavy loop runs in a worker so the UI stays responsive.
    const worker = new Worker(
      new URL("../workers/simulateDiceRolls.worker.ts", import.meta.url),
    );

    worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const message = event.data;
      if (message.type === "progress") {
        setProgress(message.percent);
      } else {
        setRows(message.rows);
        setProgress(100);
        setRunning(false);
        worker.terminate();
      }
    };

    worker.onerror = () => {
      setError("Simulation failed. Try again with fewer dice.");
      setRunning(false);
      worker.terminate();
    };

    worker.postMessage({ numberOfDice });
  }, [numberOfDice]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Million Dice Roll Statistics Simulator
        </h1>
      </header>

      <label className="block text-sm font-medium text-slate-700">
        How many six-sided dice per roll?
        <input
          type="number"
          min={MIN_DICE}
          max={MAX_DICE}
          value={numberOfDice}
          disabled={running}
          onChange={(e) => {
            const next = Number.parseInt(e.target.value, 10);
            if (!Number.isNaN(next)) {
              setNumberOfDice(Math.min(MAX_DICE, Math.max(MIN_DICE, next)));
            }
          }}
          className="mt-1 block w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100"
        />
      </label>

      <button
        type="button"
        onClick={runSimulation}
        disabled={running}
        className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {running ? "Simulating…" : "Simulate 1,000,000 rolls"}
      </button>

      {progress !== null && (
        <div className="mt-6">
          <div className="mb-1 flex justify-between text-xs text-slate-600">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-indigo-500 transition-all duration-150"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {rows && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-900">
            Results (1,000,000 rolls of {numberOfDice} dice)
          </h2>

          <div className="mt-4 space-y-2">
            {rows.map((row) => (
              <div key={row.total} className="flex items-center gap-3 text-sm">
                <span className="w-8 shrink-0 font-mono text-slate-700">
                  {row.total}
                </span>
                <div className="h-5 flex-1 rounded bg-slate-100">
                  <div
                    className="h-full rounded bg-indigo-400/80"
                    style={{
                      width: `${
                        maxPercentage > 0
                          ? (row.percentage / maxPercentage) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="w-28 shrink-0 text-right tabular-nums text-slate-600">
                  {row.rolls.toLocaleString()} ({row.percentage}%)
                </span>
              </div>
            ))}
          </div>

          <table className="mt-8 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-600">
                <th className="py-2 pr-4">Total</th>
                <th className="py-2 pr-4">Rolls</th>
                <th className="py-2">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.total} className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-mono">{row.total}</td>
                  <td className="py-2 pr-4 tabular-nums">
                    {row.rolls.toLocaleString()}
                  </td>
                  <td className="py-2 tabular-nums">{row.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <DemoHelpSection />
    </div>
  );
}
