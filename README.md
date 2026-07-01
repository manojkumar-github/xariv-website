# XARIV Website

Enterprise marketing site for [XARIV](https://xariv.com) — AI Infrastructure Intelligence.

Built with **Next.js**, **React**, **TypeScript**, and **Tailwind CSS**. Designed for Vercel deployment.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run start
```

## Project structure

```
src/
  app/                    # Next.js App Router pages
  components/
    layout/               # Header, Footer, Container
    ui/                   # Button, Card, Section, ArticleCard
    content/              # MarkdownContent
  data/                   # Products, studies, blog metadata
  lib/                    # Site config, markdown loader
content/
  architecture-studies/   # Long-form articles (.md)
  blog/                   # Blog posts (.md)
```

## Adding content

**Architecture study:** add metadata to `src/data/architecture-studies.ts`, then create `content/architecture-studies/[slug].md`.

**Blog post:** add metadata to `src/data/blog.ts`, then create `content/blog/[slug].md`.

## Content migration

Architecture studies are migrated from `manojkumar-github.github.io/_posts/`:

```bash
npm run migrate:posts   # copies markdown + fixes image paths
```

Diagrams live in `public/images/`.

## Lens & Pulse (interactive tools)

Native Next.js routes with in-browser computation engines in `src/tools/`:

- **Lens** — `/lens` — GPU infrastructure prediction
- **Pulse** — `/pulse` — inference latency profiling

No external backend or static bundle required.

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Framework preset: Next.js. Root directory: `xariv-website` (if monorepo).

## Design

- Warm off-white canvas (`#F7F5F2`)
- Newsreader (display) + Inter (body)
- Minimal, engineering-first tone
- No gradients, glassmorphism, or heavy animation
