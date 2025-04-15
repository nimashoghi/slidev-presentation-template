import {ref} from "vue"
import {Cite} from "@citation-js/core"
import "@citation-js/plugin-bibtex"
import "@citation-js/plugin-csl"
import "@citation-js/plugin-doi"

export const citationState = {
    defaultConfig: {
        template: "apa",
        locale: "en-US",
        numericalRefs: false,
        showTooltips: true,
        defaultBibFile: "/reference.bib",
        hoverEffect: true,
    },

    state: {
        cite: null,
        initialized: false,
        initializing: false,
        citations: {},
        citationsIndex: {},
        pages: {},
        version: ref(0),
        config: {},
    },

    /**
     * Resolve a source URL to handle base paths correctly
     * @param {string} src - Source path to resolve
     * @returns {string} - Properly resolved URL
     */
    resolveUrl(src) {
        // If src starts with 'http' or '//', it's already a full URL
        if (src.match(/^(https?:)?\/\//)) {
            return src
        }

        // If src starts with '/', it's a root-relative path that needs the base
        if (src.startsWith("/")) {
            return `${import.meta.env.BASE_URL}${src.slice(1)}`
        }

        // Relative path (no leading slash)
        return src
    },

    /**
     * Initialize the citation engine
     */
    init(slidevConfig) {
        if (this.state.initializing) {
            return Promise.resolve(this.state.cite)
        }

        this.state.initializing = true
        this.state.config = {...this.defaultConfig, ...slidevConfig?.biblio}

        // Determine which file to load
        const bibFile =
            this.state.config.filename || this.state.config.defaultBibFile

        // Resolve the URL with proper base path handling
        const resolvedUrl = this.resolveUrl(bibFile)

        // Load the BibTeX file
        return fetch(`${resolvedUrl}${resolvedUrl.includes("?") ? "" : "?raw"}`)
            .then((response) => {
                if (!response.ok) {
                    console.warn(
                        `Failed to load bibliography file: ${resolvedUrl}`,
                    )
                    return ""
                }
                return response.text()
            })
            .then((data) => {
                if (data) {
                    this.state.cite = new Cite(data)
                    this.state.initialized = true
                    this.state.version.value += 1
                    return this.state.cite
                }
            })
            .catch((error) => {
                console.error("Error loading bibliography:", error)
                this.state.initializing = false
            })
    },

    /**
     * Add a citation to the system
     * @param {string} key - Citation key
     * @param {number} page - Page number
     * @param {string} bibFile - Optional custom bib file
     */
    addCitation(key, page, bibFile = null) {
        if (!key) return null

        // If custom bib file is provided, load it
        if (bibFile && !this.state.citations[key]) {
            // Resolve the URL with proper base path handling
            const resolvedUrl = this.resolveUrl(bibFile)

            fetch(`${resolvedUrl}${resolvedUrl.includes("?") ? "" : "?raw"}`)
                .then((response) => {
                    if (!response.ok) return null
                    return response.text()
                })
                .then((data) => {
                    if (data) {
                        const tempCite = new Cite(data)
                        const entries = tempCite.data
                        const entry = entries.find((e) => e.id === key)

                        if (entry) {
                            if (!this.state.cite) {
                                this.state.cite = new Cite()
                            }
                            this.state.cite.add(entry)
                            this.updateCitation(key, page)
                            this.state.version.value += 1
                        }
                    }
                })
                .catch((error) => {
                    console.error(
                        `Error loading custom bib file for ${key}:`,
                        error,
                    )
                })
        }

        // Track which citations appear on which pages
        if (!this.state.pages[page]) {
            this.state.pages[page] = []
        }

        if (!this.state.pages[page].includes(key)) {
            this.state.pages[page].push(key)
        }

        this.updateCitation(key, page)
        return key
    },

    /**
     * Update citation data
     */
    updateCitation(key, page) {
        if (!this.state.cite || !this.state.initialized) return

        try {
            // Find the citation in our data
            const entry = this.state.cite.data.find((entry) => entry.id === key)

            if (!entry) {
                this.state.citations[key] = {
                    key,
                    error: true,
                    errorMessage: `Citation not found: ${key}`,
                }
                return
            }

            // Format the citation in different ways
            const citation = this.state.cite.format("citation", {
                format: "text",
                template: this.state.config.template,
                entry: [key],
            })

            const fullCitation = this.state.cite.format("bibliography", {
                format: "text",
                template: this.state.config.template,
                entry: [key],
            })

            // Store all the info about this citation
            this.state.citations[key] = {
                key,
                citation,
                fullCitation,
                title: entry.title,
                author: this.formatAuthors(entry.author),
                year: entry.issued?.["date-parts"]?.[0]?.[0] || entry.year,
                pages: page ? [page] : [],
            }

            // Update the index
            const index = Object.keys(this.state.citations).indexOf(key) + 1
            this.state.citationsIndex[key] = index

            this.state.version.value += 1
        } catch (error) {
            console.error(`Error updating citation ${key}:`, error)
        }
    },

    /**
     * Format authors for display
     */
    formatAuthors(authors) {
        if (!authors || !authors.length) return ""

        if (authors.length === 1) {
            return `${authors[0].family}, ${authors[0].given?.[0] || ""}.`
        }

        if (authors.length === 2) {
            return `${authors[0].family}, ${authors[0].given?.[0] || ""}. & ${authors[1].family}, ${authors[1].given?.[0] || ""}.`
        }

        return `${authors[0].family}, ${authors[0].given?.[0] || ""}. et al.`
    },

    /**
     * Get a citation by key
     */
    getCitation(key) {
        return this.state.citations[key] || {key, error: true}
    },

    /**
     * Get all citations
     */
    getAllCitations() {
        return Object.values(this.state.citations).sort((a, b) => {
            // Sort by author name
            if (a.author && b.author) {
                return a.author.localeCompare(b.author)
            }
            return 0
        })
    },

    /**
     * Get citations for a specific page
     */
    getCitationsForPage(page) {
        if (!this.state.pages[page]) return []
        return this.state.pages[page].map((key) => this.getCitation(key))
    },
}
