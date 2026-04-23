# CLAUDE.md

Context for Claude Code when working in this repo. Read this before generating anything.

## What this repo is

A personal notebook for Claude-powered tools I want to build. The app (`index.html`) is a mobile-first interface where I capture ideas, develop them into specs, and export clean briefs. I paste those briefs into Claude Code to actually build the tools.

This app is itself the first tool in the repo. Meta by design.

## Who I am (context for building)

I'm a senior consultant in Toronto planning an exit into strategy and operations at a growth-stage or regulated-industry company. I build agentic workflows on my own time as a portfolio and differentiator. The tools captured in this repo typically fall into three priority buckets:

1. Things that directly support my job search (thesis testing, company diligence, outreach research).
2. Personal productivity tools.
3. Things that accelerate my consulting work (rarely, and never touching client data).

This repo is public-safe. Nothing here references my employer, clients, or job search explicitly.

## Writing rules (strictly enforced)

Every piece of text you generate (code comments, UI copy, docs, commit messages, markdown briefs) must follow these.

- No em dashes. Use colons, periods, or parentheses.
- No "at the intersection of."
- No forced rule of three.
- No "I've had the opportunity to."
- No "customer-centric."
- No "optimize" or "optimizing."
- First person only. No third person.
- Plain language over consulting abstractions. Specific beats abstract.
- No exclamation marks on throwaway lines.

If you catch yourself writing any of the above, rewrite before showing me.

## What I care about

- Shipping working code fast over architectural purity.
- Mobile-first. I use my phone constantly.
- Files I can actually read and edit without a 500-file node_modules.
- Distinctive design. No generic Tailwind-template aesthetic.
- Extensibility. v1 is deliberately simple so v2 can grow.

## What I don't want

- Generic framework scaffolding I didn't ask for.
- Dependencies I don't need.
- Documentation that restates what the code obviously does.
- "Helpful" reframing of my requests. If I said no backend, I mean no backend.

## Tech stack (v1)

- Single `index.html` with vanilla JavaScript.
- Tailwind is deliberately NOT used. Styling is custom CSS for editorial precision.
- Fonts: Fraunces (display, serif) and Geist + Geist Mono (body + meta), via Google Fonts.
- `localStorage` for persistence.
- No build step. Open the HTML file and it works.
- Deployable to GitHub Pages with zero config.

Design tokens live in `:root` CSS variables. Palette is warm paper, ink, muted grays, and a single burnt-orange accent. Keep this palette unless I ask otherwise.

## Upgrade paths (documented, NOT built)

Do not implement any of the following without me explicitly asking.

- Markdown file sync. Ideas live as `.md` files in `/ideas`, app reads and writes via File System Access API or GitHub API.
- Vite + React + TypeScript migration when state complexity justifies it.
- Claude API integration for in-app spec development (conversational refinement inside the editor).
- Search and tag system when I have 50+ ideas.
- Multi-device sync via GitHub or a cheap backend.
- Collaborative features (never, this is personal).

## File structure

```
/
├── CLAUDE.md           # This file. Read first.
├── README.md           # For GitHub viewers.
├── index.html          # The app.
├── .gitignore
└── ideas/              # Reserved for markdown specs (future).
    └── .gitkeep
```

## How to extend (rules for Claude Code)

When I ask you to add a feature:

1. Keep v1 intact unless I explicitly ask to refactor. Additive changes first.
2. Minimize new dependencies. Prefer zero.
3. Preserve mobile-first sizing. Tap targets at least 44px, font sizes of 16px+ on inputs to prevent iOS zoom.
4. Match the existing code style: vanilla JS, small functions, no classes, inline handlers fine for this scale.
5. Match the existing design vocabulary: serif for content titles, mono for metadata and labels, hairline rules instead of boxes, warm palette, restrained motion.
6. Ask before any structural decision I haven't specified (framework changes, data model changes, new persistence layer).

## Testing approach

No test framework for v1. Manual testing on mobile Safari is the bar. If a change is non-trivial, list the user flows to verify and I'll test on my phone.

## Deploy

GitHub Pages. Push to `main`, enable Pages on root folder, done. No CI, no build.
