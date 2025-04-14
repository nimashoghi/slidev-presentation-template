# Figure

The Figure component provides a consistent way to display images and videos with optional captions.

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

| Property    | Type      | Default   | Description                                         |
| ----------- | --------- | --------- | --------------------------------------------------- |
| `src`       | `String`  | Required  | The source URL of the image or video                |
| `caption`   | `String`  | `''`      | Caption text to display below the figure            |
| `width`     | `String`  | `'100%'`  | Width of the figure component                       |
| `type`      | `String`  | `'image'` | Type of media to display: `'image'` or `'video'`    |
| `autostart` | `Boolean` | `false`   | For videos: automatically start playing when loaded |
| `repeat`    | `Boolean` | `false`   | For videos: loop the video                          |
| `progress`  | `Boolean` | `false`   | For videos: show a progress bar below the video     |
| `color`     | `String`  | `'light'` | Color scheme for the caption and progress bar       |

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
