import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
const env = loadEnv('all', process.cwd())
const base = env.NODE_ENV === 'production' ? '/dady/' : '/'

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
