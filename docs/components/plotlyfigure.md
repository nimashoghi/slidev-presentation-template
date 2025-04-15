# PlotlyFigure

The PlotlyFigure component provides a consistent way to display interactive Plotly charts with optional captions, maintaining the same styling as the Figure component.

## Basic Usage

A basic Plotly figure can be created like this:

```md
<PlotlyFigure
  src="/data/plotly-chart.json"
  caption="This is a caption for the Plotly chart"
  class="w-full md:w-2/3"
/>
```

## Properties

| Property   | Type     | Default   | Description                                              |
| ---------- | -------- | --------- | -------------------------------------------------------- |
| `src`      | `String` | Required  | URL to a JSON file containing Plotly figure data         |
| `caption`  | `String` | `''`      | Caption text to display below the figure                 |
| `width`    | `String` | `null`    | Width of the figure component (defaults to 100%)         |
| `height`   | `String` | `'360px'` | Height of the plot area                                  |
| `fontSize` | `Number` | `12`      | Font size for plot elements (axis labels, legends, etc.) |
| `color`    | `String` | `'light'` | Color scheme for the caption area                        |
| `class`    | `String` | `''`      | CSS classes to apply to the component                    |

## PlotlyFigure JSON Format

The `src` property expects a URL to a JSON file with the following structure:

```json
{
  "data": [
    {
      "x": [1, 2, 3, 4],
      "y": [10, 15, 13, 17],
      "type": "scatter",
      "mode": "lines+markers",
      "name": "Series 1"
    },
    {
      "x": [1, 2, 3, 4],
      "y": [12, 9, 15, 12],
      "type": "scatter",
      "mode": "lines+markers",
      "name": "Series 2"
    }
  ],
  "layout": {
    "title": "Sample Plot",
    "xaxis": {
      "title": "X Axis"
    },
    "yaxis": {
      "title": "Y Axis"
    }
  }
}
```

This is the standard Plotly figure format with a `data` array and a `layout` object. The component will automatically adapt the plot's appearance to match your presentation's theme and font.

## Styling with Tailwind

The recommended way to control the size and appearance of the PlotlyFigure component is using Tailwind classes:

```md
<PlotlyFigure
  src="/data/plotly-chart.json"
  caption="Responsive Plotly chart with Tailwind classes"
  class="w-full sm:w-2/3 lg:w-1/2 mx-auto shadow-md rounded-lg"
  height="400px"
/>
```

This approach provides more flexibility than fixed widths and better supports responsive design.

## Responsive Behavior

PlotlyFigure is responsive by default and will automatically resize when the container or window size changes. You can control the default size with the `width` and `height` properties, but the component will adjust to fit its container.

## Customizing Chart Appearance

The PlotlyFigure component inherits the font family from your presentation theme for consistent styling. You can also customize the font size of chart elements:

```md
<PlotlyFigure
  src="/data/plotly-chart.json"
  caption="Plot with larger font size"
  fontSize="16"
/>
```

## Color Schemes

The `color` property accepts any of the [color scheme](/colors) options available in Neversink. This will affect the styling of the caption background.

## Advanced Positioning

You can combine Tailwind classes with flex or grid layouts for precise positioning:

```md
<div class="flex justify-center items-center gap-4">
  <PlotlyFigure
    src="/data/chart1.json"
    caption="Left chart"
    class="w-1/3"
  />
  <PlotlyFigure
    src="/data/chart2.json"
    caption="Right chart"
    class="w-1/3"
  />
</div>
```

## v-drag Support

Like other components in Neversink, the PlotlyFigure component can be positioned using the `v-drag` directive:

```md
<PlotlyFigure
  src="/data/chart.json"
  caption="Draggable Plotly chart"
  class="w-64"
  v-drag="[200, 300, 300, 200]"
/>
```
