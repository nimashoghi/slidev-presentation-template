# Figure

The Figure component provides a consistent way to display images and videos with optional captions.

## Basic Usage

A basic image figure can be created like this:

```md
<Figure
  src="/images/photo.png"
  caption="This is a caption for the image"
  width="500px"
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

## Video Example

For videos, you can enable autoplay, looping, and progress tracking:

```md
<Figure
  type="video"
  src="/videos/demo.mp4"
  caption="Demo video with progress tracking"
  width="60%"
  autostart
  repeat
  progress
  color="sky"
/>
```

Videos can be toggled between play and pause by clicking on them.

## Color Schemes

The `color` property accepts any of the [color scheme](/colors) options available in Neversink. This will affect the styling of the caption background and progress bar.

## Using with Tailwind Classes

You can apply additional Tailwind classes to customize the Figure component:

```md
<div class="flex justify-center">
  <Figure
    src="/images/photo.png"
    caption="Centered image with shadow effect"
    width="400px"
    class="shadow-lg"
  />
</div>
```

## v-drag Support

Like other components in Neversink, the Figure component can be positioned using the `v-drag` directive:

```md
<Figure
  src="/images/photo.png"
  caption="Draggable figure"
  width="300px"
  v-drag="[200, 300, 300, 200]"
/>
```
