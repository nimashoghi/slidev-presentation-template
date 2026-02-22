---
name: slidev
description: Create and present web-based slides for developers using Markdown, Vue components, code highlighting, animations, and interactive features. Use when building technical presentations, conference talks, or teaching materials.
---

# Slidev - Presentation Slides for Developers

Web-based slides maker built on Vite, Vue, and Markdown.

## When to Use

- Technical presentations with live code examples
- Syntax-highlighted code snippets with animations
- Interactive demos (Monaco editor, runnable code)
- Mathematical equations (LaTeX) or diagrams (Mermaid, PlantUML)
- Record presentations with presenter notes
- Export to PDF, PPTX, or host as SPA

## Quick Start

```bash
pnpm create slidev    # Create project
pnpm run dev          # Start dev server
pnpm run export       # Export to PDF
```

## Basic Syntax

```md
---
theme: default
title: My Presentation
---

# First Slide

Content here

---

# Second Slide

More content

<!--
Presenter notes go here
-->
```

- `---` separates slides
- First frontmatter = headmatter (deck config)
- HTML comments = presenter notes

## Core References

| Topic | Description | Reference |
|-------|-------------|-----------|
| Markdown Syntax | Slide separators, frontmatter, notes, code blocks | [core-syntax](references/core-syntax.md) |
| Animations | v-click, v-clicks, motion, transitions | [core-animations](references/core-animations.md) |
| Headmatter | Deck-wide configuration options | [core-headmatter](references/core-headmatter.md) |
| Frontmatter | Per-slide configuration options | [core-frontmatter](references/core-frontmatter.md) |
| CLI Commands | Dev, build, export, theme commands | [core-cli](references/core-cli.md) |
| Components | Built-in Vue components | [core-components](references/core-components.md) |
| Layouts | Built-in slide layouts | [core-layouts](references/core-layouts.md) |
| Exporting | PDF, PPTX, PNG export options | [core-exporting](references/core-exporting.md) |
| Hosting | Build and deploy to various platforms | [core-hosting](references/core-hosting.md) |
| Global Context | $nav, $slidev, composables API | [core-global-context](references/core-global-context.md) |

## Feature Reference

### Code & Editor

| Feature | Usage | Reference |
|---------|-------|-----------|
| Line highlighting | `` ```ts {2,3} `` | [code-line-highlighting](references/code-line-highlighting.md) |
| Click-based highlighting | `` ```ts {1\|2-3\|all} `` | [code-line-highlighting](references/code-line-highlighting.md) |
| Line numbers | `lineNumbers: true` or `{lines:true}` | [code-line-numbers](references/code-line-numbers.md) |
| Scrollable code | `{maxHeight:'100px'}` | [code-max-height](references/code-max-height.md) |
| Code tabs | `::code-group` (requires `mdc: true`) | [code-groups](references/code-groups.md) |
| Monaco editor | `` ```ts {monaco} `` | [editor-monaco](references/editor-monaco.md) |
| Run code | `` ```ts {monaco-run} `` | [editor-monaco-run](references/editor-monaco-run.md) |
| Edit files | `<<< ./file.ts {monaco-write}` | [editor-monaco-write](references/editor-monaco-write.md) |
| Code animations | `` ````md magic-move `` | [code-magic-move](references/code-magic-move.md) |
| TypeScript types | `` ```ts twoslash `` | [code-twoslash](references/code-twoslash.md) |
| Import code | `<<< @/snippets/file.js` | [code-import-snippet](references/code-import-snippet.md) |

### Diagrams & Math

| Feature | Usage | Reference |
|---------|-------|-----------|
| Mermaid diagrams | `` ```mermaid `` | [diagram-mermaid](references/diagram-mermaid.md) |
| PlantUML diagrams | `` ```plantuml `` | [diagram-plantuml](references/diagram-plantuml.md) |
| LaTeX math | `$inline$` or `$$block$$` | [diagram-latex](references/diagram-latex.md) |

### Layout & Styling

| Feature | Usage | Reference |
|---------|-------|-----------|
| Canvas size | `canvasWidth`, `aspectRatio` | [layout-canvas-size](references/layout-canvas-size.md) |
| Zoom slide | `zoom: 0.8` | [layout-zoom](references/layout-zoom.md) |
| Scale elements | `<Transform :scale="0.5">` | [layout-transform](references/layout-transform.md) |
| Layout slots | `::right::`, `::default::` | [layout-slots](references/layout-slots.md) |
| Scoped CSS | `<style>` in slide | [style-scoped](references/style-scoped.md) |
| Global layers | `global-top.vue`, `global-bottom.vue` | [layout-global-layers](references/layout-global-layers.md) |
| Draggable elements | `v-drag`, `<v-drag>` | [layout-draggable](references/layout-draggable.md) |
| Icons | `<mdi-icon-name />` | [style-icons](references/style-icons.md) |

### Animation & Interaction

| Feature | Usage | Reference |
|---------|-------|-----------|
| Click animations | `v-click`, `<v-clicks>` | [core-animations](references/core-animations.md) |
| Rough markers | `v-mark.underline`, `v-mark.circle` | [animation-rough-marker](references/animation-rough-marker.md) |
| Drawing mode | Press `C` or config `drawings:` | [animation-drawing](references/animation-drawing.md) |
| Direction styles | `forward:delay-300` | [style-direction](references/style-direction.md) |
| Note highlighting | `[click]` in notes | [animation-click-marker](references/animation-click-marker.md) |

### Syntax Extensions

| Feature | Usage | Reference |
|---------|-------|-----------|
| MDC syntax | `mdc: true` + `{style="color:red"}` | [syntax-mdc](references/syntax-mdc.md) |
| Block frontmatter | `` ```yaml `` instead of `---` | [syntax-block-frontmatter](references/syntax-block-frontmatter.md) |
| Import slides | `src: ./other.md` | [syntax-importing-slides](references/syntax-importing-slides.md) |
| Merge frontmatter | Main entry wins | [syntax-frontmatter-merging](references/syntax-frontmatter-merging.md) |

### Presenter & Recording

| Feature | Usage | Reference |
|---------|-------|-----------|
| Recording | Press `G` for camera | [presenter-recording](references/presenter-recording.md) |
| Timer | `duration: 30min`, `timer: countdown` | [presenter-timer](references/presenter-timer.md) |
| Remote control | `slidev --remote` | [presenter-remote](references/presenter-remote.md) |
| Ruby text | `notesAutoRuby:` | [presenter-notes-ruby](references/presenter-notes-ruby.md) |

### Export & Build

| Feature | Usage | Reference |
|---------|-------|-----------|
| Export options | `slidev export` | [core-exporting](references/core-exporting.md) |
| Build & deploy | `slidev build` | [core-hosting](references/core-hosting.md) |
| Build with PDF | `download: true` | [build-pdf](references/build-pdf.md) |
| Cache images | Automatic for remote URLs | [build-remote-assets](references/build-remote-assets.md) |
| OG image | `seoMeta.ogImage` or `og-image.png` | [build-og-image](references/build-og-image.md) |
| SEO tags | `seoMeta:` | [build-seo-meta](references/build-seo-meta.md) |

### Editor & Tools

| Feature | Usage | Reference |
|---------|-------|-----------|
| Side editor | Click edit icon | [editor-side](references/editor-side.md) |
| VS Code extension | Install `antfu.slidev` | [editor-vscode](references/editor-vscode.md) |
| Prettier | `prettier-plugin-slidev` | [editor-prettier](references/editor-prettier.md) |
| Eject theme | `slidev theme eject` | [tool-eject-theme](references/tool-eject-theme.md) |

### Lifecycle & API

| Feature | Usage | Reference |
|---------|-------|-----------|
| Slide hooks | `onSlideEnter()`, `onSlideLeave()` | [api-slide-hooks](references/api-slide-hooks.md) |
| Navigation API | `$nav`, `useNav()` | [core-global-context](references/core-global-context.md) |

## Common Layouts

| Layout | Purpose |
|--------|---------|
| `cover` | Title/cover slide |
| `center` | Centered content |
| `default` | Standard slide |
| `two-cols` | Two columns (use `::right::`) |
| `two-cols-header` | Header + two columns |
| `image` / `image-left` / `image-right` | Image layouts |
| `iframe` / `iframe-left` / `iframe-right` | Embed URLs |
| `quote` | Quotation |
| `section` | Section divider |
| `fact` / `statement` | Data/statement display |
| `intro` / `end` | Intro/end slides |

## Resources

- Documentation: https://sli.dev
- Theme Gallery: https://sli.dev/resources/theme-gallery
- Showcases: https://sli.dev/resources/showcases

## Template Components

Custom components provided by this presentation template (in `components/` and `react-components/`). Detailed docs with advanced examples are in `docs/components/`.

### React Components

React components are supported via `slidev-addon-react` (already configured in headmatter).

**To add a React component:**

1. Create `.jsx`/`.tsx` in `react-components/`
2. Register in `react-components/index.ts`: `export default { MyComponent }`
3. Use in slides: `<React is="MyComponent" :someProp="value" />`

Props: primitives passed directly (`title="Hello"`), objects/arrays use Vue binding (`:config="{ theme: 'dark' }"`).

### Figure

Image or video with caption, credits, and optional progress bar. See [docs/components/figure.md](docs/components/figure.md) for advanced usage.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | String | (required) | Image/video source URL |
| `caption` | String | `''` | Caption text below media |
| `captionType` | String | `text` | `text` (plain) or `template` (slot-based rich caption) |
| `credits` | String | `''` | Inline credits text appended to caption |
| `creditsCiteKey` | String | `''` | BibTeX cite key for inline citation credit |
| `type` | String | `image` | `image` or `video` |
| `autostart` | Boolean | `false` | Auto-play video (with `pauseStart` delay) |
| `repeat` | Boolean | `false` | Loop video (pauses on first/last frames) |
| `progress` | Boolean | `false` | Show video progress bar |
| `pauseStart` | Number | `1500` | Ms to pause on first frame before playing |
| `pauseEnd` | Number | `2000` | Ms to pause on last frame before looping |
| `color` | String | `light` | Caption color scheme |
| `class` | String | `''` | Tailwind classes |

```md
<Figure src="/images/result.png" caption="Figure 1: Results" class="w-4/5" color="emerald-light" />

<Figure src="/images/diagram.png" caption="Architecture" creditsCiteKey="smith2023" class="w-2/3" />

<Figure type="video" src="/videos/demo.mp4" caption="Video 1" class="w-2/3" progress autostart repeat />

<Figure src="/images/chart.png" captionType="template">
  <template #caption>
    <p>Results from <strong>Experiment 1</strong>. See <Cite citeKey="jones2024" /> for details.</p>
  </template>
</Figure>
```

### PlotlyFigure

Interactive Plotly chart from JSON (`{ "data": [...], "layout": {...} }`). See [docs/components/plotlyfigure.md](docs/components/plotlyfigure.md) for advanced usage.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | String | (required) | URL to Plotly JSON file |
| `caption` | String | `''` | Caption text |
| `height` | String | `null` | Plot height |
| `fontSize` | Number | `12` | Font size for labels |
| `color` | String | `light` | Caption color scheme |
| `class` | String | `''` | Tailwind classes |

```md
<PlotlyFigure src="/figure.json" caption="Interactive chart" class="w-2/3" height="400px" />
```

### Cite / BiblioList

In-text citations with hover tooltips and formatted bibliography. See [docs/components/cite.md](docs/components/cite.md) and [docs/components/bibliolist.md](docs/components/bibliolist.md) for advanced usage.

Requires `biblio` config in headmatter:

```yaml
biblio:
  numericalRefs: false    # true for [1], false for [Author, Year]
  defaultBibFile: "/reference.bib"
```

```md
Recent studies <Cite citeKey="smith2023" /> show improvement.
<Cite citeKey="smith2023">Smith et al. (2023)</Cite> found...

# References
<BiblioList />
```

`BiblioList` props: `showAll` (Boolean), `itemsPerPage` (Number), `title` (String).

### ExportLinks

Auto-detected PDF/PPTX download overlay. See [docs/components/exportlinks.md](docs/components/exportlinks.md) for CI integration details. No props: `<ExportLinks />`
