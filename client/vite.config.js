import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 80, // Forces Vite to run on port 80 instead of 5173
    host: '0.0.0.0' // Ensures it listens for external requests within the container
  }
})