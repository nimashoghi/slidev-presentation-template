# BiblioList

The BiblioList component displays a bibliography or reference list for academic presentations, showing either all citations or only those used in your slides.

## Basic Usage

Add a bibliography list to a slide:

```md
<BiblioList title="References" />
```

By default, this will show all citations used in your presentation.

## Properties

| Property       | Type      | Default | Description                                                                        |
| -------------- | --------- | ------- | ---------------------------------------------------------------------------------- |
| `showAll`      | `Boolean` | `false` | When true, shows all citations in bibliography file, not just those used in slides |
| `itemsPerPage` | `Number`  | `0`     | Number of references to show per page (enables pagination; 0 shows all)            |
| `title`        | `String`  | `null`  | Optional title for the bibliography section                                        |

## Creating a References Slide

A common approach is to create a dedicated slide for references at the end of your presentation:

```md
---
layout: default
---

<BiblioList
  title="References"
  itemsPerPage="5"
/>
```

When `itemsPerPage` is set, the component automatically adds pagination with click navigation.

## Showing All References

To display all citations from your bibliography file, including those not cited in your presentation:

```md
<BiblioList
  title="Complete Bibliography"
  showAll
/>
```

## Interactive Features

The BiblioList component offers several interactive features:

1. **Page Links**: References include links to the slides where they are cited
2. **Pagination**: When using `itemsPerPage`, advancing to the next slide click will show the next page of references
3. **Visual Indicators**: Each reference is styled with a subtle left border and hover effect

## Usage with Frontmatter Configuration

You can configure global bibliography settings in your presentation's frontmatter:

```yaml
---
theme: neversink
biblio:
    numericalRefs: true
    itemsPerPage: 6
---
```

These settings will be applied to all BiblioList components unless overridden with component props.

## Styling with Tailwind

While the BiblioList component has built-in styling, you can customize its appearance with Tailwind classes:

```md
<div class="max-w-3xl mx-auto">
  <BiblioList
    title="References"
    class="text-sm"
  />
</div>
```

## Combining with Other Components

The BiblioList component works well with other Neversink components:

```md
<div class="grid grid-cols-2 gap-8">
  <div>
    <BiblioList title="Primary Sources" />
  </div>
  <div>
    <BiblioList title="Secondary Sources" />
  </div>
</div>
```

This creates a two-column layout with separate bibliography lists.
