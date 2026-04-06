import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      // Clean absolute imports: import X from '@/components/X'
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,
    // Allow any *.vimi.id.vn hostname in local dev
    // (pair with a /etc/hosts entry: 127.0.0.1 hoangshop.localhost)
    allowedHosts: ['.localhost', '.vimi.id.vn'],
    proxy: {
      // All /api calls go to the Express backend during local dev
      '/api': {
        target:      'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },

  build: {
    target:    'esnext',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor splitting — keeps the main bundle lean
          react:  ['react', 'react-dom', 'react-router-dom'],
          icons:  ['lucide-react'],
        },
      },
    },
  },
});
