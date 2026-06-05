import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub project pages are served from /WildKin/
const base = process.env.GITHUB_PAGES === 'true' ? '/WildKin/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
