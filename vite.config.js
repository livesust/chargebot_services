import { defineConfig } from 'vite';
export default defineConfig({
    logLevel: "info",
    test: {
        testTimeout: 10000,
        reporters: ['default', 'html']
    },
});
