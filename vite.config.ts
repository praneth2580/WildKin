import { copyFileSync, existsSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project pages: https://praneth2580.github.io/WildKin/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/WildKin/' : '/',
  plugins: [
    react(),
    {
      name: 'gh-pages-spa-fallback',
      closeBundle() {
        if (mode !== 'production') return
        const index = 'dist/index.html'
        if (existsSync(index)) {
          copyFileSync(index, 'dist/404.html')
        }
      },
    },
  ],
}))
