import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// eslint-disable-next-line no-undef
const base = process.env.NODE_ENV === 'production' ? '/dady/' : '/'

// https://vitejs.dev/config/
export default defineConfig({
  base: base,
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
