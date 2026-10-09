import { defineConfig } from 'vitest/config'

process.env.TZ = 'America/Recife'
process.loadEnvFile()

export default defineConfig({
  test: {
    env: {
      TZ: 'America/Recife',
      DATABASE_URL: process.env.DATABASE_URL_TESTE ?? '',
    },
    globalSetup: './test/preparar-banco.ts',
    setupFiles: ['./test/limpar-banco.ts'],
    // Todos os arquivos usam o mesmo banco de teste, então rodam um de cada vez
    fileParallelism: false,
  },
})
