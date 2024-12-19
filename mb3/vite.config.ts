import {defineConfig} from 'vite';
import {fileURLToPath, URL} from 'url';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    define: {
        'process.env.VITE_SIGNALING_SERVER_URL': JSON.stringify(process.env.VITE_SIGNALING_SERVER_URL),
    },
});
