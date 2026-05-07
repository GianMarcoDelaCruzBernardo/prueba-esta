import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,

    proxy: {
      // API Django
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },

      // Archivos media (imágenes)
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },

      // (opcional) admin Django
      '/admin': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  resolve: {
    alias: {
      '@': '/src',
    }
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },

  preview: {
    port: 5173,
    open: true
  }
})