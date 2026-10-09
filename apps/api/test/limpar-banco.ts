import { afterAll, beforeEach } from 'vitest'
import { prisma } from '../src/prisma'

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE consultas, folgas, profissionais, usuarios`
})

afterAll(async () => {
  await prisma.$disconnect()
})
