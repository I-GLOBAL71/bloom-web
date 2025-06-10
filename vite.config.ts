import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    hmr: {
      overlay: true
    },
    headers: {
      // Configuration CORS et sécurité
      'Cross-Origin-Embedder-Policy': 'unsafe-none', // Permettre le chargement des ressources cross-origin
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      // Protection XSS et autres
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      // CORS headers optimisés
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
      // Headers pour les requêtes pré-vol
      'Access-Control-Expose-Headers': 'Content-Length, X-Content-Type-Options',
      // Headers pour l'optimisation des polices
      'Link': '<https://fonts.googleapis.com>; rel=preconnect; crossorigin, <https://fonts.gstatic.com>; rel=preconnect; crossorigin'
    }
  },
  build: {
    sourcemap: true,
    minify: false,
    target: 'es2022'
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  logLevel: 'info'
});
