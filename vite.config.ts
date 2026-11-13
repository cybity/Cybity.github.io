import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub project pages are served from /<repo>/, user/org pages from /.
// The deploy workflow sets BASE_PATH automatically; keep '/' for local dev
// and custom domains.
const base = process.env.BASE_PATH ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
