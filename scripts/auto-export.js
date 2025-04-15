#!/usr/bin/env node

/**
 * Script to handle conditional exports for Slidev presentations
 * based on the configuration in slidev-autoexport.config.js
 */

import fs from "fs"
import path from "path"
import {execSync} from "child_process"
import {fileURLToPath} from "url"

// Get the directory where this script is located
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")

// Default configuration
const defaultConfig = {
    pdf: true,
    pdfOutline: true,
    pptx: true,
    wait: 1000,
    outputDir: "exports",
    filename: undefined,
}

// Load user config
let userConfig = {}
try {
    const configPath = path.join(rootDir, "slidev-autoexport.config.js")
    if (fs.existsSync(configPath)) {
        const configModule = await import(`file://${configPath}`)
        userConfig = configModule.default || {}
    }
} catch (error) {
    console.warn(
        "Warning: Could not load slidev-autoexport.config.js",
        error.message,
    )
}

// Merge default with user config
const config = {...defaultConfig, ...userConfig}

// Get repository name from environment or package.json
let repoName = process.env.GITHUB_REPOSITORY?.split("/")[1]
if (!repoName) {
    try {
        const packageJson = JSON.parse(
            fs.readFileSync(path.join(rootDir, "package.json"), "utf8"),
        )
        repoName = packageJson.name
    } catch (error) {
        console.warn(
            "Warning: Could not determine repository name",
            error.message,
        )
        repoName = "slidev-presentation"
    }
}

// Set default filename if not provided
const baseFilename = config.filename || repoName

// Create output directory if it doesn't exist
const outputDir = path.join(rootDir, config.outputDir)
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, {recursive: true})
}

// Function to check if playwright is installed
function isPlaywrightInstalled() {
    try {
        execSync("npx playwright-chromium --version", {stdio: "ignore"})
        return true
    } catch (error) {
        return false
    }
}

// Check which exports are enabled
const hasPlaywright = isPlaywrightInstalled()
const needsPlaywright = config.pdf || config.pptx

// Main function to export slides
async function exportSlides() {
    // If Playwright is needed but not installed, try to install it
    if (needsPlaywright && !hasPlaywright) {
        console.log("Installing playwright-chromium for PDF/PPTX export...")
        try {
            execSync("npm install --no-save playwright-chromium", {
                stdio: "inherit",
            })
        } catch (error) {
            console.error(
                "Failed to install playwright-chromium. PDF/PPTX export will be skipped.",
            )
            config.pdf = false
            config.pptx = false
        }
    }

    // Export PDF if enabled
    if (config.pdf) {
        console.log("Exporting PDF...")
        const pdfOptions = [
            `--output "${path.join(outputDir, `${baseFilename}.pdf`)}"`,
            `--wait ${config.wait}`,
        ]

        if (config.pdfOutline) {
            pdfOptions.push("--with-toc")
        }

        try {
            execSync(`npx slidev export ${pdfOptions.join(" ")}`, {
                stdio: "inherit",
            })
            console.log(
                `PDF exported to ${path.join(config.outputDir, `${baseFilename}.pdf`)}`,
            )
        } catch (error) {
            console.error("Failed to export PDF:", error.message)
        }
    }

    // Export PPTX if enabled
    if (config.pptx) {
        console.log("Exporting PPTX...")
        const pptxOptions = [
            `--format pptx`,
            `--output "${path.join(outputDir, `${baseFilename}.pptx`)}"`,
            `--wait ${config.wait}`,
        ]

        try {
            execSync(`npx slidev export ${pptxOptions.join(" ")}`, {
                stdio: "inherit",
            })
            console.log(
                `PPTX exported to ${path.join(config.outputDir, `${baseFilename}.pptx`)}`,
            )
        } catch (error) {
            console.error("Failed to export PPTX:", error.message)
        }
    }

    console.log("Export process completed!")
}

// Run the export process
exportSlides().catch((error) => {
    console.error("Export process failed:", error)
    process.exit(1)
})
