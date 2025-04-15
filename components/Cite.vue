<script setup>
import {ref, computed, watch, onMounted} from "vue"
import {useSlideContext} from "@slidev/client"
import {citationState} from "./CiteEngine"

const {$slidev, $route, $frontmatter} = useSlideContext()
const props = defineProps({
    citeKey: {
        type: String,
        required: true,
    },
    bib: {
        type: String,
        default: null,
    },
})

const currentPage = ref($route.no)
const citation = ref(null)
const isLoading = ref(true)
const hasError = ref(false)

// Combine configuration from different sources
const config = computed(() => {
    return {
        ...citationState.defaultConfig,
        ...$slidev.configs?.biblio,
        ...$frontmatter?.biblio,
    }
})

// Create the tooltip and citation display
const tooltipText = computed(() => {
    if (!citation.value) return ""
    if (citation.value.error) return `Citation not found: ${props.citeKey}`
    return citation.value.fullCitation
})

const displayText = computed(() => {
    if (!citation.value) return `[${props.citeKey}]`
    if (citation.value.error) return `[${props.citeKey}?]`

    if (config.value.numericalRefs) {
        return `[${citationState.state.citationsIndex[props.citeKey]}]`
    } else {
        return citation.value.citation
    }
})

// Initialize citation engine and get citation data
onMounted(async () => {
    try {
        await citationState.init($slidev.configs)
        citationState.addCitation(props.citeKey, currentPage.value, props.bib)
        updateCitation()
        isLoading.value = false
    } catch (error) {
        console.error("Error initializing citation:", error)
        hasError.value = true
        isLoading.value = false
    }
})

// Update citation data when the citation state changes
watch(
    () => citationState.state.version.value,
    () => {
        updateCitation()
    },
)

function updateCitation() {
    citation.value = citationState.getCitation(props.citeKey)
    if (citation.value?.error) {
        hasError.value = true
    }
}
</script>

<template>
    <span
        class="neversink-cite"
        :class="{
            'neversink-cite-loading': isLoading,
            'neversink-cite-error': hasError,
        }"
        :data-key="props.citeKey"
    >
        <slot v-if="$slots.default"></slot>
        <span v-else class="neversink-cite-text" v-html="displayText"></span>
        <div class="neversink-cite-tooltip" v-html="tooltipText"></div>
    </span>
</template>

<style>
.neversink-cite {
    position: relative;
    cursor: pointer;
    display: inline-block;
    padding: 0 0.1em;
    transition: all 0.2s ease;
    border-radius: 2px;
    white-space: nowrap;
    text-decoration: none;
    color: var(--neversink-text-color);
    font-weight: 500;
}

.neversink-cite-text {
    font-size: 0.9em;
}

.neversink-cite-loading {
    opacity: 0.7;
}

.neversink-cite-error {
    color: var(--neversink-red-color, #d43c31);
    border-bottom: 1px dashed var(--neversink-red-color, #d43c31);
}

.neversink-cite-tooltip {
    visibility: hidden;
    position: absolute;
    z-index: 100;
    bottom: 130%;
    left: 0;
    transform: translateY(-10px);
    max-width: 500px;
    min-width: 300px;
    width: max-content;
    background-color: var(--neversink-bg-color);
    color: var(--neversink-text-color);
    border: 1px solid var(--neversink-border-color);
    border-left: 4px solid var(--neversink-border-color);
    border-radius: 6px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.25);
    padding: 1rem;
    font-size: 0.9rem;
    line-height: 1.5;
    font-weight: normal;
    text-align: left;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    pointer-events: none;
    transform-origin: bottom left;
    word-break: normal;
    overflow-wrap: break-word;
    white-space: normal;
}

.neversink-cite-tooltip:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 20px;
    margin-left: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: var(--neversink-bg-color) transparent transparent transparent;
    filter: drop-shadow(0 2px 1px rgba(0, 0, 0, 0.1));
}

.neversink-cite:hover {
    background-color: color-mix(
        in srgb,
        var(--neversink-border-color),
        transparent 80%
    );
}

.neversink-cite:hover .neversink-cite-tooltip {
    visibility: visible;
    opacity: 1;
    bottom: 140%;
    transform: translateY(0);
}

/* Right-side adjustment to prevent overflow */
.neversink-cite:has(.neversink-cite-tooltip:hover) {
    position: relative;
}

@media (max-width: 640px) {
    .neversink-cite-tooltip {
        max-width: 90vw;
        min-width: 200px;
        left: 0;
    }
}

/* Prevent tooltip from going off-screen on right side */
.neversink-cite:hover .neversink-cite-tooltip {
    max-width: min(500px, calc(100vw - 20px));
    left: max(0px, min(0px, calc(100vw - 100% - 520px)));
}
</style>
