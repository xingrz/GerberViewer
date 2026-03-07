import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Force browser polyfills instead of Vite's Node built-in externalization.
      util: 'util/',
      process: 'process/browser',
      buffer: 'buffer/',
      events: 'events/',
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  plugins: [vue()],
});
