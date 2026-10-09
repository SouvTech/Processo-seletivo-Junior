import { timingSafeEqual } from 'node:crypto'
import { Router } from 'express'
import { hojeEmRecife } from '@bemviver/shared'
import { dataValida, somarDias } from '../agenda'
import { prisma } from '../prisma'

// Rotas usadas por automações (como o n8n). Em vez do login, exigem a chave do cabeçalho x-chave-integracao.
export const rotasIntegracoes = Router()

const CHAVE = Buffer.from(process.env.CHAVE_INTEGRACAO ?? '')

rotasIntegracoes.use((req, res, next) => {
  const recebida = Buffer.from(String(req.headers['x-chave-integracao'] ?? ''))
  if (CHAVE.length > 0 && recebida.length === CHAVE.length && timingSafeEqual(recebida, CHAVE)) {
    next()
    return
  }
  res.status(401).json({ erro: 'Chave de integração inválida' })
})

// Consultas agendadas de um dia, com o contato do paciente. Sem a data, usa o dia seguinte.
rotasIntegracoes.get('/lembretes', async (req, res) => {
  const data = String(req.query.data ?? somarDias(hojeEmRecife(), 1))
  if (!dataValida(data)) {
    res.status(400).json({ erro: 'Informe a data no formato AAAA-MM-DD' })
    return
  }

  const consultas = await prisma.consulta.findMany({
    where: { data, status: 'agendada' },
    include: {
      paciente: { select: { nome: true, email: true } },
      profissional: { include: { usuario: { select: { nome: true } } } },
    },
    orderBy: { inicio: 'asc' },
  })

  res.json(
    consultas.map((consulta) => ({
      consultaId: consulta.id,
      data: consulta.data,
      hora: consulta.hora,
      tipo: consulta.tipo,
      pacienteNome: consulta.paciente.nome,
      pacienteEmail: consulta.paciente.email,
      profissionalNome: consulta.profissional.usuario.nome,
      especialidade: consulta.profissional.especialidade,
    })),
  )
})
