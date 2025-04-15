<script setup>
import {ref, computed, watch, onMounted} from "vue"
import {useSlideContext} from "@slidev/client"
import {citationState} from "./CiteEngine"

const {$slidev, $route, $frontmatter} = useSlideContext()
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

const currentPage = ref($route.no)
const references = ref([])
const paginatedReferences = ref([])
const isLoading = ref(true)

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

// Initialize and load references
onMounted(async () => {
    try {
        await citationState.init($slidev.configs)
        updateReferences()
        isLoading.value = false
    } catch (error) {
        console.error("Error initializing bibliography:", error)
        isLoading.value = false
    }
})

// Update references when citation state changes
watch(
    () => citationState.state.version.value,
    () => {
        updateReferences()
    },
)

// Watch for click events to paginate
watch(
    () => $slidev.nav.clicks,
    (newVal) => {
        if (paginatedReferences.value.length > 0) {
            // Ensure we don't go beyond available pages
            const maxPage = paginatedReferences.value.length - 1
            const currentIndex = Math.min(newVal, maxPage)

            // Ensure clicks wrap around properly
            if (currentIndex < 0) {
                $slidev.nav.clicks = 0
            } else if (currentIndex > maxPage) {
                $slidev.nav.clicks = maxPage
            }
        }
    },
)

function updateReferences() {
    // Get all citations or just citations used in the presentation
    references.value = props.showAll
        ? citationState.getAllCitations()
        : Object.values(citationState.state.citations).filter(
              (c) => c.pages && c.pages.length > 0,
          )

    // Sort references by author name
    references.value.sort((a, b) => {
        if (a.author && b.author) {
            return a.author.localeCompare(b.author)
        }
        return 0
    })

    // Paginate references if needed
    if (maxItems.value > 0 && references.value.length > maxItems.value) {
        paginatedReferences.value = []

        for (let i = 0; i < references.value.length; i += maxItems.value) {
            paginatedReferences.value.push(
                references.value.slice(i, i + maxItems.value),
            )
        }
    } else {
        paginatedReferences.value = [references.value]
    }
}
</script>

<template>
    <div class="neversink-biblio">
        <h2 v-if="title" class="neversink-biblio-title">{{ title }}</h2>
        <div class="neversink-biblio-loading" v-if="isLoading">
            Loading references...
        </div>
        <div
            v-else-if="paginatedReferences.length === 0"
            class="neversink-biblio-empty"
        >
            No references found.
        </div>
        <template v-else>
            <ul
                class="neversink-biblio-list"
                v-for="(page, pageIndex) in paginatedReferences"
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
                    <span
                        v-if="config.numericalRefs"
                        class="neversink-biblio-number"
                    >
                        [{{
                            citationState.state.citationsIndex[reference.key]
                        }}]
                    </span>
                    <span v-else class="neversink-biblio-key"
                        >[{{ reference.key }}]</span
                    >
                    <span
                        class="neversink-biblio-text"
                        v-html="reference.fullCitation"
                    ></span>
                    <span
                        v-if="reference.pages && reference.pages.length"
                        class="neversink-biblio-pages"
                    >
                        (Pages:
                        <template
                            v-for="(page, index) in reference.pages"
                            :key="page"
                        >
                            <span v-if="index > 0">, </span>
                            <a
                                class="neversink-biblio-page-link"
                                @click="$slidev.nav.go(page)"
                                >{{ page }}</a
                            >
                        </template>
                        )
                    </span>
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
    font-size: 0.9em;
}

.neversink-biblio-title {
    margin-bottom: 1em;
    font-size: 1.5em;
    font-weight: 600;
}

.neversink-biblio-loading,
.neversink-biblio-empty {
    padding: 1em;
    text-align: center;
    font-style: italic;
    opacity: 0.7;
}

.neversink-biblio-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.neversink-biblio-item {
    margin-bottom: 0.9em;
    padding: 0.5em 0.7em;
    border-radius: 4px;
    background-color: color-mix(
        in srgb,
        var(--neversink-bg-color),
        transparent 90%
    );
    border-left: 3px solid var(--neversink-border-color);
    transition: all 0.2s ease;
    line-height: 1.4;
    display: flex;
    flex-wrap: wrap;
}

.neversink-biblio-item:hover {
    background-color: color-mix(
        in srgb,
        var(--neversink-border-color),
        transparent 90%
    );
    transform: translateX(3px);
}

.neversink-biblio-item-error {
    border-left-color: var(--neversink-red-color, #d43c31);
    color: var(--neversink-red-color, #d43c31);
}

.neversink-biblio-number,
.neversink-biblio-key {
    font-weight: 600;
    margin-right: 0.5em;
    min-width: 40px;
}

.neversink-biblio-text {
    flex: 1;
}

.neversink-biblio-pages {
    font-size: 0.85em;
    margin-left: 0.5em;
    opacity: 0.7;
}

.neversink-biblio-page-link {
    cursor: pointer;
    text-decoration: underline;
    color: var(--neversink-text-color);
}

.neversink-biblio-page-link:hover {
    color: var(--neversink-accent-color, #42b883);
}

.neversink-biblio-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1em;
}

.neversink-biblio-page-info {
    font-size: 0.85em;
    opacity: 0.7;
}

.neversink-biblio-page-dots {
    display: flex;
    gap: 6px;
}

.neversink-biblio-page-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--neversink-border-color);
    opacity: 0.3;
    transition: opacity 0.2s ease;
}

.neversink-biblio-page-dot.active {
    opacity: 1;
    background-color: var(--neversink-accent-color, #42b883);
}
</style>
