import { Router } from 'express'
import { DURACAO_MINUTOS, hojeEmRecife } from '@bemviver/shared'
import { ehTipoConsulta, instante, temConflito, validarHorario } from '../agenda'
import { permitir } from '../auth'
import { prisma } from '../prisma'

export const rotasConsultas = Router()

rotasConsultas.get('/minhas', permitir('paciente'), async (req, res) => {
  const consultas = await prisma.consulta.findMany({
    where: { pacienteId: req.usuario.id, data: { gte: hojeEmRecife() } },
    include: { profissional: { include: { usuario: { select: { nome: true } } } } },
    orderBy: { inicio: 'asc' },
  })

  res.json(
    consultas.map(({ profissional, ...consulta }) => ({
      ...consulta,
      profissionalNome: profissional.usuario.nome,
      especialidade: profissional.especialidade,
    })),
  )
})

rotasConsultas.post('/', permitir('paciente', 'recepcao'), async (req, res) => {
  const profissionalId = String(req.body?.profissionalId ?? '')
  const data = String(req.body?.data ?? '')
  const hora = String(req.body?.hora ?? '')
  const tipo = req.body?.tipo
  // O paciente só marca para ele mesmo. A recepção escolhe o paciente.
  const pacienteId = req.usuario.perfil === 'paciente' ? req.usuario.id : String(req.body?.pacienteId ?? '')

  if (!ehTipoConsulta(tipo)) {
    res.status(400).json({ erro: 'Informe o tipo da consulta' })
    return
  }
  const motivo = validarHorario(data, hora, tipo)
  if (motivo) {
    res.status(400).json({ erro: motivo })
    return
  }

  const [paciente, profissional] = await Promise.all([
    prisma.usuario.findFirst({ where: { id: pacienteId, perfil: 'paciente' } }),
    prisma.profissional.findUnique({ where: { id: profissionalId } }),
  ])
  if (!paciente || !profissional) {
    res.status(400).json({ erro: 'Paciente ou profissional não encontrado' })
    return
  }

  const folga = await prisma.folga.findUnique({ where: { profissionalId_data: { profissionalId, data } } })
  if (folga) {
    res.status(409).json({ erro: 'O profissional está de folga nesse dia' })
    return
  }

  const marcadas = await prisma.consulta.findMany({ where: { profissionalId, data, status: 'agendada' } })
  if (temConflito(marcadas, { hora, tipo })) {
    res.status(409).json({ erro: 'Esse horário já está ocupado' })
    return
  }

  const inicio = instante(data, hora)
  const fim = new Date(inicio.getTime() + DURACAO_MINUTOS[tipo] * 60_000)
  const consulta = await prisma.consulta.create({
    data: { profissionalId, pacienteId, data, hora, tipo, inicio, fim },
  })
  res.status(201).json(consulta)
})

rotasConsultas.post('/:id/cancelar', permitir('paciente', 'recepcao'), async (req, res) => {
  const consulta = await prisma.consulta.findUnique({ where: { id: req.params.id } })

  if (!consulta) {
    res.status(404).json({ erro: 'Consulta não encontrada' })
    return
  }
  if (consulta.status !== 'agendada') {
    res.status(409).json({ erro: 'Só é possível cancelar uma consulta agendada' })
    return
  }

  const cancelada = await prisma.consulta.update({
    where: { id: consulta.id },
    data: { status: 'cancelada', canceladaEm: new Date() },
  })
  res.json(cancelada)
})

rotasConsultas.post('/:id/falta', permitir('recepcao'), async (req, res) => {
  const consulta = await prisma.consulta.findUnique({ where: { id: req.params.id } })

  if (!consulta) {
    res.status(404).json({ erro: 'Consulta não encontrada' })
    return
  }
  if (consulta.status !== 'agendada') {
    res.status(409).json({ erro: 'Só é possível registrar falta em uma consulta agendada' })
    return
  }
  if (consulta.inicio > new Date()) {
    res.status(409).json({ erro: 'A falta só pode ser registrada depois do horário da consulta' })
    return
  }

  const atualizada = await prisma.consulta.update({ where: { id: consulta.id }, data: { status: 'faltou' } })
  res.json(atualizada)
})
