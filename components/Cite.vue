<script setup>
import {ref, computed, onBeforeUnmount} from "vue"
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

// Teleported tooltip: positioned with fixed coordinates at body level
const citeRef = ref(null)
const showTooltip = ref(false)
const tooltipStyle = ref({})

// Parse a CSS color string to RGB values (supports hex, rgb(), rgba())
function parseColor(color) {
    const el = document.createElement('div')
    el.style.color = color
    document.body.appendChild(el)
    const computed = getComputedStyle(el).color
    document.body.removeChild(el)
    const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (match) return { r: +match[1], g: +match[2], b: +match[3] }
    return null
}

// Relative luminance per WCAG 2.0
function luminance({ r, g, b }) {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function onMouseEnter() {
    const el = citeRef.value
    if (!el) return

    const elRect = el.getBoundingClientRect()
    const container = el.closest('.slidev-layout') || el.closest('.slidev-page')
    const containerRect = container?.getBoundingClientRect()

    // Determine if tooltip should appear below (when citation is near top of slide)
    let placeBelow = false
    if (containerRect) {
        const relativeTop = elRect.top - containerRect.top
        placeBelow = relativeTop < containerRect.height * 0.25
    }

    const tooltipWidth = 520
    const gap = 12
    const viewportPad = 16

    // Vertical position
    let top, bottom
    if (placeBelow) {
        top = `${elRect.bottom + gap}px`
        bottom = 'auto'
    } else {
        top = 'auto'
        bottom = `${window.innerHeight - elRect.top + gap}px`
    }

    // Horizontal: center on the pill, clamp within viewport
    let left = elRect.left + elRect.width / 2 - tooltipWidth / 2
    if (left < viewportPad) left = viewportPad
    if (left + tooltipWidth > window.innerWidth - viewportPad) {
        left = window.innerWidth - viewportPad - tooltipWidth
    }

    // Capture theme background from the slide container. Then compute a
    // high-contrast text color based on the background luminance instead of
    // using the theme's text color (which can be low-contrast on colored slides).
    const style = {
        position: 'fixed',
        top,
        bottom,
        left: `${left}px`,
        width: `${tooltipWidth}px`,
    }

    if (container) {
        const cs = getComputedStyle(container)
        const bgColor = cs.getPropertyValue('--neversink-bg-color').trim()
        if (bgColor) {
            style['--tt-bg'] = bgColor
            const rgb = parseColor(bgColor)
            if (rgb) {
                const lum = luminance(rgb)
                // Pick dark or light text for maximum contrast
                style['--tt-text'] = lum > 0.4 ? '#1a1a1a' : '#f0f0f0'
                style['--tt-text-secondary'] = lum > 0.4 ? '#444' : '#ccc'
                style['--tt-text-tertiary'] = lum > 0.4 ? '#666' : '#aaa'
                style['--tt-border'] = lum > 0.4 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.15)'
                style['--tt-footer-bg'] = lum > 0.4 ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.08)'
                style['--tt-footer-border'] = lum > 0.4 ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'
            }
        }
    }

    tooltipStyle.value = style
    showTooltip.value = true
}

function onMouseLeave() {
    showTooltip.value = false
}

onBeforeUnmount(() => {
    showTooltip.value = false
})
</script>

<template>
    <span
        ref="citeRef"
        class="neversink-cite"
        :class="{ 'neversink-cite-error': hasError }"
        :data-key="props.citeKey"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <slot v-if="$slots.default"></slot>
        <span v-else class="neversink-cite-text" v-html="displayText"></span>

        <Teleport to="body">
            <Transition name="neversink-cite-fade">
                <div
                    v-if="showTooltip && citation && !citation.error"
                    class="neversink-cite-tooltip"
                    :style="tooltipStyle"
                >
                    <span class="neversink-cite-tooltip-title" v-if="citation.title">{{ citation.title }}</span>
                    <span class="neversink-cite-tooltip-meta" v-if="citation.author || citation.year">{{ citation.author }}<template v-if="citation.author && citation.year">, </template>{{ citation.year }}</span>
                    <span class="neversink-cite-tooltip-full" v-html="citation.fullCitation"></span>
                </div>
                <div
                    v-else-if="showTooltip && citation?.error"
                    class="neversink-cite-tooltip neversink-cite-tooltip--error"
                    :style="tooltipStyle"
                >
                    <span class="neversink-cite-tooltip-full">Citation not found: {{ props.citeKey }}</span>
                </div>
            </Transition>
        </Teleport>
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

/* --- Tooltip card (teleported to body) --- */
.neversink-cite-tooltip {
    z-index: 10000;
    max-width: 560px;
    min-width: 340px;
    background: var(--tt-bg, #fff);
    color: var(--tt-text, #1a1a1a);
    border: 1px solid var(--tt-border, rgba(0, 0, 0, 0.12));
    border-radius: 10px;
    box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.06),
        0 8px 24px rgba(0, 0, 0, 0.12);
    padding: 0;
    overflow: hidden;
    font-size: 1rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1.55;
    text-align: left;
    pointer-events: none;
    word-break: normal;
    overflow-wrap: break-word;
    white-space: normal;
    display: flex;
    flex-direction: column;
}

.neversink-cite-tooltip-title {
    display: block;
    padding: 1rem 1.25rem 0.2rem;
    font-weight: 600;
    font-size: 1.1rem;
    line-height: 1.4;
    color: var(--tt-text, #1a1a1a);
}

.neversink-cite-tooltip-meta {
    display: block;
    padding: 0.15rem 1.25rem 0.7rem;
    font-size: 0.95rem;
    color: var(--tt-text-secondary, #444);
    letter-spacing: 0.005em;
}

.neversink-cite-tooltip-full {
    display: block;
    padding: 0.75rem 1.25rem 0.85rem;
    font-size: 0.92rem;
    line-height: 1.55;
    color: var(--tt-text-tertiary, #666);
    background: var(--tt-footer-bg, rgba(0, 0, 0, 0.04));
    border-top: 1px solid var(--tt-footer-border, rgba(0, 0, 0, 0.08));
}

.neversink-cite-tooltip--error .neversink-cite-tooltip-full {
    color: #c0392b;
    background: rgba(192, 57, 43, 0.05);
    border-top: none;
    padding: 1rem 1.25rem;
    font-size: 0.95rem;
}

/* Transition */
.neversink-cite-fade-enter-active,
.neversink-cite-fade-leave-active {
    transition: opacity 0.15s ease;
}

.neversink-cite-fade-enter-from,
.neversink-cite-fade-leave-to {
    opacity: 0;
}

@media (max-width: 640px) {
    .neversink-cite-tooltip {
        max-width: 90vw;
        min-width: 180px;
    }
}
</style>
