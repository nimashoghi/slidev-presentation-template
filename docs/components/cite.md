# Cite

The Cite component provides a way to add academic citations to your slides, complete with hover tooltips showing the full reference details.

## Basic Usage

Add an in-text citation:

```md
This study demonstrated significant results <Cite citeKey="smith2023" />.
```

This will display a citation reference that, when hovered over, shows the complete citation information.

## Properties

| Property  | Type     | Default  | Description                                                |
| --------- | -------- | -------- | ---------------------------------------------------------- |
| `citeKey` | `String` | Required | The citation key that matches your bibliography file       |
| `bib`     | `String` | `null`   | Path to an alternative bibliography file for this citation |

## Citation Styles

The citation style depends on your global bibliography configuration:

### Numerical References

When `numericalRefs` is enabled in your frontmatter:

```
This finding was confirmed in a recent study [1].

---
biblio:
  numericalRefs: true
---
```

### Author-Date References

The default style follows author-date format:

```
This finding was confirmed in a recent study <Cite citeKey="smith2023" />.
```

Which displays as: "This finding was confirmed in a recent study [Smith et al., 2023]."

## Custom Citation Text

You can use custom text within the Cite component:

```md
This was first proposed by <Cite citeKey="einstein1905">Einstein</Cite> in his groundbreaking paper.
```

This allows you to incorporate the citation naturally in your text.

## Tooltip Information

When users hover over a citation, they'll see:

- Full author information
- Publication year
- Title
- Journal or publication venue
- Additional details depending on the citation type

## Connecting with BiblioList

Citations created with the Cite component are automatically tracked and will appear in your BiblioList:

```md
<p>Recent studies <Cite citeKey="smith2023" /> have shown promising results.</p>

<!-- Later in your presentation -->
<BiblioList title="References" />
```

The BiblioList will include page references that link back to the slides where citations appear.

## Using Alternative Bibliography Files

For specialized citations not in your main bibliography:

```md
<Cite citeKey="rare2020" bib="specialized-bibliography.bib" />
```

This allows you to maintain multiple bibliography files for different citation needs.

## Styling Citations

The Cite component uses the presentation's color scheme by default, but you can apply additional styling using a wrapper:

```md
<span class="text-blue-500 font-bold">
  <Cite citeKey="important2023" />
</span>
```

## Error Handling

If a citation key isn't found in your bibliography, the component will display an error indicator:

- Missing citations appear with a distinctive red underline
- Hover tooltip shows "Citation not found" message
- The citation still appears in BiblioList with an error state

This helps identify citation issues while developing your presentation.
