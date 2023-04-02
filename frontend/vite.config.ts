import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  build: {
    outDir: '../lib/lambda/frontend',
  },
  plugins: [svelte(), viteSingleFile()],
})
