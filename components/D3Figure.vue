<script setup>
import {computed, ref, onMounted, onBeforeUnmount, watch} from "vue"
import * as d3 from "d3"

const props = defineProps({
    src: {
        type: String,
        default: null,
        description: "URL to a JavaScript file with D3 visualization code",
    },
    data: {
        type: [Array, Object],
        default: () => [],
        description: "Data to be visualized",
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
        default: "360px",
    },
    margin: {
        type: Object,
        default: () => ({top: 20, right: 20, bottom: 30, left: 40}),
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

const emit = defineEmits(["initialized", "updated", "error"])

// Reference to the D3 container
const d3Container = ref(null)
const resizeObserver = ref(null)
const isInitialized = ref(false)
const visualizationInstance = ref(null)

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

// Clean up function for the D3 visualization
const cleanupVisualization = () => {
    if (d3Container.value) {
        // Remove all child elements
        d3.select(d3Container.value).selectAll("*").remove()
    }
}

// Update visualization size on resize
const handleResize = () => {
    if (!d3Container.value || !isInitialized.value) return

    // Call any resize handler provided by the visualization
    if (
        visualizationInstance.value &&
        typeof visualizationInstance.value.resize === "function"
    ) {
        visualizationInstance.value.resize()
    } else {
        // Default resize behavior is to re-render
        renderVisualization()
    }
}

// Get the D3 context for the visualization
const getD3Context = () => {
    if (!d3Container.value) return null

    const width = d3Container.value.clientWidth
    const height = d3Container.value.clientHeight
    const fontFamily = getCurrentFontFamily()

    const container = d3.select(d3Container.value)

    // Clear any existing content
    container.selectAll("*").remove()

    return {
        d3,
        container,
        width,
        height,
        margin: props.margin,
        fontFamily,
        data: props.data,
    }
}

// Render the visualization
const renderVisualization = async () => {
    if (!d3Container.value) return

    try {
        // Get the D3 context
        const context = getD3Context()
        if (!context) return

        // If a src is provided, load and execute that script
        if (props.src) {
            try {
                // Make the module URL absolute if it's relative
                const moduleUrl =
                    props.src.startsWith("http") || props.src.startsWith("/")
                        ? props.src
                        : `/${props.src}`

                // Dynamically import the visualization module
                const visualizationModule = await import(
                    /* @vite-ignore */ moduleUrl
                )

                // Initialize the visualization
                if (typeof visualizationModule.default === "function") {
                    visualizationInstance.value =
                        visualizationModule.default(context)
                    isInitialized.value = true
                    emit("initialized", visualizationInstance.value)
                } else {
                    console.error(
                        "D3 visualization module does not export a default function",
                    )
                    emit("error", new Error("Invalid D3 visualization module"))
                }
            } catch (error) {
                console.error("Error loading D3 visualization:", error)
                emit("error", error)
            }
        } else {
            // Use the default slot for custom visualization code
            // The slot content will be responsible for creating the visualization
            isInitialized.value = true
            emit("initialized", context)
        }
    } catch (error) {
        console.error("Error rendering D3 visualization:", error)
        emit("error", error)
    }
}

// Initialize visualization when mounted
onMounted(() => {
    // Render the visualization
    renderVisualization()

    // Set up resize observer
    resizeObserver.value = new ResizeObserver(handleResize)
    if (d3Container.value) {
        resizeObserver.value.observe(d3Container.value)
    }
})

// Clean up when unmounting
onBeforeUnmount(() => {
    // Clean up resize observer
    if (resizeObserver.value) {
        resizeObserver.value.disconnect()
    }

    // Clean up visualization
    cleanupVisualization()
})

// Watch for changes to relevant props and re-render
watch(
    [() => props.src, () => props.data, () => props.width, () => props.height],
    () => {
        renderVisualization()
    },
)

// Helper function to make D3 context available to slots
const getContext = () => {
    return {
        d3,
        container: d3Container.value ? d3.select(d3Container.value) : null,
        width: d3Container.value ? d3Container.value.clientWidth : 0,
        height: d3Container.value ? d3Container.value.clientHeight : 0,
        margin: props.margin,
        fontFamily: getCurrentFontFamily(),
        data: props.data,
    }
}

// Expose the D3 container and context to the parent component
defineExpose({
    d3Container,
    getContext,
    renderVisualization,
})
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
                ref="d3Container"
                :class="[
                    usesFigureStyling
                        ? 'figure-content d3-content'
                        : 'd3-standalone',
                ]"
                :style="!usesFigureStyling ? containerStyle : {}"
            >
                <!-- This is where D3 will render the visualization -->
                <slot
                    name="visualization"
                    :d3="d3"
                    :container="d3Container ? d3.select(d3Container) : null"
                    :width="d3Container ? d3Container.clientWidth : 0"
                    :height="d3Container ? d3Container.clientHeight : 0"
                    :margin="props.margin"
                    :data="props.data"
                ></slot>
            </div>
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

.d3-content {
    height: 100%;
    min-height: 300px;
}

.d3-standalone {
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
