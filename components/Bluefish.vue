<template>
    <div ref="container" :class="props.class" />
</template>

<script setup lang="ts">
import * as bf from "bluefish-js"
import {render, type Child} from "bluefish-js"
import {computed, onBeforeUnmount, onMounted, ref} from "vue"

type Props = {
    app?: (bf: typeof import("bluefish-js")) => Child | Child[]
    src?: string
    class?: string | string[] | object
}
const props = defineProps<Props>()
const srcModule = computed(() => {
    if (!props.src) return undefined

    let resolvedSrc: string
    if (props.src.startsWith("/")) {
        if (!props.src.startsWith("/bluefish/"))
            throw new Error(
                "Bluefish: src prop must start with '/bluefish/' if absolute.",
            )
        resolvedSrc = props.src
    } else {
        resolvedSrc = `/bluefish/${props.src}`
    }

    const modules = import.meta.glob("/bluefish/**/*.js", {eager: true})
    const module = modules[resolvedSrc]
    if (module === undefined)
        throw new Error(
            `Bluefish: src prop '${props.src}' (resolved to ${resolvedSrc}) not found in /bluefish/ directory.`,
        )
    return module
})

// Create a ref for the mount point and a variable to hold the cleanup function
const container = ref<HTMLElement | null>(null)
let dispose: VoidFunction

// Load the external app function or use the direct app prop
const loadAppFunction = async () => {
    // If app prop is provided, use it directly
    if (props.app) return props.app

    // If src is provided, dynamically import the module
    if (srcModule.value !== undefined) {
        try {
            return srcModule.value.default
        } catch (error) {
            console.error(
                `Failed to load Bluefish diagram from ${props.src}:`,
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
