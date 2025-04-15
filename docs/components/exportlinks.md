# ExportLinks

The ExportLinks component provides a way to display download links for exported presentation formats (PDF, PPTX) in your Slidev presentation.

## Basic Usage

The component is designed to be used in a global layout to make export links available on all slides:

```md
<!-- In global-bottom.vue -->
<template>
  <ExportLinks />
</template>
```

## Features

- Automatically detects available export formats
- Displays download links for PDF and PPTX exports
- Adapts to light and dark presentation themes
- Positioned in the bottom-right corner of slides
- Only appears when exported files are available

## Properties

The ExportLinks component doesn't require any properties as it auto-detects exports from the repository structure.

| Property | Type | Default | Description                                       |
| -------- | ---- | ------- | ------------------------------------------------- |
| None     | -    | -       | The component doesn't require explicit properties |

## Configuration

Export options are controlled through the `slidev-autoexport.config.js` file in your project root:

```js
export default {
    // Enable PDF export (requires playwright-chromium)
    pdf: true,

    // Enable PDF outline in exported PDF
    pdfOutline: true,

    // Enable PPTX export (requires playwright-chromium)
    pptx: true,

    // Wait time in milliseconds before exporting each slide
    wait: 1000,

    // Path where exports will be saved (relative to project root)
    outputDir: "exports",

    // Custom filename for exports (without extension)
    // If undefined, will use the repository name
    filename: undefined,
}
```

## CI Integration

The ExportLinks component works with the CI system to automatically generate and serve PDFs and PPTXs. The export process runs in a separate CI job to avoid slowing down the main build:

1. Configure export options in `slidev-autoexport.config.js`
2. Commit changes to trigger the GitHub workflow
3. The workflow will generate the exports and deploy them with the site
4. ExportLinks automatically displays the available download options

## Customization

If you want to customize the appearance of the ExportLinks component, you can create your own version based on the original:

```md
<template>
  <div class="my-custom-export-links">
    <!-- Custom implementation -->
    <a v-if="pdfAvailable" :href="pdfUrl" class="custom-link">
      Download PDF
    </a>
  </div>
</template>
```

## Best Practices

- Use the default global-bottom setup for most presentations
- Set reasonable export options in the config file
- Remember that export generation requires playwright-chromium, which is only installed on-demand in CI
- For local testing, run `pnpm auto-export` to manually generate exports
