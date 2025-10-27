import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // where final files go
    chunkSizeWarningLimit: 1000, // optional: remove large chunk warnings
  },
})
