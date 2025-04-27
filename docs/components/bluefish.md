# Bluefish

The Bluefish component allows you to create and display interactive diagrams built with the Bluefish diagramming framework directly in your slides. It provides two ways to define diagrams: inline via an `app` prop or from an external JavaScript file via a `src` prop.

## Basic Usage

### Inline Diagram Definition

For simple diagrams, you can define them directly in your slide:

```md
<Bluefish
  :app="(bf) => bf.Text('Hello World')"
/>
```

### External JavaScript File

For more complex diagrams, create a separate JavaScript file and reference it:

```md
<Bluefish
  src="/diagrams/my-diagram.js"
/>
```

Where `my-diagram.js` contains:

```js
export default function (bf) {
    return bf.Text("Hello World")
}
```

## Properties

| Property | Type                    | Default | Description                                           |
| -------- | ----------------------- | ------- | ----------------------------------------------------- |
| `app`    | `Function`              | `null`  | A function that returns a Bluefish diagram            |
| `src`    | `String`                | `null`  | Path to a JavaScript file with the diagram definition |
| `class`  | `String\|Array\|Object` | `''`    | CSS classes to apply to the component                 |

## Defining Diagrams with Bluefish

Bluefish diagrams are created using three kinds of primitives:

1. **Marks**: Basic visual elements like text, circles, rectangles
2. **Relations**: Visual arrangements like alignment, stacking, arrows
3. **Special**: Utilities for composition and references

### Example: Simple Circle

```md
<Bluefish
  :app="(bf) => bf.Circle({ r: 30, fill: 'lightblue', stroke: 'navy' })"
/>
```

### Example: Text with Background

```md
<Bluefish
  :app="(bf) => bf.Background(
    { rx: 10, fill: 'lightgray' },
    bf.Text('Important Information')
  )"
/>
```

### Example: Complex Diagram from File

For a complex diagram stored in `/public/diagrams/process-flow.js`:

```md
<Bluefish
  src="/diagrams/process-flow.js"
  class="w-full h-64"
/>
```

## Styling and Layout

You can use Tailwind classes to control the size and appearance of your Bluefish diagrams:

```md
<Bluefish
  :app="(bf) => bf.Text('Resizable Diagram')"
  class="w-full md:w-2/3 h-40 border rounded shadow-md mx-auto"
/>
```

## Interactive Diagrams

Bluefish supports creating interactive diagrams. For complex interactive features, it's best to use an external file:

```js
// interactive-diagram.js
export default function (bf) {
    // Create an interactive diagram
    const circle = bf.Circle({r: 20, fill: "red"})
    const text = bf.Text("Click me")

    // Add interactivity
    circle.addEventListener("click", () => {
        circle.setAttribute(
            "fill",
            circle.getAttribute("fill") === "red" ? "blue" : "red",
        )
    })

    return bf.StackV({spacing: 10}, [circle, text])
}
```

Then in your slide:

```md
<Bluefish
  src="/diagrams/interactive-diagram.js"
/>
```

## Best Practices

1. **Use External Files for Complex Diagrams**: For diagrams with more than a few elements, prefer using the `src` prop with an external file.

2. **Share Common Diagram Components**: Create reusable diagram components in separate files to maintain consistency.

3. **Consider Performance**: For complex animated diagrams, be mindful of performance, especially when presenting.

4. **Responsive Design**: Use percentage or viewport units for diagram dimensions to ensure proper scaling across different presentation environments.

5. **Provide Alternative Text**: For accessibility, describe complex diagrams in speaker notes or alt text.

## Path Resolution

When using the `src` prop, paths are resolved as follows:

- Absolute URLs (starting with `http://`, `https://`, or `//`) are used as-is
- Root-relative paths (starting with `/`) are resolved relative to the base URL
- Relative paths are resolved relative to the current document
