/**
 * Configuration for Slidev auto-export features
 * These settings control which export formats are generated during CI builds
 */
export default {
    // Enable PDF export (requires playwright-chromium)
    pdf: true,

    // Enable PDF outline in exported PDF
    pdfOutline: true,

    // Enable PPTX export (requires playwright-chromium)
    pptx: true,

    // Wait time in milliseconds before exporting each slide (helps with animations/content loading)
    wait: 1000,

    // Path where exports will be saved (relative to project root)
    outputDir: "exports",

    // Custom filename for exports (without extension)
    // If undefined, will use the repository name
    filename: undefined,
}
