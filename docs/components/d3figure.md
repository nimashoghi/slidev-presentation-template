# D3Figure

The D3Figure component provides a flexible way to create custom D3.js visualizations while maintaining the consistent styling of other figures in the Neversink theme.

## Basic Usage

There are two main ways to use the D3Figure component:

### 1. Using a JavaScript Module

You can create a separate JavaScript file with your D3 visualization code and reference it in the `src` property:

```md
<D3Figure
  src="/visualizations/bar-chart.js"
  caption="A simple bar chart using D3.js"
  height="400px"
  class="w-full md:w-2/3"
/>
```

The JavaScript file should export a default function that accepts a context object and returns the visualization instance:

```js
export default function createVisualization(context) {
    const {d3, container, width, height, margin, fontFamily, data} = context

    // Your D3 code here...

    return {
        // Optional resize handler
        resize() {
            // Code to handle resizing
        },
        // Optional update handler
        update(newData) {
            // Code to update the visualization with new data
        },
    }
}
```

### 2. Using the Visualization Slot

For inline D3 code, you can use the `visualization` slot which provides access to the D3 context:

```md
<D3Figure
:data="[{name: 'A', value: 10}, {name: 'B', value: 20}]"
caption="Inline D3 visualization"
height="300px"

> <template #visualization="{ d3, container, width, height, margin, data }">

    <script>
    (() => {
      // Your D3 code here using the provided context
      const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

      // Rest of your D3 visualization code...
    })();
    </script>

  </template>
</D3Figure>
```

## Properties

| Property  | Type            | Default                                        | Description                                      |
| --------- | --------------- | ---------------------------------------------- | ------------------------------------------------ |
| `src`     | `String`        | `null`                                         | URL to a JavaScript module with D3 code          |
| `data`    | `Array, Object` | `[]`                                           | Data to be visualized                            |
| `caption` | `String`        | `''`                                           | Caption text to display below the figure         |
| `width`   | `String`        | `null`                                         | Width of the figure component (defaults to 100%) |
| `height`  | `String`        | `'360px'`                                      | Height of the visualization area                 |
| `margin`  | `Object`        | `{ top: 20, right: 20, bottom: 30, left: 40 }` | Margins for the visualization                    |
| `color`   | `String`        | `'light'`                                      | Color scheme for the caption area                |
| `class`   | `String`        | `''`                                           | CSS classes to apply to the component            |

## Events

The D3Figure component emits the following events:

- `initialized`: Fired when the visualization is first initialized
- `updated`: Fired when the visualization is updated
- `error`: Fired when there's an error during initialization or update

## Using Pre-built Visualizations

The Neversink theme includes some pre-built D3 visualizations that you can use:

```md
<D3Figure
  src="/components/d3-examples/bar-chart.js"
  :data="[
    { name: 'A', value: 5 },
    { name: 'B', value: 10 },
    { name: 'C', value: 15 },
    { name: 'D', value: 7 },
    { name: 'E', value: 12 }
  ]"
  caption="A simple bar chart"
  height="400px"
/>
```

## Styling with Tailwind

Like other components, you can use Tailwind classes to control the size and appearance:

```md
<D3Figure
  src="/components/d3-examples/bar-chart.js"
  caption="Responsive D3 visualization with Tailwind"
  class="w-full sm:w-2/3 lg:w-1/2 mx-auto shadow-md rounded-lg"
  height="400px"
/>
```

## Creating Custom Visualizations

When creating custom D3 visualizations, follow these best practices:

1. **Clear the container first**: Always start by clearing the container before adding new elements
2. **Handle responsive behavior**: Implement a `resize` function to handle container size changes
3. **Use the provided context**: Make use of the width, height, margin, and fontFamily values
4. **Clean up properly**: Remove event listeners and elements when they're no longer needed

Here's a minimal template for a custom visualization:

```js
export default function createVisualization({
    d3,
    container,
    width,
    height,
    margin,
    fontFamily,
    data,
}) {
    // Clear the container
    container.selectAll("*").remove()

    // Create SVG
    const svg = container
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`)

    // Create visualization using d3...

    // Return an object with methods
    return {
        resize() {
            // Update dimensions and redraw when resized
        },
        update(newData) {
            // Update visualization with new data
        },
    }
}
```

## Advanced Usage: Dynamic Updates

You can combine the D3Figure component with reactive data and events:

```vue
<script setup>
import {ref} from "vue"

const chartData = ref([
    {name: "A", value: 5},
    {name: "B", value: 10},
    {name: "C", value: 15},
])

const updateData = () => {
    chartData.value = chartData.value.map((d) => ({
        name: d.name,
        value: Math.floor(Math.random() * 20) + 1,
    }))
}
</script>

<template>
    <div>
        <D3Figure
            src="/components/d3-examples/bar-chart.js"
            :data="chartData"
            caption="Interactive D3 chart"
            height="400px"
            @initialized="(chart) => ($refs.chart = chart)"
        />
        <button @click="updateData" class="btn">Update Data</button>
    </div>
</template>
```

## v-drag Support

Like other components, the D3Figure component supports the `v-drag` directive:

```md
<D3Figure
  src="/components/d3-examples/bar-chart.js"
  caption="Draggable D3 visualization"
  class="w-64"
  v-drag="[200, 300, 300, 200]"
/>
```
