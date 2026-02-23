import {defineConfig} from "vite"
import {citationPlugin} from "./plugins/citation"

export default defineConfig({
    plugins: [citationPlugin()],
})
