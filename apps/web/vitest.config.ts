import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

process.env.TZ = 'America/Recife'

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    env: { TZ: 'America/Recife' },
    setupFiles: ['./test/setup.ts'],
  },
})
