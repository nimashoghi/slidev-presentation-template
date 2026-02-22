# Figure

The Figure component provides a consistent way to display images and videos with optional captions, credits, and citation support.

## Basic Usage

A basic image figure can be created like this:

```md
<Figure
  src="/images/photo.png"
  caption="This is a caption for the image"
  class="w-full md:w-2/3"
/>
```

## Properties

| Property         | Type      | Default   | Description                                                        |
| ---------------- | --------- | --------- | ------------------------------------------------------------------ |
| `src`            | `String`  | Required  | The source URL of the image or video                               |
| `caption`        | `String`  | `''`      | Caption text to display below the figure                           |
| `captionType`    | `String`  | `'text'`  | Caption mode: `'text'` (plain text) or `'template'` (slot-based)  |
| `credits`        | `String`  | `''`      | Inline credits text appended to caption                            |
| `creditsCiteKey` | `String`  | `''`      | BibTeX cite key for inline citation credit (uses `<Cite>`)        |
| `width`          | `String`  | `null`    | Width of the figure component                                      |
| `type`           | `String`  | `'image'` | Type of media to display: `'image'` or `'video'`                  |
| `autostart`      | `Boolean` | `false`   | For videos: automatically start playing when loaded                |
| `repeat`         | `Boolean` | `false`   | For videos: loop the video with pause delays                       |
| `progress`       | `Boolean` | `false`   | For videos: show a progress bar below the video                    |
| `pauseStart`     | `Number`  | `1500`    | For videos: milliseconds to pause on first frame before playing    |
| `pauseEnd`       | `Number`  | `2000`    | For videos: milliseconds to pause on last frame before looping     |
| `color`          | `String`  | `'light'` | Color scheme for the caption and progress bar                      |
| `class`          | `String`  | `''`      | CSS classes to apply to the component                              |

## Direct Replacement for Native Elements

The Figure component can be used as a direct replacement for native `<img>` and `<video>` elements:

```md
<!-- Instead of this: -->
<img src="/images/photo.png" class="w-75" />

<!-- You can use this: -->
<Figure src="/images/photo.png" class="w-75" />
```

When used without a caption or progress bar, the Figure component will behave like its native HTML counterpart, preserving your CSS classes and styling.

## Styling with Tailwind

The recommended way to control the size and appearance of the Figure component is using Tailwind classes:

```md
<Figure
  src="/images/photo.png"
  caption="Responsive figure with Tailwind classes"
  class="w-full sm:w-2/3 lg:w-1/2 mx-auto shadow-md rounded-lg"
/>
```

This approach provides more flexibility than fixed widths and better supports responsive design.

## Video Example

For videos, you can enable autoplay, looping, and progress tracking:

```md
<Figure
  type="video"
  src="/videos/demo.mp4"
  caption="Demo video with progress tracking"
  class="w-3/5 mx-auto"
  autostart
  repeat
  progress
  color="sky"
/>
```

Videos can be toggled between play and pause by clicking on them.

### Video Loop Behavior

When `repeat` is enabled, the video uses a pause-at-boundaries strategy instead of native looping:

1. The video pauses on the first frame for `pauseStart` ms (default 1500) before playing.
2. When the video ends, it pauses on the last frame for `pauseEnd` ms (default 2000) before looping back.

This gives viewers time to absorb the first and last frames. You can customize the delays:

```md
<Figure
  type="video"
  src="/videos/animation.mp4"
  autostart
  repeat
  :pauseStart="500"
  :pauseEnd="3000"
/>
```

## Credits and Citations

You can add inline credits or citations that appear at the end of the caption.

### Plain Text Credits

```md
<Figure
  src="/images/diagram.png"
  caption="Architecture overview"
  credits="Adapted from Smith et al."
/>
```

### Citation Credits

Use `creditsCiteKey` to render an inline `<Cite>` component referencing your `.bib` file:

```md
<Figure
  src="/images/result.png"
  caption="Experimental results"
  creditsCiteKey="smith2023"
/>
```

## Template Captions

For captions that need rich formatting (HTML, components, links), use `captionType="template"` with the `caption` slot:

```md
<Figure
  src="/images/chart.png"
  captionType="template"
>
  <template #caption>
    <p>Results from <strong>Experiment 1</strong> showing <em>p</em> &lt; 0.05. See <Cite citeKey="jones2024" /> for methodology.</p>
  </template>
</Figure>
```

The template caption slot accepts arbitrary HTML and Vue components, giving you full control over caption content.

## Color Schemes

The `color` property accepts any of the [color scheme](/colors) options available in Neversink. This will affect the styling of the caption background and progress bar.

## Advanced Positioning

You can combine Tailwind classes with flex or grid layouts for precise positioning:

```md
<div class="flex justify-center items-center gap-4">
  <Figure
    src="/images/photo1.png"
    caption="Left image"
    class="w-1/3"
  />
  <Figure
    src="/images/photo2.png"
    caption="Right image"
    class="w-1/3"
  />
</div>
```

## v-drag Support

Like other components in Neversink, the Figure component can be positioned using the `v-drag` directive:

```md
<Figure
  src="/images/photo.png"
  caption="Draggable figure"
  class="w-64"
  v-drag="[200, 300, 300, 200]"
/>
```
