<script setup>
import {computed, ref, onMounted, watch} from "vue"
import Cite from "./Cite.vue"

const props = defineProps({
    src: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        default: "",
    },
    captionType: {
        type: String,
        default: "text", // 'text' or 'template'
        validator: (value) => ["text", "template"].includes(value),
    },
    credits: {
        type: String,
        default: "",
    },
    creditsCiteKey: {
        type: String,
        default: "",
    },
    width: {
        type: String,
        default: null,
    },
    type: {
        type: String,
        default: "image", // 'image' or 'video'
        validator: (value) => ["image", "video"].includes(value),
    },
    autostart: {
        type: Boolean,
        default: false,
    },
    repeat: {
        type: Boolean,
        default: false,
    },
    progress: {
        type: Boolean,
        default: false,
    },
    pauseStart: {
        type: Number,
        default: 1500, // ms to pause on the first frame before playing
    },
    pauseEnd: {
        type: Number,
        default: 2000, // ms to pause on the last frame before looping
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

// Reference to video element for progress tracking
const videoRef = ref(null)
const progressValue = ref(0)
const isPlaying = ref(false)
let pauseTimer = null

// For the color scheme
const colorscheme = computed(() => {
    return `neversink-${props.color}-scheme`
})

// Computed style for container
const containerStyle = computed(() => {
    const style = {}
    if (props.width) {
        style.width = props.width
    }
    return style
})

// Determine if we need to apply the figure container styling
const usesFigureStyling = computed(() => {
    return (
        !!props.caption ||
        !!props.credits ||
        !!props.creditsCiteKey ||
        props.progress ||
        props.captionType === "template"
    )
})

// Update progress bar when video is playing
const updateProgress = () => {
    if (videoRef.value) {
        progressValue.value =
            (videoRef.value.currentTime / videoRef.value.duration) * 100
    }
}

// Handle video play/pause
const togglePlay = () => {
    if (videoRef.value) {
        if (videoRef.value.paused) {
            videoRef.value.play()
            isPlaying.value = true
        } else {
            videoRef.value.pause()
            isPlaying.value = false
        }
    }
}

// Start playback with pause-at-start delay
const startWithPause = () => {
    const video = videoRef.value
    if (!video) return

    video.currentTime = 0
    video.pause()

    pauseTimer = setTimeout(() => {
        video.play()
        isPlaying.value = true
    }, props.pauseStart)
}

// Set up video element after mounting
onMounted(() => {
    if (props.type === "video" && videoRef.value) {
        const video = videoRef.value

        // Never use native loop — we handle it manually with pauses
        video.loop = false

        // Add event listeners for progress tracking
        if (props.progress) {
            video.addEventListener("timeupdate", updateProgress)
        }

        // Add event listeners for play/pause state
        video.addEventListener("play", () => {
            isPlaying.value = true
        })

        video.addEventListener("pause", () => {
            isPlaying.value = false
        })

        // When video ends: pause on last frame, then loop back with start pause
        video.addEventListener("ended", () => {
            isPlaying.value = false
            if (props.repeat) {
                pauseTimer = setTimeout(() => {
                    startWithPause()
                }, props.pauseEnd)
            } else {
                if (props.progress) {
                    progressValue.value = 100
                }
            }
        })

        // Autostart with initial pause
        if (props.autostart) {
            startWithPause()
        }
    }
})

// Clean up event listeners and timers
const cleanupListeners = () => {
    if (pauseTimer) {
        clearTimeout(pauseTimer)
        pauseTimer = null
    }
    if (props.type === "video" && videoRef.value && props.progress) {
        videoRef.value.removeEventListener("timeupdate", updateProgress)
    }
}

// Watch for changes to the src or type props
watch(() => props.src, cleanupListeners)
watch(() => props.type, cleanupListeners)
</script>

<template>
    <div
        v-bind="$attrs"
        :class="[
            usesFigureStyling ? 'figure-container' : '',
            colorscheme,
            props.class,
        ]"
        :style="usesFigureStyling ? containerStyle : {}"
    >
        <div :class="{'figure-content-wrapper': usesFigureStyling}">
            <!-- Image content -->
            <img
                v-if="props.type === 'image'"
                :src="props.src"
                :class="[
                    usesFigureStyling ? 'figure-content' : '',
                    !usesFigureStyling ? props.class : '',
                ]"
                :style="
                    !usesFigureStyling && props.width
                        ? {width: props.width}
                        : {}
                "
            />

            <!-- Video content -->
            <div
                v-else-if="props.type === 'video'"
                :class="{'video-wrapper': usesFigureStyling}"
            >
                <video
                    ref="videoRef"
                    :src="props.src"
                    :class="[
                        usesFigureStyling ? 'figure-content' : '',
                        !usesFigureStyling ? props.class : '',
                    ]"
                    :style="
                        !usesFigureStyling && props.width
                            ? {width: props.width}
                            : {}
                    "
                    @click="togglePlay"
                ></video>

                <!-- Progress bar for video -->
                <div v-if="props.progress" class="progress-container">
                    <div
                        class="progress-bar"
                        :style="{width: `${progressValue}%`}"
                    ></div>
                </div>
            </div>
        </div>

        <!-- Caption with optional credits inline -->
        <div
            v-if="props.caption || props.captionType === 'template'"
            class="figure-caption"
        >
            <!-- Text caption mode -->
            <p v-if="props.captionType === 'text'">
                {{ props.caption }}
                <span v-if="props.credits" class="figure-credits-inline">
                    {{ props.credits }}
                </span>
                <span
                    v-else-if="props.creditsCiteKey"
                    class="figure-credits-inline"
                >
                    <Cite :citeKey="props.creditsCiteKey" />
                </span>
            </p>

            <!-- Template caption mode (custom HTML via slot) -->
            <div v-else-if="props.captionType === 'template'">
                <slot name="caption"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.figure-container {
    font-family: var(--neversink-main-font);
    margin: 10px 0;
    overflow: visible;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-radius: 6px;
    font-size: 0.85rem;
}

.figure-content-wrapper {
    width: 100%;
    background-color: white;
    position: relative;
    overflow: hidden;
    border-radius: 6px 6px 0 0;
}

.figure-content {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 6px 6px 0 0;
}

.video-wrapper {
    position: relative;
    width: 100%;
}

.video-wrapper .figure-content {
    cursor: pointer;
}

.progress-container {
    height: 4px;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.progress-bar {
    height: 100%;
    background-color: var(--neversink-highlight-color);
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.figure-caption {
    padding: 8px 12px;
    background-color: var(--neversink-bg-color);
    color: var(--neversink-text-color);
    font-size: 0.85rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    border-radius: 0 0 6px 6px;
    text-align: center;
    overflow: visible;
    position: relative;
}

.figure-caption p {
    margin: 0;
}

.figure-credits-inline {
    margin-left: 0.25em;
    font-size: 0.9em;
    opacity: 0.8;
    font-style: italic;
}

/* Styles for non-figure mode (when no caption or progress) */
div:not(.figure-container) > div:not(.figure-content-wrapper) > img,
div:not(.figure-container)
    > div:not(.figure-content-wrapper)
    > div:not(.video-wrapper)
    > video {
    display: inline-block;
    max-width: 100%;
    height: auto;
}
</style>
