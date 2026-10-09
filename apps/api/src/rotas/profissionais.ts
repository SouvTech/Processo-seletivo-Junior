import { Router } from 'express'
import { hojeEmRecife } from '@bemviver/shared'
import { dataValida, diaUtil, ehTipoConsulta, horariosDisponiveis } from '../agenda'
import { permitir } from '../auth'
import { prisma } from '../prisma'

export const rotasProfissionais = Router()

rotasProfissionais.get('/', async (_req, res) => {
  const profissionais = await prisma.profissional.findMany({
    include: { usuario: { select: { nome: true } } },
    orderBy: { usuario: { nome: 'asc' } },
  })
  res.json(profissionais.map((p) => ({ id: p.id, nome: p.usuario.nome, especialidade: p.especialidade })))
})

rotasProfissionais.get('/:id/agenda', permitir('recepcao', 'profissional'), async (req, res) => {
  const profissionalId = req.params.id
  const data = String(req.query.data ?? '')

  if (req.usuario.perfil === 'profissional' && req.usuario.id !== profissionalId) {
    res.status(403).json({ erro: 'Você só pode ver a sua própria agenda' })
    return
  }
  if (!dataValida(data)) {
    res.status(400).json({ erro: 'Informe a data no formato AAAA-MM-DD' })
    return
  }

  const [folga, consultas] = await Promise.all([
    prisma.folga.findUnique({ where: { profissionalId_data: { profissionalId, data } } }),
    prisma.consulta.findMany({
      where: { profissionalId, data },
      include: { paciente: { select: { nome: true } } },
      orderBy: { inicio: 'asc' },
    }),
  ])

  res.json({
    data,
    folga: Boolean(folga),
    consultas: consultas.map(({ paciente, ...consulta }) => ({ ...consulta, pacienteNome: paciente.nome })),
  })
})

rotasProfissionais.get('/:id/horarios', async (req, res) => {
  const profissionalId = req.params.id
  const data = String(req.query.data ?? '')
  const tipo = req.query.tipo

  if (!dataValida(data) || !ehTipoConsulta(tipo)) {
    res.status(400).json({ erro: 'Informe a data (AAAA-MM-DD) e o tipo da consulta' })
    return
  }

  const folga = await prisma.folga.findUnique({ where: { profissionalId_data: { profissionalId, data } } })
  if (folga || !diaUtil(data)) {
    res.json({ horarios: [] })
    return
  }

  const marcadas = await prisma.consulta.findMany({ where: { profissionalId, data } })
  res.json({ horarios: horariosDisponiveis(marcadas, tipo, data) })
})

rotasProfissionais.post('/:id/folgas', permitir('profissional', 'recepcao'), async (req, res) => {
  const profissionalId = req.params.id
  const data = String(req.body?.data ?? '')

  if (req.usuario.perfil === 'profissional' && req.usuario.id !== profissionalId) {
    res.status(403).json({ erro: 'Você só pode bloquear a sua própria agenda' })
    return
  }
  if (!dataValida(data)) {
    res.status(400).json({ erro: 'Informe a data no formato AAAA-MM-DD' })
    return
  }
  if (data < hojeEmRecife()) {
    res.status(400).json({ erro: 'Não é possível bloquear um dia que já passou' })
    return
  }

  const profissional = await prisma.profissional.findUnique({ where: { id: profissionalId } })
  if (!profissional) {
    res.status(404).json({ erro: 'Profissional não encontrado' })
    return
  }

  const existente = await prisma.folga.findUnique({ where: { profissionalId_data: { profissionalId, data } } })
  if (existente) {
    res.status(409).json({ erro: 'Esse dia já está bloqueado' })
    return
  }

  const folga = await prisma.folga.create({ data: { profissionalId, data } })
  res.status(201).json(folga)
})
