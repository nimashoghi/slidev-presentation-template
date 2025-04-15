---
theme: neversink
title: Advanced Research Methods
titleTemplate: "%s - Academic Presentation"
transition: slide-left
layout: cover
color: navy-light
---

# Advanced Research Methods

## A Multi-Modal Analysis

Dr. Academic Researcher
Department of Scientific Studies
Research University

<!--
This is a speaker note.
- Introduce yourself
- Mention your department
- Brief overview of talk structure
-->

---
layout: two-cols-title
color: emerald-light
columns: is-6
align: l-lt-lt
---

:: title ::

# Research Overview

:: left ::

<v-clicks>

- Novel methodology in data analysis
- Multi-modal approach to problem solving
- Key findings and implications
- Future research directions

</v-clicks>

:: right ::

<Figure
  src="https://picsum.photos/seed/overview/400/300"
  caption="Figure 1: Visual representation of our research methodology"
  class="w-full"
  color="emerald-light"
/>

---
layout: default
color: teal-light
---

# Methodology

<v-clicks>

1. Data Collection

    - Systematic sampling approach
    - Quality control measures

2. Analysis Framework

    - Statistical methods
    - Validation techniques

3. Implementation
    - Custom algorithms
    - Performance optimization

</v-clicks>

<!--
Emphasize the rigorous nature of our methodology
Walk through each step carefully
-->

---
layout: two-cols-title
color: sky-light
---

:: title ::

# Key Results

:: left ::
| Metric | Value | p-value |
| ------ | ----- | ------- |
| Alpha | 0.82 | < 0.001 |
| Beta | 0.75 | < 0.005 |
| Gamma | 0.93 | < 0.001 |

:: right ::

<StickyNote color="sky-light" width="250px">
Note: All results significant at p < 0.05
</StickyNote>

---
layout: default
color: white
---

# Mathematical Framework

<div class="grid grid-cols-2 gap-4">
<div>

**Core Equation:**

$$ \mathcal{L}(\theta) = \sum*{i=1}^n (y_i - f*\theta(x_i))^2 $$

Where:

- $\theta$ represents model parameters
- $n$ is the sample size
- $f_\theta$ is our proposed function

</div>
<div>

<Admonition title="Important" color="emerald-light">
The model converges under standard conditions
</Admonition>

</div>
</div>

---
layout: quote
color: rose-light
quotesize: text-xl
author: "Notable Scientist"
---

"The advancement of science depends on new techniques, new discoveries, and new ideas, probably in that order."

---
layout: full
color: light
---

# Visual Analysis

<div class="grid grid-cols-2 gap-4">
  <Figure src="https://picsum.photos/seed/result1/400/300" caption="Figure 2: Experimental Results (Group A)" class="w-full" />
  <Figure src="https://picsum.photos/seed/result2/400/300" caption="Figure 3: Experimental Results (Group B)" class="w-full" />
</div>

<!--
Compare and contrast the results between groups
Point out key differences in patterns
-->

---
layout: default
color: light
---

# Future Directions

<div class="flex gap-4">
<div class="flex-1">

## Next Steps

<v-clicks>

- Extended data collection
- Algorithm refinement
- Cross-validation studies
- Publication preparation

</v-clicks>

</div>
<div class="flex-1">

<QRCode value="https://example.com/research" :size="150" />

_Scan for more details_

</div>
</div>

---
layout: default
color: navy-light
---

# Figure Component Examples

This section showcases the various capabilities of the Neversink Figure component.

<!--
The following slides demonstrate:
- Basic image usage
- Image with caption and custom width
- Video with controls
- Multiple layout options
-->

---
layout: two-cols-title
color: teal-light
columns: is-7
align: l-lt-lt
---

:: title ::

# Basic Figure Usage

:: left ::

## Simple Image

<Figure
  src="https://picsum.photos/seed/basic/500/300"
  class="w-full"
/>

## Image with Caption

<Figure
  src="https://picsum.photos/seed/caption/500/300"
  caption="Figure 4: Sample image with descriptive caption"
  class="w-full"
  color="teal-light"
/>

:: right ::

## Styling with Tailwind Classes

<Figure
  src="https://picsum.photos/seed/styling/500/300"
  caption="Figure 5: Rounded corners and shadow effects"
  class="w-full rounded-lg shadow-lg"
  color="teal-light"
/>

---
layout: default
color: emerald-light
---

# Video Examples

<div class="grid grid-cols-2 gap-8">
  <div>
    <h2 class="text-center mb-4">Standard Video</h2>
    <Figure
      type="video"
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      caption="Video 1: Standard playback (click to play/pause)"
      class="w-full"
      color="emerald-light"
    />
  </div>

  <div>
    <h2 class="text-center mb-4">With Progress Bar</h2>
    <Figure
      type="video"
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      caption="Video 2: With progress tracking"
      class="w-full"
      progress
      color="emerald-light"
    />
  </div>
</div>

---
layout: two-cols-title
color: sky-light
columns: is-6
---

:: title ::

# Advanced Video Options

:: left ::

## Autoplay & Repeat

<Figure
  type="video"
  src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  caption="Video 3: Autoplays and loops continuously"
  class="w-full"
  autostart
  repeat
  progress
  color="sky-light"
/>

:: right ::

## Responsive Sizing

<Figure
  type="video"
  src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
  caption="Video 4: Responsive with Tailwind"
  class="w-full sm:w-3/4 lg:w-full rounded-md"
  progress
  color="sky-light"
/>

---
layout: full
color: rose-light
---

# Creative Layouts with Figures

<div class="grid grid-cols-3 gap-4">
  <Figure
    src="https://picsum.photos/seed/grid1/300/200"
    caption="Left image"
    class="w-full"
    color="rose-light"
  />

  <Figure
    src="https://picsum.photos/seed/grid2/300/200"
    caption="Center image"
    class="w-full"
    color="rose-light"
  />

  <Figure
    type="video"
    src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    caption="Right video"
    class="w-full"
    progress
    color="rose-light"
  />
</div>

<div class="mt-8">
  <Admonition title="Pro Tip" color="rose-light">
    Combine Figure components with grid layouts to create visually balanced slide designs
  </Admonition>
</div>

---
layout: two-cols-title
color: amber-light
columns: is-6
---

:: title ::

# Figure Component Code Examples

:: left ::

## Basic Image with Caption

```md
<Figure
  src="/images/photo.png"
  caption="Figure caption"
  class="w-full"
  color="amber-light"
/>
```

## Video with Progress

```md
<Figure
  type="video"
  src="/videos/demo.mp4"
  caption="Video caption"
  class="w-full"
  progress
  color="amber-light"
/>
```

:: right ::

## Advanced Video Options

```md
<Figure
  type="video"
  src="/videos/demo.mp4"
  caption="Looping video"
  class="w-3/4 mx-auto"
  autostart
  repeat
  progress
  color="amber-light"
/>
```

<!--
Encourage attendees to experiment with the different Figure options
Mention that videos play inline - no fullscreen mode needed
-->

---
layout: default
---

# Plotly Figure

<PlotlyFigure
  src="/figure.json"
  caption="This is a caption for the Plotly chart"
  class="w-full md:w-2/3"
/>

---
layout: end
color: navy-light
---

# Thank You

Questions & Discussion

<div class="text-sm text-gray-500 mt-4">
Contact: research@example.edu
</div>
