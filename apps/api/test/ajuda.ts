import { randomUUID } from 'node:crypto'
import { DURACAO_MINUTOS, hojeEmRecife } from '@bemviver/shared'
import type { Perfil, StatusConsulta, TipoConsulta } from '@bemviver/shared'
import { instante, somarDias } from '../src/agenda'
import { gerarHashSenha, gerarToken } from '../src/auth'
import { prisma } from '../src/prisma'

export const SENHA = 'senha-de-teste'
const senhaHash = gerarHashSenha(SENHA)

export async function criarUsuario(perfil: Perfil, nome = `Usuário ${randomUUID().slice(0, 8)}`) {
  const usuario = await prisma.usuario.create({
    data: { nome, email: `${randomUUID()}@teste.com`, senhaHash, perfil },
  })
  if (perfil === 'profissional') {
    await prisma.profissional.create({ data: { id: usuario.id, especialidade: 'Clínica geral' } })
  }
  return { ...usuario, auth: `Bearer ${gerarToken({ id: usuario.id, nome, perfil })}` }
}

export async function criarConsulta(dados: {
  profissionalId: string
  pacienteId: string
  data: string
  hora: string
  tipo?: TipoConsulta
  status?: StatusConsulta
}) {
  const tipo = dados.tipo ?? 'retorno'
  const inicio = instante(dados.data, dados.hora)
  return prisma.consulta.create({
    data: { ...dados, tipo, inicio, fim: new Date(inicio.getTime() + DURACAO_MINUTOS[tipo] * 60_000) },
  })
}

export { somarDias }

// Segunda-feira da semana que vem, para os testes não dependerem do dia em que rodam
export function proximaSegunda() {
  let data = somarDias(hojeEmRecife(), 1)
  while (new Date(`${data}T12:00:00Z`).getUTCDay() !== 1) data = somarDias(data, 1)
  return data
}
