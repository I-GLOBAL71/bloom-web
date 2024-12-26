import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'framer-motion'],
    exclude: [
      'firebase',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage'
    ],
  },
  envDir: path.resolve(__dirname),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'animations': ['framer-motion'],
        }
      }
    }
  },
  server: {
    watch: {
      usePolling: false,
    },
    hmr: {
      overlay: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  rollupOptions: {
    input: mode === 'admin' 
      ? path.resolve(__dirname, 'src/admin.tsx')
      : path.resolve(__dirname, 'src/user.tsx'),
  }
}));
