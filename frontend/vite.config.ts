import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: '../lib/lambda/frontend',
  },
  plugins: [svelte()],
})
