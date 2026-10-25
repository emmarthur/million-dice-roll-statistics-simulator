# Portfolio link (when ready)

Add a **planned** or **live** card in `my-website/src/lib/projects.ts`:

```ts
{
  id: 'million-dice-roll-statistics-simulator',
  title: 'Million Dice Roll Statistics Simulator',
  description: '...',
  technologies: ['TypeScript', 'React', 'Next.js', 'Web Workers'],
  status: 'planned', // or 'completed'
  category: 'web',
  demoUrl: process.env.NEXT_PUBLIC_MILLION_DICE_DEMO_URL ?? 'http://localhost:3002',
  github: 'https://github.com/emmarthur/million-dice-roll-statistics-simulator',
}
```

Deploy this repo separately; the portfolio only links out.
