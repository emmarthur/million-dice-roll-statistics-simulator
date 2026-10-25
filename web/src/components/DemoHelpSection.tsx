export function DemoHelpSection() {
  return (
    <section
      className="mt-10 border-t border-slate-200 pt-8 text-sm leading-relaxed text-slate-700"
      aria-labelledby="help-heading"
    >
      <h2 id="help-heading" className="text-lg font-semibold text-slate-900">
        Help
      </h2>
      <h3 className="mt-4 font-medium text-slate-800">About this app</h3>
      <p className="mt-2">
        This simulator rolls six-sided dice millions of times and shows how often
        each possible <strong>sum</strong> appears. That illustrates{" "}
        <strong>empirical probability</strong>: the more rolls you run, the closer
        the percentages get to the true odds.
      </p>
      <h3 className="mt-4 font-medium text-slate-800">How to use it</h3>
      <ol className="mt-2 list-decimal space-y-2 pl-5">
        <li>Enter how many dice to roll together on each throw (1–50).</li>
        <li>
          Click <strong>Simulate 1,000,000 rolls</strong>. A progress bar updates
          while the run completes.
        </li>
        <li>
          When finished, read the bar chart and table: each row is a possible
          total, how many times it occurred, and its percentage of all rolls.
        </li>
        <li>
          Try 1 die vs 2 dice vs 5 dice and compare which sums are most common.
        </li>
      </ol>
    </section>
  );
}
