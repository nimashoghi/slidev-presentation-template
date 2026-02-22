---
name: neversink-theme
description: Build academic presentations with the Neversink Slidev theme. Use when creating slides with Neversink layouts, color schemes, components (Admonition, StickyNote, SpeechBubble), or configuring alignment/columns/margins.
---

# Neversink Theme Reference

Academic-oriented Slidev theme by Todd Gureckis. Provides layouts, color schemes, and components for research presentations.

## Layouts

### cover

Title/opening slide. Headings get bottom border in highlight color.

Props: `color` (default: `white`). Slots: `default`, `::note::` (absolute bottom).

```md
---
layout: cover
color: navy
---

# Title

Subtitle

::note::
Conference, Date
```

### intro

Like cover but no heading border. Props: `color` (`white`). Slots: `default`, `::note::`.

### default

Standard content slide. Props: `color` (`white`), `margin` (`normal`). Slots: `default`.

### section

Section divider, content vertically centered. Props: `color` (`white`), `margin` (`normal`). Slots: `default`.

### full

Full-width/height content. Props: `color` (`white`), `margin` (`normal`). Slots: `default`.

### quote

Centered quote in rounded box with drop shadow.

| Prop | Default | Description |
|------|---------|-------------|
| `color` | `light` | Box color scheme |
| `author` | `null` | Attribution (prefixed with "- ") |
| `quotesize` | `text-2xl` | UnoCSS text size |
| `authorsize` | `text-l` | Author text size |

Slots: `default` (quote text).

```md
---
layout: quote
color: sky-light
author: Albert Einstein
quotesize: text-3xl
---

Imagination is more important than knowledge.
```

### two-cols

Two columns with optional footer.

| Prop | Default | Description |
|------|---------|-------------|
| `color` | `white` | Color scheme |
| `columns` | `is-one-half` | Column widths |
| `align` | `lt-lt` | Format: `{left}-{right}` |

Slots: `::left::`, `::right::`, `default` (footer, full width).

### two-cols-title

Two columns with title row. Most commonly used multi-column layout.

| Prop | Default | Description |
|------|---------|-------------|
| `color` | `white` | Color scheme |
| `columns` | `is-one-half` | Column widths |
| `align` | `l-lt-lt` | Format: `{title}-{left}-{right}` |
| `titlepos` | `t` | `t` (top), `b` (bottom), `n` (hidden) |
| `margin` | `normal` | Margin mode |

Slots: `::title::`, `::left::`, `::right::`, `default` (footer).

```md
---
layout: two-cols-title
columns: is-two-thirds
align: c-lt-ct
color: white
---

:: title ::
# Comparing Approaches

:: left ::
- Details here

:: right ::
![diagram](/images/diagram.png)
```

### top-title

Colored title bar at top, uncolored body below.

| Prop | Default | Description |
|------|---------|-------------|
| `color` | `light` | Title bar color |
| `align` | `l` | Title alignment (single code: `l`, `c`, `r`) |
| `margin` | `normal` | Margin mode |

Slots: `::title::`, `::content::`, `default`.

```md
---
layout: top-title
color: teal-light
align: l
---

:: title ::
# Section Heading

:: content ::
Body content here.
```

### top-title-two-cols

Colored title bar + two-column body. Props: `color` (`light`), `columns` (`is-one-half`), `align` (`l-lt-lt`, format: `{title}-{left}-{right}`), `margin` (`normal`). Slots: `::title::`, `::left::`, `::right::`, `default`.

### side-title

Colored side panel for title, content in opposite column.

| Prop | Default | Description |
|------|---------|-------------|
| `color` | `light` | Side panel color |
| `side` | `l` | `l`/`left` or `r`/`right` |
| `titlewidth` | `is-one-third` | Panel width |
| `align` | `auto` | Format: `{titlecol}-{contentcol}`. Auto: `rm-lt` (left), `lt-lm` (right) |
| `margin` | `normal` | Margin mode |

Slots: `::title::`, `::content::`.

### four-cell

2×2 grid. Props: `color` (`white`), `rowheight` (`is-one-half`), `colwidth` (`is-one-half`). Slots: `::top-left::`, `::top-right::`, `::bottom-left::`, `::bottom-right::`.

### credits

Star Wars-style scrolling animation. Props: `color` (`light`), `speed` (`0.5`), `loop` (`false`). Slots: `default`.

## Color System

Every layout accepts a `color` prop. **48 schemes** total:

**Base:** `white`, `black`, `dark`, `light`, `navy`, `navy-light`

**Tailwind pairs** (saturated + light): `slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` — each has a `-light` variant (e.g., `teal-light`).

Dark mode is fully supported via Slidev's toggle.

## Alignment System

Two-character codes: `{horizontal}{vertical}`

| Code | Position |
|------|----------|
| `lt` | left-top |
| `lm` | left-middle |
| `lb` | left-bottom |
| `ct` | center-top |
| `cm` | center-middle |
| `cb` | center-bottom |
| `rt` | right-top |
| `rm` | right-middle |
| `rb` | right-bottom |

Single-character codes (`l`, `c`, `r`) default to top vertical alignment.

**Format varies by layout:**
- `two-cols`: `{left}-{right}` → `align: lt-lt`
- `two-cols-title` / `top-title-two-cols`: `{title}-{left}-{right}` → `align: c-lt-lt`
- `top-title`: single code → `align: l`
- `side-title`: `{titlecol}-{contentcol}` → `align: rm-lt`

## Column System

12-unit grid. The `columns` prop sets the left column width (right = 12 - left).

| Value | Left | Right |
|-------|------|-------|
| `is-3` / `is-one-quarter` | 3 | 9 |
| `is-4` / `is-one-third` | 4 | 8 |
| `is-5` | 5 | 7 |
| `is-6` / `is-one-half` | 6 | 6 |
| `is-7` | 7 | 5 |
| `is-8` / `is-two-thirds` | 8 | 4 |
| `is-9` / `is-three-quarters` | 9 | 3 |

Explicit forms: `is-4-8`, `is-7-5`, etc.

## Margin System

`margin` prop on layouts that support it: `normal` (default), `tight`, `tighter`, `none`.

## Components

### Admonition

Callout box with icon, title, and colored background.

| Prop | Default | Description |
|------|---------|-------------|
| `color` | `amber-light` | Color scheme |
| `title` | `''` | Title text next to icon |
| `icon` | `mdi-information-variant-circle-outline` | Iconify icon name |
| `width` | `100%` | CSS width |

```md
<Admonition title="Note" color="sky-light" icon="mdi-lightbulb-outline">
Important information here.
</Admonition>
```

### AdmonitionType

Convenience wrapper with preset types: `info` (sky-light), `tip` (emerald-light), `warning` (amber-light), `important` (purple-light), `caution` (red-light).

```md
<AdmonitionType type="warning">
Be careful with this operation!
</AdmonitionType>
```

### StickyNote

Square note element with drop shadow. Width sets both width AND height.

| Prop | Default | Description |
|------|---------|-------------|
| `color` | `amber-light` | Color scheme |
| `width` | `180px` | Width and height (square) |
| `title` | `''` | Title text at top |
| `textAlign` | `left` | Text alignment |
| `devOnly` | `false` | Only visible in dev mode |

```md
<StickyNote color="rose-light" width="200px" title="TODO">
Remember to update figures
</StickyNote>
```

### SpeechBubble

Speech/thought bubble with directional arrow.

| Prop | Default | Description |
|------|---------|-------------|
| `position` | `b` | Arrow: `t`, `l`, `r`, `b`, `bl`, `br`, `lt`, `tr` |
| `shape` | `''` | `''` (default), `round`, `circle` |
| `animation` | `''` | `''` (none), `pop`, `float` |
| `color` | `red-light` | Color scheme |
| `maxWidth` | `100%` | Maximum width |

```md
<SpeechBubble position="bl" color="sky-light" shape="round" animation="pop">
This is important!
</SpeechBubble>
```

### Other Components

| Component | Key Props | Description |
|-----------|-----------|-------------|
| `Box` | `shape`, `color`, `size` (150px) | Decorative box/shape |
| `Email` | `v` (email address) | Email with icon link |
| `ArrowDraw` | `color`, `width` (140px) | Hand-drawn SVG arrow |
| `Thumb` | `color`, `dir` (up/down), `width` (70px) | Thumbs up/down SVG |
| `Line` | `x1`, `y1`, `x2`, `y2`, `width`, `color` | Absolute-positioned SVG line |

### Positioning

Any component can use `v-drag` for drag-and-drop placement (requires fixed `width`):

```md
<StickyNote v-drag color="amber-light" width="200px">
Drag me anywhere!
</StickyNote>
```

## Utility Classes

| Class | Effect |
|-------|--------|
| `ns-c-tight` | Compact list spacing |
| `ns-c-verytight` | Tighter list spacing |
| `ns-c-supertight` | Minimal list spacing |
| `ns-c-fader` | Past v-click items fade to 30% opacity |
| `ns-c-cite` | Small italic citation text |
| `ns-c-center-item` | Center an element horizontally |

## Markdown Extensions

- `==highlighted text==` → `<mark>` element (via markdown-it-mark)
- `H~2~O` → subscript (via @mdit/plugin-sub)

## Icons

Bundled icon sets: `mdi-*` (Material Design), `logos-*` (tech logos), `twemoji-*` (emoji), `uim-*` (Unicons).

Usage: `<mdi-account />`, `<logos-vue />`, `<twemoji-star />`
