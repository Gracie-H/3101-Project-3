// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages 仓库名，必须以斜杠开头结尾
  base: '/3101-Project-3/',
  plugins: [react()],
})
