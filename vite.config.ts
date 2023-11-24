import { defineConfig } from 'vite'

export default defineConfig({
    logLevel: "info", //"warn", "error", "info", "silent"
    test: {
        testTimeout: 10000,
        reporters: ['default', 'html']
    },
})