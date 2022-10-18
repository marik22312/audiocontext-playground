import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/audiocontext-playground/'
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        drumkit: resolve(__dirname, 'drumkit/index.html'),
	['microphone-visualiser']: resolve(__dirname, 'microphone-visualiser/index.html'),
	note: resolve(__dirname, 'note/index.html'),
      }
    }
  }
})
