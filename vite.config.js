import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import cesium from 'vite-plugin-cesium'

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            //ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        cesium({
            rebuildCesium: true
        }),
    ],
});
