import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
  define: {
    'global': {},
    'process.env': {},
  },
  plugins: [
    vue(),
    splitVendorChunkPlugin(),
  ],
});
