<template>
    <div class="export-links">
        <div v-if="showLinks" class="export-container">
            <a
                v-if="pdfAvailable"
                :href="pdfUrl"
                class="export-link"
                target="_blank"
                download
            >
                <span class="icon">📄</span> Download PDF
            </a>
            <a
                v-if="pptxAvailable"
                :href="pptxUrl"
                class="export-link"
                target="_blank"
                download
            >
                <span class="icon">📊</span> Download PPTX
            </a>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted} from "vue"

const showLinks = ref(false)
const pdfAvailable = ref(false)
const pptxAvailable = ref(false)

// Get the repository name from the URL path
const getRepoName = () => {
    const pathname = window.location.pathname
    const parts = pathname.split("/")
    // Typically the repo name is the first non-empty segment after the domain
    return parts.find((part) => part && part !== "")
}

const baseUrl = ref("")
const repoName = ref("")
const pdfUrl = ref("")
const pptxUrl = ref("")

onMounted(async () => {
    repoName.value = getRepoName() || "slidev-presentation-template"
    baseUrl.value = `/${repoName.value}/exports`

    // Set the URLs
    pdfUrl.value = `${baseUrl.value}/${repoName.value}.pdf`
    pptxUrl.value = `${baseUrl.value}/${repoName.value}.pptx`

    // Check if the exports actually exist
    try {
        // Check PDF availability
        const pdfResponse = await fetch(pdfUrl.value, {method: "HEAD"})
        pdfAvailable.value = pdfResponse.ok

        // Check PPTX availability
        const pptxResponse = await fetch(pptxUrl.value, {method: "HEAD"})
        pptxAvailable.value = pptxResponse.ok

        // Only show the export links if at least one format is available
        showLinks.value = pdfAvailable.value || pptxAvailable.value
    } catch (error) {
        // If there's an error checking, don't show the links
        console.error("Error checking export availability:", error)
        showLinks.value = false
    }
})
</script>

<style scoped>
.export-links {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 100;
}

.export-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.export-link {
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 4px;
    background-color: #f0f0f0;
    color: #333;
    text-decoration: none;
    font-size: 14px;
    transition: background-color 0.2s;
}

.export-link:hover {
    background-color: #e0e0e0;
}

.icon {
    margin-right: 6px;
}

/* Dark mode support */
.dark .export-container {
    background-color: rgba(30, 30, 30, 0.9);
}

.dark .export-link {
    background-color: #2a2a2a;
    color: #eee;
}

.dark .export-link:hover {
    background-color: #3a3a3a;
}
</style>
