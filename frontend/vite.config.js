import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Acepta conexiones desde la red LAN (a través del port forwarding WSL)
    port: 5173,
  }
})
