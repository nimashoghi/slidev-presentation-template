import {reactive} from "vue"
import citationData from "virtual:citation-data"

interface CitationEntry {
    key: string
    citation: string
    fullCitation: string
    title: string
    author: string
    year: string | number
    error?: boolean
}

interface CitationConfig {
    template: string
    locale: string
    numericalRefs: boolean
    showTooltips: boolean
    hoverEffect: boolean
    [key: string]: unknown
}

const {citations: prebuiltCitations, orderedKeys, config: prebuiltConfig} = citationData

export const citationState = {
    defaultConfig: {
        template: "apa",
        locale: "en-US",
        numericalRefs: false,
        showTooltips: true,
        hoverEffect: true,
        ...prebuiltConfig,
    } as CitationConfig,

    citations: prebuiltCitations as Record<string, CitationEntry>,
    orderedKeys,

    // Runtime page tracking — which citations appear on which slides
    pageMap: reactive<Record<string, number[]>>({}),

    // Build a numerical index from orderedKeys
    citationsIndex: Object.fromEntries(
        orderedKeys.map((key: string, i: number) => [key, i + 1]),
    ) as Record<string, number>,

    /**
     * Track that a citation key appears on a given page (slide number).
     * Called at component setup time — synchronous.
     */
    trackPage(key: string, page: number) {
        if (!key || page == null) return

        if (!this.pageMap[key]) {
            this.pageMap[key] = []
        }
        if (!this.pageMap[key].includes(page)) {
            this.pageMap[key].push(page)
        }
    },

    /**
     * Get a citation by key — synchronous, no loading state.
     */
    getCitation(key: string): CitationEntry {
        return this.citations[key] || {key, error: true}
    },

    /**
     * Get all citations sorted by author name.
     */
    getAllCitations(): CitationEntry[] {
        return Object.values(this.citations).sort((a, b) => {
            if (a.author && b.author) {
                return a.author.localeCompare(b.author)
            }
            return 0
        })
    },

    /**
     * Get pages where a citation key was used.
     */
    getPagesForKey(key: string): number[] {
        return this.pageMap[key] || []
    },
}
