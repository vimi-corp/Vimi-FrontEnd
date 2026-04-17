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
      // OAuth2 authorization flow — proxy to backend, browser follows the 302 to Google natively
      '/api/oauth2': {
        target:       'http://localhost:4000',
        changeOrigin: false,
      },
      // OAuth2 callback route — must also be proxied back to backend
      '/login/oauth2': {
        target:       'http://localhost:4000',
        changeOrigin: false,
      },
      // All other /api calls go to the Spring Boot backend
      '/api': {
        target:       'http://localhost:4000',
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
