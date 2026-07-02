import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './', 
  plugins: [
    react(),
    // De onstabiele nodePolyfills() plugin is hier verwijderd om de Windows-crash te voorkomen
  ],
  define: {
    // Dit vangt 'process.env' en 'global' native op voor bibliotheken die hierom vragen
    'process.env': {},
    'global': 'globalThis',
  },
  resolve: {
    alias: {
      // Dit mapt 'buffer' en 'process' rechtstreeks naar echte, fysieke ES6-bestanden in je node_modules.
      // Omdat dit echte bestandspaden zijn, zal Vite 6 ze tijdens 'build' NIET meer externaliseren!
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
    },
  },
  build: {
    outDir: 'docs', 
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-ol': ['ol'],
          'vendor-react': ['react', 'react-dom', 'antd'],
          'vendor-lodash': ['lodash'],
        },
      },
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});