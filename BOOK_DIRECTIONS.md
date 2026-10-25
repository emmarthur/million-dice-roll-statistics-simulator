# Book directions — Million Dice Roll Statistics Simulator

**Catalog #348** · Al Sweigart, *The Big Book of Small Python Projects*, **Project #46**

- Online chapter: [inventwithpython.com/bigbookpython/project46.html](https://inventwithpython.com/bigbookpython/project46.html)
- Upstream code: [milliondicestats.py](https://github.com/asweigart/the-big-book-of-small-python-projects/blob/main/milliondicestats.py)
- Local reference copy: [`reference/milliondicestats.py`](./reference/milliondicestats.py)

## What the book asks you to build

Empirical probability: roll **N** six-sided dice **1,000,000** times, count how often each possible **sum** appears, and print each sum’s **percentage** of rolls. The book uses a dictionary (`results`) keyed by every possible total from `numberOfDice` through `numberOfDice * 6`.

## Program in action (sample output from the book)

```
Million Dice Roll Statistics Simulator
By Al Sweigart al@inventwithpython.com

Enter how many six-sided dice you want to roll:
> 2
Simulating 1,000,000 rolls of 2 dice...
36.2% done...
73.4% done...
TOTAL - ROLLS - PERCENTAGE
  2 - 27590 rolls - 2.8%
  3 - 55730 rolls - 5.6%
  ...
  7 - 166327 rolls - 16.6%
  ...
  12 - 28023 rolls - 2.8%
```

## Step order (follow the book’s source)

1. **Intro** — Print the title and prompt: *Enter how many six-sided dice you want to roll.*
2. **Input** — Read `numberOfDice` as an integer (`int(input('> '))` in the book).
3. **Initialize `results`** — For each `i` from `numberOfDice` to `(numberOfDice * 6) + 1` (exclusive upper bound in `range`), set `results[i] = 0`.
4. **Announce simulation** — Print `Simulating 1,000,000 rolls of {numberOfDice} dice...`
5. **Main loop** — `for i in range(1000000):`
   - Track `lastPrintTime`; if more than **1 second** passed, print `round(i / 10000, 1)` followed by `% done...` and refresh `lastPrintTime`.
   - Set `total = 0`.
   - Inner loop `for j in range(numberOfDice):` add `random.randint(1, 6)` to `total`.
   - Increment `results[total] = results[total] + 1`.
6. **Print table header** — `TOTAL - ROLLS - PERCENTAGE`
7. **Print each row** — For each sum `i` in range, `percentage = round(results[i] / 10000, 1)` (same as `count / 1_000_000 * 100`), format `i`, roll count, and percentage.

## How it works (book explanation)

- Each die: `random.randint(1, 6)` (uniform 1–6).
- Percentage: divide encounter count by **10,000** (algebraically equivalent to ÷ 1,000,000 × 100).

## Optional experiments (book “Exploring the Program”)

- Change progress interval (`lastPrintTime + 1` → `+ 2`).
- Comment out `results[total] += 1` to see incorrect stats.
- Invalid non-numeric input causes `int()` to fail (book does not handle this).

## Web version (`web/`)

| Book step | Web equivalent |
|-----------|----------------|
| `print` / `input` | Form: dice count + **Simulate 1,000,000 rolls** |
| Progress prints ~1/sec | Progress bar driven by same `round(i / 10000, 1)` rule |
| Result table | Table + bar chart (same counts and percentages) |
| 1M-roll loop | Same logic in `simulateDiceRolls.ts`; runs in a **Web Worker** so the UI stays responsive |

Logic port: [`web/src/lib/simulateDiceRolls.ts`](./web/src/lib/simulateDiceRolls.ts) (mirrors [`reference/milliondicestats.py`](./reference/milliondicestats.py)).
