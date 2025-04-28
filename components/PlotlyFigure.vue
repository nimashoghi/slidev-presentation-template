<script setup>
import {pathPrefix} from "@slidev/client"
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue"

const props = defineProps({
    src: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        default: "",
    },
    width: {
        type: String,
        default: null,
    },
    height: {
        type: String,
        default: null,
    },
    fontSize: {
        type: Number,
        default: 12,
    },
    color: {
        type: String,
        default: "light",
    },
    class: {
        type: [String, Array, Object],
        default: "",
    },
})

// Reference to the plot container
const plotDiv = ref(null)
const figure = ref(null)
const resizeObserver = ref(null)

// Create a proper URL that accounts for the base path
const resolvedSrc = computed(() => {
    // If src starts with 'http' or '//', it's already a full URL
    if (props.src.match(/^(https?:)?\/\//)) {
        return props.src
    }

    // If src starts with '/', it's a root-relative path that needs the base
    if (props.src.startsWith("/")) {
        return `${pathPrefix}${props.src.slice(1)}`
    }

    // Relative path (no leading slash)
    return props.src
})

// For the color scheme
const colorscheme = computed(() => {
    return `neversink-${props.color}-scheme`
})

// Computed style for container
const containerStyle = computed(() => {
    const style = {
        width: props.width || "100%",
        height: props.height,
    }
    return style
})

// Determine if we need to apply the figure container styling
const usesFigureStyling = computed(() => {
    return !!props.caption
})

// Get current font family
const getCurrentFontFamily = () => {
    const body = document.body
    return window.getComputedStyle(body).fontFamily
}

// Update plot config
const updatePlotConfig = (data, container) => {
    const fontFamily = getCurrentFontFamily()

    // update layout
    const layout = {
        ...data.layout,
        width: container.clientWidth,
        height: container.clientHeight,
        autosize: false,
        font: {
            ...data.layout?.font,
            family: fontFamily,
            size: props.fontSize,
        },
        xaxis: {
            ...data.layout?.xaxis,
            tickfont: {
                ...data.layout?.xaxis?.tickfont,
                size: props.fontSize,
            },
        },
        yaxis: {
            ...data.layout?.yaxis,
            tickfont: {
                ...data.layout?.yaxis?.tickfont,
                size: props.fontSize,
            },
        },
    }

    return {
        data: data.data,
        layout,
    }
}

// Update plot size
const updatePlotSize = () => {
    if (!plotDiv.value || !figure.value) return

    const container = plotDiv.value
    const updatedFigure = updatePlotConfig(figure.value, container)

    try {
        Plotly.react(container, updatedFigure.data, updatedFigure.layout, {
            responsive: true,
        })
    } catch (error) {
        console.error("Error updating plot size:", error)
    }
}

// Initialize plot
const initPlot = async () => {
    try {
        const container = plotDiv.value
        if (!container) return

        // Dynamically import Plotly only when needed
        const Plotly = await import("plotly.js-dist-min")

        // Use the resolved source URL that includes the base path
        const response = await fetch(resolvedSrc.value)
        const data = await response.json()
        figure.value = updatePlotConfig(data, container)

        await Plotly.newPlot(
            container,
            figure.value.data,
            figure.value.layout,
            {
                responsive: true,
            },
        )

        // observe resize
        if (resizeObserver.value) {
            resizeObserver.value.disconnect()
        }
        resizeObserver.value = new ResizeObserver(updatePlotSize)
        resizeObserver.value.observe(container)
    } catch (error) {
        console.error("Error loading plot:", error)
    }
}

// Watch for changes to props
watch(() => props.src, initPlot)
watch([() => props.fontSize, () => props.height, () => props.width], () => {
    if (figure.value && plotDiv.value) {
        const updatedFigure = updatePlotConfig(figure.value, plotDiv.value)

        try {
            if (typeof Plotly !== "undefined") {
                Plotly.react(
                    plotDiv.value,
                    updatedFigure.data,
                    updatedFigure.layout,
                    {
                        responsive: true,
                    },
                )
            }
        } catch (error) {
            console.error("Error updating plot:", error)
        }
    }
})

// Clean up
onBeforeUnmount(() => {
    if (resizeObserver.value) {
        resizeObserver.value.disconnect()
    }
})

onMounted(initPlot)
</script>

<template>
    <div
        :class="[
            usesFigureStyling ? 'figure-container' : '',
            colorscheme,
            props.class,
        ]"
        :style="usesFigureStyling ? containerStyle : {}"
    >
        <div :class="{'figure-content-wrapper': usesFigureStyling}">
            <div
                ref="plotDiv"
                :class="[
                    usesFigureStyling
                        ? 'figure-content plotly-content'
                        : 'plotly-standalone',
                ]"
                :style="!usesFigureStyling ? containerStyle : {}"
            ></div>
        </div>

        <!-- Caption -->
        <div v-if="props.caption" class="figure-caption">
            <p>{{ props.caption }}</p>
        </div>
    </div>
</template>

<style scoped>
.figure-container {
    font-family: var(--neversink-main-font);
    margin: 10px 0;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-radius: 6px;
    font-size: 0.85rem;
}

.figure-content-wrapper {
    width: 100%;
    background-color: white;
    position: relative;
}

.figure-content {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 6px 6px 0 0;
}

.plotly-content {
    height: 100%;
    min-height: 300px;
}

.plotly-standalone {
    display: inline-block;
    border-radius: 6px;
    overflow: hidden;
}

.figure-caption {
    padding: 8px 12px;
    background-color: var(--neversink-bg-color);
    color: var(--neversink-text-color);
    font-size: 0.85rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 0 0 6px 6px;
    text-align: center;
}

.figure-caption p {
    margin: 0;
}
</style>
