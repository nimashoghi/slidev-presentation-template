import {Cite} from "@citation-js/core"
import "@citation-js/plugin-bibtex"
import "@citation-js/plugin-csl"
import "@citation-js/plugin-doi"
import fs from "node:fs"
import path from "node:path"
import type {Plugin, ViteDevServer} from "vite"

const VIRTUAL_MODULE_ID = "virtual:citation-data"
const RESOLVED_VIRTUAL_MODULE_ID = "\0" + VIRTUAL_MODULE_ID

interface BiblioConfig {
    template?: string
    locale?: string
    numericalRefs?: boolean
    showTooltips?: boolean
    hoverEffect?: boolean
    filename?: string
    itemsPerPage?: number
}

interface Headmatter {
    biblio?: BiblioConfig
}

interface CitationEntry {
    key: string
    citation: string
    fullCitation: string
    title: string
    author: string
    year: string | number
    error?: boolean
}

interface CitationData {
    citations: Record<string, CitationEntry>
    orderedKeys: string[]
    config: BiblioConfig & {template: string; locale: string; numericalRefs: boolean; showTooltips: boolean; hoverEffect: boolean}
}

interface Author {
    family?: string
    given?: string
}

/**
 * Parse YAML frontmatter from slides.md to extract biblio config.
 * Uses a simple regex approach to avoid adding a yaml dependency.
 */
function parseHeadmatter(slidesPath: string): Headmatter {
    if (!fs.existsSync(slidesPath)) return {}
    const content = fs.readFileSync(slidesPath, "utf-8")
    const match = content.match(/^---\n([\s\S]*?)\n---/)
    if (!match) return {}

    const yaml = match[1]
    const result: Headmatter = {}
    let inBiblio = false
    for (const line of yaml.split("\n")) {
        if (line.match(/^biblio:\s*$/)) {
            inBiblio = true
            result.biblio = {}
            continue
        }
        if (inBiblio && line.match(/^\s{2,}\w/)) {
            const kvMatch = line.match(/^\s+(\w+):\s*(.+)$/)
            if (kvMatch && result.biblio) {
                let value: string | boolean | number = kvMatch[2].trim()
                // Remove quotes
                if (
                    (value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))
                ) {
                    value = value.slice(1, -1)
                }
                // Parse booleans
                if (value === "true") value = true
                else if (value === "false") value = false
                // Parse numbers
                else if (!isNaN(value as unknown as number) && value !== "")
                    value = Number(value)
                ;(result.biblio as Record<string, string | boolean | number>)[
                    kvMatch[1]
                ] = value
            }
        } else if (inBiblio && !line.match(/^\s/)) {
            inBiblio = false
        }
    }
    return result
}

/**
 * Scan slides.md for <Cite ... bib="..." /> tags and collect additional bib files.
 */
function scanForAdditionalBibFiles(slidesPath: string): string[] {
    if (!fs.existsSync(slidesPath)) return []
    const content = fs.readFileSync(slidesPath, "utf-8")
    const bibFiles = new Set<string>()
    const regex = /\bbib=["']([^"']+)["']/g
    let match
    while ((match = regex.exec(content)) !== null) {
        bibFiles.add(match[1])
    }
    return [...bibFiles]
}

/**
 * Format authors for display.
 */
function formatAuthors(authors: Author[] | undefined): string {
    if (!authors || !authors.length) return ""
    if (authors.length === 1) {
        return `${authors[0].family}, ${authors[0].given?.[0] || ""}.`
    }
    if (authors.length === 2) {
        return `${authors[0].family}, ${authors[0].given?.[0] || ""}. & ${authors[1].family}, ${authors[1].given?.[0] || ""}.`
    }
    return `${authors[0].family}, ${authors[0].given?.[0] || ""}. et al.`
}

/**
 * Build citation data from .bib file(s).
 */
function buildCitationData(
    projectRoot: string,
    biblioConfig: BiblioConfig,
): CitationData {
    const defaultConfig = {
        template: "apa" as const,
        locale: "en-US" as const,
        numericalRefs: false,
        showTooltips: true,
        hoverEffect: true,
    }
    const config = {...defaultConfig, ...biblioConfig}

    // Determine the main .bib file path
    const bibFilename = config.filename || "reference.bib"
    const bibPath = path.resolve(projectRoot, bibFilename)

    // Collect all bib content
    let allBibContent = ""

    if (fs.existsSync(bibPath)) {
        allBibContent += fs.readFileSync(bibPath, "utf-8") + "\n"
    } else {
        console.warn(`[citation-plugin] Bibliography file not found: ${bibPath}`)
    }

    // Scan slides.md for additional bib files
    const slidesPath = path.resolve(projectRoot, "slides.md")
    const additionalBibFiles = scanForAdditionalBibFiles(slidesPath)
    for (const bibFile of additionalBibFiles) {
        const resolved = path.resolve(
            projectRoot,
            bibFile.startsWith("/") ? bibFile.slice(1) : bibFile,
        )
        if (fs.existsSync(resolved)) {
            allBibContent += fs.readFileSync(resolved, "utf-8") + "\n"
        } else {
            console.warn(
                `[citation-plugin] Additional bib file not found: ${resolved}`,
            )
        }
    }

    if (!allBibContent.trim()) {
        return {citations: {}, orderedKeys: [], config}
    }

    // Parse with citation-js
    const cite = new Cite(allBibContent)
    const citations: Record<string, CitationEntry> = {}
    const orderedKeys: string[] = []

    for (const entry of cite.data) {
        const key: string = entry.id
        orderedKeys.push(key)

        try {
            const citation = cite.format("citation", {
                format: "text",
                template: config.template,
                entry: [key],
            }) as string

            const fullCitation = cite.format("bibliography", {
                format: "text",
                template: config.template,
                entry: [key],
            }) as string

            citations[key] = {
                key,
                citation,
                fullCitation,
                title: entry.title || "",
                author: formatAuthors(entry.author),
                year:
                    entry.issued?.["date-parts"]?.[0]?.[0] ||
                    entry.year ||
                    "",
            }
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error)
            console.error(
                `[citation-plugin] Error formatting citation "${key}":`,
                message,
            )
            citations[key] = {
                key,
                citation: `[${key}?]`,
                fullCitation: `Error formatting: ${key}`,
                title: entry.title || "",
                author: "",
                year: "",
                error: true,
            }
        }
    }

    return {citations, orderedKeys, config}
}

/**
 * Vite plugin for build-time citation processing.
 */
export function citationPlugin(): Plugin {
    let projectRoot = ""
    let bibFilePath = ""

    return {
        name: "vite-plugin-citation",
        enforce: "pre",

        configResolved(resolvedConfig) {
            projectRoot = resolvedConfig.root
        },

        configureServer(devServer: ViteDevServer) {
            // Determine the bib file to watch
            const slidesPath = path.resolve(projectRoot, "slides.md")
            const headmatter = parseHeadmatter(slidesPath)
            const bibFilename =
                headmatter.biblio?.filename || "reference.bib"
            bibFilePath = path.resolve(projectRoot, bibFilename)

            // Watch the .bib file for changes
            devServer.watcher.add(bibFilePath)
            devServer.watcher.on("change", (changedPath: string) => {
                if (path.resolve(changedPath) === bibFilePath) {
                    const mod =
                        devServer.moduleGraph.getModuleById(
                            RESOLVED_VIRTUAL_MODULE_ID,
                        )
                    if (mod) {
                        devServer.moduleGraph.invalidateModule(mod)
                    }
                    devServer.ws.send({type: "full-reload"})
                }
            })
        },

        resolveId(id: string) {
            if (id === VIRTUAL_MODULE_ID) {
                return RESOLVED_VIRTUAL_MODULE_ID
            }
        },

        load(id: string) {
            if (id === RESOLVED_VIRTUAL_MODULE_ID) {
                const slidesPath = path.resolve(projectRoot, "slides.md")
                const headmatter = parseHeadmatter(slidesPath)
                const data = buildCitationData(
                    projectRoot,
                    headmatter.biblio || {},
                )
                return `export default ${JSON.stringify(data)};`
            }
        },
    }
}
