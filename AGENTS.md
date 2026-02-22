# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Slidev presentation template for academic talks, using the **Neversink theme**. The main presentation lives in `slides.md` as Markdown with YAML frontmatter.

## Commands

```bash
pnpm install              # Install dependencies
pnpm run dev              # Start dev server (opens browser)
pnpm run build            # Build for production (outputs to dist/)
pnpm run export           # Export to PDF
pnpm run auto-export      # Run auto-export script (configurable via slidev-autoexport.config.js)
```

## Architecture

- `slides.md` — Main presentation file. Slides separated by `---`, first block is headmatter (deck config), per-slide config via frontmatter.
- `components/` — Custom Vue components extending Neversink: `Figure`, `PlotlyFigure`, `Cite`, `BiblioList`, `ExportLinks`, `CiteEngine.js`.
- `react-components/` — React components (`.jsx`/`.tsx`) usable in slides via `<React is="ComponentName" />`. Register new components by exporting them from `react-components/index.ts`.
- `public/` — Static assets (images, `.bib` files, Plotly JSON data). Referenced with `/` prefix in slides.
- `snippets/` — Code snippets importable via `<<< @/snippets/file.js`.
- `pages/` — Additional slide files importable via `src:` frontmatter.
- `layouts/` — Custom layout overrides (currently empty; Neversink provides all layouts).
- `scripts/auto-export.js` — CI export automation.
- `slidev-autoexport.config.js` — Export format configuration (PDF/PPTX toggles, output dir).

## Skills — Read Before Editing Slides

Before creating or modifying slides, **load the relevant skills**. For the Slidev skill, the SKILL.md is a summary — the `references/` subdirectory contains detailed docs per feature that you should read for the features you're about to use.

| Skill | Path | What to read |
|-------|------|--------------|
| **Slidev** (core syntax, animations, code blocks, exporting, template components) | `.claude/skills/slidev/` | `SKILL.md` + relevant files under `references/` |
| **Neversink theme** (layouts, colors, alignment, theme components) | `.claude/skills/neversink-theme/` | `SKILL.md` (self-contained) |

## Key Conventions

- Package manager: **pnpm** (with `shamefully-hoist=true`)
- Theme: `neversink` — provides academic-oriented layouts, color schemes, and components
- Deployed to Netlify (see `netlify.toml`) and Vercel (`vercel.json`)
- HTML in Markdown must be flush-left (no indentation) or it breaks rendering
- Prefer Markdown over HTML; use Tailwind classes when HTML is needed
- Speaker notes go in `<!-- -->` comments

## Generating Visuals and Computation

Use `mcp__notebook` (the notebook tool) for any computation, data processing, or visual generation needed for slides. This includes:

- Generating charts/plots (matplotlib, plotly) and saving them to `public/` for use in slides
- Processing data for tables or statistics shown in slides
- Prototyping LaTeX equations before embedding
- Converting or resizing images

Work iteratively: one small cell at a time, observe output, then proceed. Do not try to generate complex visuals in a single step.
