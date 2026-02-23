<script setup>
import {computed, watch} from "vue"
import {useSlideContext} from "@slidev/client"
import {citationState} from "./CiteEngine"

const {$slidev, $frontmatter} = useSlideContext()
const props = defineProps({
    showAll: {
        type: Boolean,
        default: false,
    },
    itemsPerPage: {
        type: Number,
        default: 0,
    },
    title: {
        type: String,
        default: null,
    },
})

// Combine configuration from different sources
const config = computed(() => {
    return {
        ...citationState.defaultConfig,
        ...$slidev.configs?.biblio,
        ...$frontmatter?.biblio,
    }
})

// Computed property for how many items to show per page
const maxItems = computed(() => {
    return props.itemsPerPage || config.value.itemsPerPage || 10
})

// Derive references reactively from citationState
const references = computed(() => {
    let refs
    if (props.showAll) {
        refs = citationState.getAllCitations()
    } else {
        refs = Object.values(citationState.citations)
            .filter((c) => {
                const pages = citationState.getPagesForKey(c.key)
                return pages && pages.length > 0
            })
            .sort((a, b) => {
                if (a.author && b.author) {
                    return a.author.localeCompare(b.author)
                }
                return 0
            })
    }
    return refs
})

// Paginate references
const paginatedReferences = computed(() => {
    const refs = references.value
    if (maxItems.value > 0 && refs.length > maxItems.value) {
        const pages = []
        for (let i = 0; i < refs.length; i += maxItems.value) {
            pages.push(refs.slice(i, i + maxItems.value))
        }
        return pages
    }
    return [refs]
})

// Enrich references with page data for display
const enrichedPaginatedReferences = computed(() => {
    return paginatedReferences.value.map((page) =>
        page.map((ref) => ({
            ...ref,
            pages: citationState.getPagesForKey(ref.key),
        })),
    )
})

// Watch for click events to paginate
watch(
    () => $slidev.nav.clicks,
    (newVal) => {
        if (paginatedReferences.value.length > 1) {
            const maxPage = paginatedReferences.value.length - 1
            const currentIndex = Math.min(newVal, maxPage)

            if (currentIndex < 0) {
                $slidev.nav.clicks = 0
            } else if (currentIndex > maxPage) {
                $slidev.nav.clicks = maxPage
            }
        }
    },
)
</script>

<template>
    <div class="neversink-biblio">
        <h2 v-if="title" class="neversink-biblio-title">{{ title }}</h2>
        <div
            v-if="enrichedPaginatedReferences.length === 0 || (enrichedPaginatedReferences.length === 1 && enrichedPaginatedReferences[0].length === 0)"
            class="neversink-biblio-empty"
        >
            No references found.
        </div>
        <template v-else>
            <ul
                class="neversink-biblio-list"
                v-for="(page, pageIndex) in enrichedPaginatedReferences"
                :key="pageIndex"
                v-show="$slidev.nav.clicks === pageIndex"
            >
                <li
                    v-for="reference in page"
                    :key="reference.key"
                    class="neversink-biblio-item"
                    :class="{'neversink-biblio-item-error': reference.error}"
                    :data-key="reference.key"
                >
                    <div class="neversink-biblio-item-body">
                        <span
                            v-if="reference.title"
                            class="neversink-biblio-item-title"
                        >{{ reference.title }}</span>
                        <span
                            v-if="reference.author || reference.year"
                            class="neversink-biblio-item-meta"
                        >{{ reference.author }}<template v-if="reference.author && reference.year">, </template>{{ reference.year }}</span>
                        <span
                            class="neversink-biblio-item-full"
                            v-html="reference.fullCitation"
                        ></span>
                    </div>
                    <div
                        v-if="reference.pages && reference.pages.length"
                        class="neversink-biblio-pages"
                    >
                        <a
                            v-for="pg in reference.pages"
                            :key="pg"
                            class="neversink-biblio-page-link"
                            @click="$slidev.nav.go(pg)"
                        >{{ pg }}</a>
                    </div>
                </li>
            </ul>

            <div
                v-if="paginatedReferences.length > 1"
                class="neversink-biblio-pagination"
            >
                <span class="neversink-biblio-page-info">
                    Page {{ $slidev.nav.clicks + 1 }} of
                    {{ paginatedReferences.length }}
                </span>
                <div class="neversink-biblio-page-dots">
                    <span
                        v-for="(_, index) in paginatedReferences"
                        :key="index"
                        class="neversink-biblio-page-dot"
                        :class="{active: $slidev.nav.clicks === index}"
                    ></span>
                </div>
            </div>

            <!-- Add hidden divs for clickable pagination -->
            <div v-if="paginatedReferences.length > 1">
                <div
                    v-for="index in paginatedReferences.length - 1"
                    :key="index"
                    v-click
                ></div>
            </div>
        </template>
    </div>
</template>

<style>
.neversink-biblio {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    font-size: 0.85em;
}

.neversink-biblio-title {
    margin-bottom: 0.6em;
    font-size: 1.1em;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--neversink-text-color, #333), transparent 30%);
}

.neversink-biblio-empty {
    padding: 2em 1em;
    text-align: center;
    font-style: italic;
    opacity: 0.5;
    font-size: 0.9em;
}

.neversink-biblio-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.45em;
}

/* --- Each reference is a card --- */
.neversink-biblio-item {
    display: flex;
    align-items: stretch;
    gap: 0;
    border-radius: 8px;
    border: 1px solid color-mix(in srgb, var(--neversink-text-color, #333), transparent 88%);
    overflow: hidden;
    transition: box-shadow 0.15s ease;
    line-height: 1.5;
}

.neversink-biblio-item:hover {
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.04),
        0 4px 12px rgba(0, 0, 0, 0.06);
}

.neversink-biblio-item-error {
    border-color: color-mix(in srgb, var(--neversink-red-color, #c0392b), transparent 70%);
}

/* Main body column */
.neversink-biblio-item-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0.4em 0.7em;
    min-width: 0;
}

.neversink-biblio-item-title {
    font-weight: 600;
    font-size: 0.88em;
    line-height: 1.35;
    color: var(--neversink-text-color);
}

.neversink-biblio-item-meta {
    font-size: 0.78em;
    color: color-mix(in srgb, var(--neversink-text-color, #333), transparent 40%);
    margin-top: 0.05em;
}

.neversink-biblio-item-full {
    font-size: 0.75em;
    line-height: 1.5;
    color: color-mix(in srgb, var(--neversink-text-color, #333), transparent 30%);
    margin-top: 0.2em;
}

/* Page back-links column */
.neversink-biblio-pages {
    display: flex;
    align-items: center;
    gap: 0.25em;
    flex-shrink: 0;
    padding: 0.4em 0.6em;
    border-left: 1px solid color-mix(in srgb, var(--neversink-text-color, #333), transparent 92%);
    background: color-mix(in srgb, var(--neversink-text-color, #333), transparent 96%);
}

.neversink-biblio-page-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-decoration: none;
    font-size: 0.7em;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    min-width: 1.6em;
    height: 1.6em;
    border-radius: 4px;
    color: color-mix(in srgb, var(--neversink-text-color, #333), transparent 35%);
    background: transparent;
    transition:
        background 0.15s ease,
        color 0.15s ease;
}

.neversink-biblio-page-link:hover {
    background: color-mix(in srgb, var(--neversink-text-color, #333), transparent 88%);
    color: var(--neversink-text-color);
}

.neversink-biblio-item-error .neversink-biblio-item-title,
.neversink-biblio-item-error .neversink-biblio-item-full {
    color: var(--neversink-red-color, #c0392b);
}

.neversink-biblio-item-error .neversink-biblio-keylabel {
    color: var(--neversink-red-color, #c0392b);
    background: color-mix(in srgb, var(--neversink-red-color, #c0392b), transparent 90%);
}

/* --- Pagination --- */
.neversink-biblio-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.8em;
    margin-top: 0.75em;
}

.neversink-biblio-page-info {
    font-size: 0.72em;
    opacity: 0.4;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-variant-numeric: tabular-nums;
}

.neversink-biblio-page-dots {
    display: flex;
    gap: 5px;
}

.neversink-biblio-page-dot {
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: var(--neversink-text-color, #333);
    opacity: 0.15;
    transition: opacity 0.2s ease;
}

.neversink-biblio-page-dot.active {
    opacity: 0.65;
}
</style>
