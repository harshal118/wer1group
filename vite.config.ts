import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Recovery release: bypass both legacy and delivery-era poisoned browser asset URLs.
    // Keep this namespace stable: content hashes handle subsequent deployments.
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-recovery-20261016-[hash].js',
        chunkFileNames: 'assets/[name]-recovery-20261016-[hash].js',
        assetFileNames: 'assets/[name]-recovery-20261016-[hash][extname]',
      },
    },
  },
});
