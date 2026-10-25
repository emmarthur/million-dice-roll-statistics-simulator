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

  const maxPercentage = useMemo(() => {
    if (!rows?.length) return 0;
    return Math.max(...rows.map((r) => r.percentage));
  }, [rows]);

  const runSimulation = useCallback(() => {
    setError(null);
    setRows(null);
    setProgress(0);
    setRunning(true);

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
    <div className="demo-shell">
      <div className="demo-blob demo-blob-a" aria-hidden="true" />
      <div className="demo-blob demo-blob-b" aria-hidden="true" />

      <header className="demo-hero">
        <div className="demo-hero-icon" aria-hidden="true">
          🎲
        </div>
        <h1 className="demo-title">Million Dice Roll Statistics</h1>
        <p className="demo-tagline">
          One million rolls — see how often each sum appears
        </p>
      </header>

      <section className="demo-card">
        <label className="block text-sm font-semibold text-slate-200">
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
            className="demo-input"
          />
        </label>

        <button
          type="button"
          onClick={runSimulation}
          disabled={running}
          className="demo-btn-primary"
        >
          {running ? "Simulating…" : "Simulate 1,000,000 rolls"}
        </button>

        {progress !== null && (
          <div className="mt-6">
            <div className="mb-1 flex justify-between text-xs text-slate-400">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="demo-progress-track">
              <div
                className="demo-progress-fill"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </section>

      {rows && (
        <section className="demo-card">
          <h2 className="demo-results-title">
            Results — 1,000,000 rolls of {numberOfDice} dice
          </h2>

          <div className="mt-4 space-y-2">
            {rows.map((row) => (
              <div key={row.total} className="flex items-center gap-3 text-sm">
                <span className="w-8 shrink-0 font-mono font-semibold text-amber-200">
                  {row.total}
                </span>
                <div className="demo-bar-track">
                  <div
                    className="demo-bar-fill"
                    style={{
                      width: `${
                        maxPercentage > 0
                          ? (row.percentage / maxPercentage) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="w-28 shrink-0 text-right tabular-nums text-slate-400">
                  {row.rolls.toLocaleString()} ({row.percentage}%)
                </span>
              </div>
            ))}
          </div>

          <table className="demo-table">
            <thead>
              <tr>
                <th className="pr-4">Total</th>
                <th className="pr-4">Rolls</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.total}>
                  <td className="pr-4 font-mono text-amber-100">{row.total}</td>
                  <td className="pr-4 tabular-nums">
                    {row.rolls.toLocaleString()}
                  </td>
                  <td className="tabular-nums">{row.percentage}%</td>
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
