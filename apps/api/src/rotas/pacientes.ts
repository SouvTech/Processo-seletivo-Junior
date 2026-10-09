import { Router } from 'express'
import { permitir } from '../auth'
import { prisma } from '../prisma'

export const rotasPacientes = Router()

rotasPacientes.get('/', permitir('recepcao'), async (_req, res) => {
  const pacientes = await prisma.usuario.findMany({
    where: { perfil: 'paciente' },
    select: { id: true, nome: true, email: true },
    orderBy: { nome: 'asc' },
  })
  res.json(pacientes)
})
