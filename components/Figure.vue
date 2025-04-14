<script setup>
import { computed, ref, onMounted, watch } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '100%',
  },
  type: {
    type: String,
    default: 'image', // 'image' or 'video'
    validator: (value) => ['image', 'video'].includes(value)
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
  color: {
    type: String,
    default: 'light',
  },
})

// Reference to video element for progress tracking
const videoRef = ref(null)
const progressValue = ref(0)
const isPlaying = ref(false)

// For the color scheme
const colorscheme = computed(() => {
  return `neversink-${props.color}-scheme`
})

// Update progress bar when video is playing
const updateProgress = () => {
  if (videoRef.value) {
    progressValue.value = (videoRef.value.currentTime / videoRef.value.duration) * 100
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

// Set up video element after mounting
onMounted(() => {
  if (props.type === 'video' && videoRef.value) {
    // Set autoplay and loop attributes if needed
    if (props.autostart) {
      videoRef.value.autoplay = true
      isPlaying.value = true
    }

    if (props.repeat) {
      videoRef.value.loop = true
    }

    // Add event listeners for progress tracking
    if (props.progress) {
      videoRef.value.addEventListener('timeupdate', updateProgress)
    }

    // Add event listeners for play/pause state
    videoRef.value.addEventListener('play', () => {
      isPlaying.value = true
    })

    videoRef.value.addEventListener('pause', () => {
      isPlaying.value = false
    })

    videoRef.value.addEventListener('ended', () => {
      isPlaying.value = false
      if (props.progress) {
        progressValue.value = 0
      }
    })
  }
})

// Clean up event listeners
const cleanupListeners = () => {
  if (props.type === 'video' && videoRef.value && props.progress) {
    videoRef.value.removeEventListener('timeupdate', updateProgress)
  }
}

// Watch for changes to the src or type props
watch(() => props.src, cleanupListeners)
watch(() => props.type, cleanupListeners)
</script>

<template>
  <div class="figure-container" :style="{ width: props.width }" :class="colorscheme">
    <div class="figure-content-wrapper">
      <!-- Image content -->
      <img v-if="props.type === 'image'" :src="props.src" class="figure-content" />

      <!-- Video content -->
      <div v-else-if="props.type === 'video'" class="video-wrapper">
        <video
          ref="videoRef"
          :src="props.src"
          class="figure-content"
          @click="togglePlay"
          :autoplay="props.autostart"
          :loop="props.repeat"
        ></video>

        <!-- Progress bar for video -->
        <div v-if="props.progress" class="progress-container">
          <div class="progress-bar" :style="{ width: `${progressValue}%` }"></div>
        </div>
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
  transition: width 0.1s ease;
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
