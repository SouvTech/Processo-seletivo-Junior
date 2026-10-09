import { execSync } from 'node:child_process'

export default function prepararBanco() {
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TESTE },
    stdio: 'ignore',
  })
}
