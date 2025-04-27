<template>
    <!-- This div is where the Bluefish diagram will be injected -->
    <div ref="container" :class="props.class" />
</template>

<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount, computed} from "vue"
import {useSlideContext} from "@slidev/client"
import {render, type Child} from "bluefish-js"
import * as bf from "bluefish-js"

const {$route} = useSlideContext()

// Declare props: either app function or src to an external file
type Props = {
    app?: (bf: typeof import("bluefish-js")) => Child | Child[]
    src?: string
    class?: string | string[] | object
}
const props = defineProps<Props>()

// Create a ref for the mount point and a variable to hold the cleanup function
const container = ref<HTMLElement | null>(null)
let dispose: VoidFunction

// Create a proper URL that accounts for the base path for src prop
const resolvedSrc = computed(() => {
    if (!props.src) return null

    // If src starts with 'http' or '//', it's already a full URL
    if (props.src.match(/^(https?:)?\/\//)) return props.src

    // If src starts with '/', it's a root-relative path that needs the base
    if (props.src.startsWith("/"))
        return `${import.meta["env"].BASE_URL}${props.src.slice(1)}`

    // For relative paths (no leading slash), we want to resolve them relative to the current route.
    if ($route === undefined) {
        throw new Error(
            "Bluefish: Unable to resolve src path. $route is undefined.",
        )
    }

    const currentSlide = $route.meta.slide
    if (
        !currentSlide ||
        typeof currentSlide !== "object" ||
        !("filepath" in currentSlide) ||
        typeof currentSlide.filepath !== "string"
    ) {
        throw new Error(
            "Bluefish: Unable to resolve src path. Current slide does not have a filepath.",
        )
    }

    // Now, resolve the src relative to the current slide's filepath
    const currentSlidePath = currentSlide.filepath
    const currentSlideDir = currentSlidePath.substring(
        0,
        currentSlidePath.lastIndexOf("/"),
    )
    return `${currentSlideDir}/${props.src}`
})

// Load the external app function or use the direct app prop
const loadAppFunction = async () => {
    // If app prop is provided, use it directly
    if (props.app) return props.app

    // If src is provided, dynamically import the module
    if (resolvedSrc.value) {
        try {
            const module = await import(/* @vite-ignore */ resolvedSrc.value)
            // Use the default export which should be the app function
            return module.default
        } catch (error) {
            console.error(
                `Failed to load Bluefish diagram from ${resolvedSrc.value}:`,
                error,
            )
            return null
        }
    }

    return null
}

// On mount, call Bluefish's `render` with the app function and the container element
onMounted(async () => {
    if (!container.value) return

    const appFunction = await loadAppFunction()
    if (!appFunction) {
        console.error(
            "No app function available. Please provide either 'app' or 'src' prop.",
        )
        return
    }

    // Mount the diagram; returns a cleanup function
    dispose = render(() => appFunction(bf), container.value)
})

// Clean up when this component unmounts
onBeforeUnmount(() => {
    dispose?.()
})
</script>

<style scoped>
/* Optionally ensure the container fills its parent */
div[ref="container"] {
    width: 100%;
    height: 100%;
}
</style>
