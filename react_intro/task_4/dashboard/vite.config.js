import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The site is served from https://bruqui.github.io/holbertonschool-web_react/,
  // so assets must resolve from that sub-path rather than the domain root.
  base: '/holbertonschool-web_react/',
})
