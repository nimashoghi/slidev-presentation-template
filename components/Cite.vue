<script setup>
import {ref, computed} from "vue"
import {useSlideContext} from "@slidev/client"
import {citationState} from "./CiteEngine"

const {$slidev, $route, $frontmatter} = useSlideContext()
const props = defineProps({
    citeKey: {
        type: String,
        required: true,
    },
})

const currentPage = $route.no

// Track this citation on the current page (synchronous, runs at setup time)
citationState.trackPage(props.citeKey, currentPage)

// Combine configuration from different sources
const config = computed(() => {
    return {
        ...citationState.defaultConfig,
        ...$slidev.configs?.biblio,
        ...$frontmatter?.biblio,
    }
})

// Synchronous citation lookup — no loading state needed
const citation = computed(() => citationState.getCitation(props.citeKey))

const hasError = computed(() => citation.value?.error)

const displayText = computed(() => {
    if (citation.value?.error) return `[${props.citeKey}?]`

    if (config.value.numericalRefs) {
        return `[${citationState.citationsIndex[props.citeKey]}]`
    } else {
        return citation.value.citation
    }
})

// Tooltip positioning: detect vertical/horizontal placement within the slide
const citeRef = ref(null)
const tooltipBelow = ref(false)
const tooltipLeft = ref('0px')

function onMouseEnter() {
    const el = citeRef.value
    if (!el) return
    const container = el.closest('.slidev-layout') || el.closest('.slidev-page')
    if (!container) {
        tooltipBelow.value = false
        return
    }

    const elRect = el.getBoundingClientRect()
    const containerRect = container.getBoundingClientRect()

    // Vertical: flip below if citation is in the top 25% of the slide
    const relativeTop = elRect.top - containerRect.top
    tooltipBelow.value = relativeTop < containerRect.height * 0.25

    // Horizontal: center the tooltip on the pill, but clamp within the slide
    const tooltip = el.querySelector('.neversink-cite-tooltip')
    if (!tooltip) return

    const tooltipWidth = tooltip.offsetWidth || 350
    const elLeft = elRect.left - containerRect.left
    const elCenterX = elLeft + elRect.width / 2
    const containerWidth = containerRect.width
    // Account for Slidev's CSS transform scaling
    const scale = containerRect.width / container.offsetWidth
    const pad = 12

    // Ideal: center tooltip on the pill
    let idealLeft = elCenterX - tooltipWidth * scale / 2

    // Clamp so tooltip stays within the slide container
    if (idealLeft < pad) idealLeft = pad
    if (idealLeft + tooltipWidth * scale > containerWidth - pad) {
        idealLeft = containerWidth - pad - tooltipWidth * scale
    }

    // Convert to a left offset relative to the cite element (in unscaled coords)
    tooltipLeft.value = `${(idealLeft - elLeft) / scale}px`
}
</script>

<template>
    <span
        ref="citeRef"
        class="neversink-cite"
        :class="{
            'neversink-cite-error': hasError,
            'neversink-cite--below': tooltipBelow,
        }"
        :data-key="props.citeKey"
        @mouseenter="onMouseEnter"
    >
        <slot v-if="$slots.default"></slot>
        <span v-else class="neversink-cite-text" v-html="displayText"></span>
        <div v-if="citation && !citation.error" class="neversink-cite-tooltip" :style="{ left: tooltipLeft }">
            <span class="neversink-cite-tooltip-title" v-if="citation.title">{{ citation.title }}</span>
            <span class="neversink-cite-tooltip-meta" v-if="citation.author || citation.year">{{ citation.author }}<template v-if="citation.author && citation.year">, </template>{{ citation.year }}</span>
            <span class="neversink-cite-tooltip-full" v-html="citation.fullCitation"></span>
        </div>
        <div v-else-if="citation?.error" class="neversink-cite-tooltip neversink-cite-tooltip--error" :style="{ left: tooltipLeft }">
            <span class="neversink-cite-tooltip-full">Citation not found: {{ props.citeKey }}</span>
        </div>
    </span>
</template>

<style>
.neversink-cite {
    position: relative;
    cursor: pointer;
    display: inline-block;
    white-space: nowrap;
    text-decoration: none;
    vertical-align: baseline;
}

.neversink-cite-text {
    display: inline-block;
    font-size: 0.72em;
    font-weight: 500;
    letter-spacing: 0.01em;
    color: color-mix(in oklch, var(--neversink-text-color, #333) 45%, #2563eb);
    background: color-mix(in oklch, var(--neversink-text-color, #333) 8%, #2563eb 6%);
    padding: 0.1em 0.5em 0.15em;
    border-radius: 999px;
    line-height: 1.5;
    vertical-align: 0.15em;
    transition:
        background 0.2s ease,
        color 0.2s ease,
        box-shadow 0.2s ease;
}

.neversink-cite:hover .neversink-cite-text {
    color: color-mix(in oklch, var(--neversink-text-color, #333) 25%, #2563eb);
    background: color-mix(in oklch, var(--neversink-text-color, #333) 6%, #2563eb 12%);
    box-shadow: 0 0 0 1px color-mix(in oklch, var(--neversink-text-color, #333) 15%, #2563eb 18%);
}

.neversink-cite-error .neversink-cite-text {
    color: var(--neversink-red-color, #c0392b);
    background: color-mix(in srgb, var(--neversink-red-color, #c0392b), transparent 90%);
}

.neversink-cite:hover .neversink-cite-error .neversink-cite-text {
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--neversink-red-color, #c0392b), transparent 70%);
}

/* --- Tooltip card --- */
.neversink-cite-tooltip {
    visibility: hidden;
    position: absolute;
    z-index: 100;
    bottom: calc(100% + 10px);
    left: 0;
    transform: translateY(4px);
    max-width: 400px;
    min-width: 240px;
    width: max-content;
    background: var(--neversink-bg-color, #fff);
    color: var(--neversink-text-color);
    border: 1px solid color-mix(in srgb, var(--neversink-text-color, #333), transparent 88%);
    border-radius: 8px;
    box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.04),
        0 4px 16px rgba(0, 0, 0, 0.08);
    padding: 0;
    overflow: hidden;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.55;
    text-align: left;
    opacity: 0;
    transition:
        opacity 0.18s ease,
        transform 0.18s ease,
        visibility 0s linear 0.18s;
    pointer-events: none;
    word-break: normal;
    overflow-wrap: break-word;
    white-space: normal;
    display: flex;
    flex-direction: column;
}

.neversink-cite:hover .neversink-cite-tooltip {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
    transition:
        opacity 0.18s ease,
        transform 0.18s ease,
        visibility 0s linear 0s;
}

/* Flip tooltip below when near top of slide */
.neversink-cite--below .neversink-cite-tooltip {
    bottom: auto;
    top: calc(100% + 10px);
    transform: translateY(-4px);
}

.neversink-cite--below:hover .neversink-cite-tooltip {
    transform: translateY(0);
}

.neversink-cite-tooltip-title {
    display: block;
    padding: 0.65rem 0.85rem 0.1rem;
    font-weight: 600;
    font-size: 0.82rem;
    line-height: 1.4;
    color: var(--neversink-text-color);
}

.neversink-cite-tooltip-meta {
    display: block;
    padding: 0.1rem 0.85rem 0.5rem;
    font-size: 0.72rem;
    color: color-mix(in srgb, var(--neversink-text-color, #333), transparent 40%);
    letter-spacing: 0.005em;
}

.neversink-cite-tooltip-full {
    display: block;
    padding: 0.5rem 0.85rem 0.6rem;
    font-size: 0.7rem;
    line-height: 1.55;
    color: color-mix(in srgb, var(--neversink-text-color, #333), transparent 25%);
    background: color-mix(in srgb, var(--neversink-text-color, #333), transparent 96%);
    border-top: 1px solid color-mix(in srgb, var(--neversink-text-color, #333), transparent 92%);
}

.neversink-cite-tooltip--error .neversink-cite-tooltip-full {
    color: var(--neversink-red-color, #c0392b);
    background: color-mix(in srgb, var(--neversink-red-color, #c0392b), transparent 95%);
    border-top: none;
    padding: 0.65rem 0.85rem;
    font-size: 0.75rem;
}

@media (max-width: 640px) {
    .neversink-cite-tooltip {
        max-width: 90vw;
        min-width: 180px;
    }
}
</style>
