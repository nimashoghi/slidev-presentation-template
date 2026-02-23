declare module "virtual:citation-data" {
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
        filename?: string
    }

    interface CitationData {
        citations: Record<string, CitationEntry>
        orderedKeys: string[]
        config: CitationConfig
    }

    const data: CitationData
    export default data
}
