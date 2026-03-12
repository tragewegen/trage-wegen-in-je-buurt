import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  base: './', 
  plugins: [
    react(),
    nodePolyfills(),
  ],
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
  // Add this to parse JSX in .js files
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