import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo, todo lo que empieza con /api se reenvía al API Gateway del backend.
    // Así el navegador ve una sola dirección (localhost:5173): no hay problemas de CORS
    // y la cookie del refresh token funciona sin configuración extra.
    proxy: {
      '/api': {
        target: process.env.VITE_PROXY_TARGET ?? 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
