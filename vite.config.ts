import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Rotate URLs once to bypass any HTML cached under the previous immutable asset URLs.
    // Keep this namespace stable: content hashes handle subsequent deployments.
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-delivery-[hash].js',
        chunkFileNames: 'assets/[name]-delivery-[hash].js',
        assetFileNames: 'assets/[name]-delivery-[hash][extname]',
      },
    },
  },
});
