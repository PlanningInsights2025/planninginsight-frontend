import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',
  publicDir: 'public',
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    },
    // Include mammoth in optimization
    include: ['mammoth']
  },
  resolve: {
    alias: {
      '@': '/src',
      // Use the browser build of mammoth
      'mammoth': 'mammoth/mammoth.browser.min.js'
    }
  },
  server: {
    port: 5173,
    open: true
  },
  build: {
    commonjsOptions: {
      // Transform mammoth as CommonJS module
      include: [/mammoth/, /node_modules/],
      transformMixedEsModules: true
    }
  }
});
