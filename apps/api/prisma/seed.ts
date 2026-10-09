import { DURACAO_MINUTOS, GRADE, hojeEmRecife, paraHora, paraMinutos } from '@bemviver/shared'
import type { StatusConsulta, TipoConsulta } from '@bemviver/shared'
import { diaUtil, instante, somarDias } from '../src/agenda'
import { gerarHashSenha } from '../src/auth'
import type { Prisma } from '../src/generated/prisma/client'
import { prisma } from '../src/prisma'

const SENHA = 'bemviver123'
const HORA = 60 * 60 * 1000
const DIA = 24 * HORA

const agora = new Date()
const hoje = hojeEmRecife(agora)

function diaDaSemana(data: string) {
  return new Date(`${data}T12:00:00Z`).getUTCDay()
}

// Próxima data (depois de hoje) que cai no dia da semana pedido. 1 = segunda ... 5 = sexta
function proxima(dia: number) {
  let data = somarDias(hoje, 1)
  while (diaDaSemana(data) !== dia) data = somarDias(data, 1)
  return data
}

// Sorteio com semente fixa, para o seed sair igual sempre que rodar no mesmo dia
let semente = 20261013
function sortear() {
  semente = (semente * 16807) % 2147483647
  return semente / 2147483647
}
function escolher<T>(lista: T[]) {
  return lista[Math.floor(sortear() * lista.length)]
}

function email(nome: string, dominio: string) {
  const partes = nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/^(Dra?\.) /, '')
    .toLowerCase()
    .split(' ')
  return `${partes[0]}.${partes[partes.length - 1]}@${dominio}`
}

const PROFISSIONAIS = [
  { nome: 'Dra. Ana Beatriz Cavalcanti', especialidade: 'Clínica geral' },
  { nome: 'Dr. Rafael Albuquerque', especialidade: 'Cardiologia' },
  { nome: 'Dra. Juliana Pessoa', especialidade: 'Dermatologia' },
  { nome: 'Dr. Marcos Lins', especialidade: 'Ortopedia' },
  { nome: 'Dra. Carolina Moura', especialidade: 'Pediatria' },
  { nome: 'Dr. Eduardo Tavares', especialidade: 'Endocrinologia' },
]

const PACIENTES = [
  'Maria Clara Santos',
  'João Pedro Almeida',
  'Carlos Henrique Barbosa',
  'Ana Luísa Ferreira',
  'Bruno Carvalho',
  'Camila Rocha',
  'Diego Monteiro',
  'Elaine Freitas',
  'Felipe Andrade',
  'Gabriela Nunes',
  'Henrique Melo',
  'Isabela Costa',
  'Lucas Siqueira',
  'Larissa Queiroz',
  'Mateus Vasconcelos',
  'Natália Ramos',
  'Otávio Leal',
  'Patrícia Gomes',
  'Renato Farias',
  'Sofia Barros',
]

async function main() {
  await prisma.$executeRaw`TRUNCATE consultas, folgas, profissionais, usuarios`

  const usuarios: Prisma.UsuarioCreateManyInput[] = [
    { nome: 'Fernanda Souza', email: 'recepcao@bemviver.com.br', senhaHash: gerarHashSenha(SENHA), perfil: 'recepcao' },
    ...PROFISSIONAIS.map((p) => ({
      nome: p.nome,
      email: email(p.nome, 'bemviver.com.br'),
      senhaHash: gerarHashSenha(SENHA),
      perfil: 'profissional' as const,
    })),
    ...PACIENTES.map((nome) => ({
      nome,
      email: email(nome, 'exemplo.com'),
      senhaHash: gerarHashSenha(SENHA),
      perfil: 'paciente' as const,
    })),
  ]
  const criados = await prisma.usuario.createManyAndReturn({ data: usuarios })
  const idPorNome = new Map(criados.map((u) => [u.nome, u.id]))
  const id = (nome: string) => idPorNome.get(nome)!

  await prisma.profissional.createMany({
    data: PROFISSIONAIS.map((p) => ({ id: id(p.nome), especialidade: p.especialidade })),
  })

  const [ana, rafael, juliana, marcos] = PROFISSIONAIS.map((p) => id(p.nome))
  const profissionalIds = PROFISSIONAIS.map((p) => id(p.nome))
  const [maria, , carlos] = PACIENTES.map(id)
  // Os três primeiros pacientes têm a agenda montada logo abaixo, fora do sorteio
  const pacientesSorteio = PACIENTES.slice(3).map(id)

  const consultas: Prisma.ConsultaCreateManyInput[] = []
  const ocupados = new Set<string>()

  function blocos(hora: string, tipo: TipoConsulta) {
    const inicio = paraMinutos(hora)
    return Array.from({ length: DURACAO_MINUTOS[tipo] / 30 }, (_, i) => paraHora(inicio + i * 30))
  }

  function livre(profissionalId: string, pacienteId: string, data: string, hora: string, tipo: TipoConsulta) {
    return blocos(hora, tipo).every(
      (bloco) =>
        GRADE.includes(bloco) &&
        !ocupados.has(`${profissionalId}|${data}|${bloco}`) &&
        !ocupados.has(`${pacienteId}|${data}|${bloco}`),
    )
  }

  function marcar(c: {
    profissionalId: string
    pacienteId: string
    data: string
    hora: string
    tipo: TipoConsulta
    status: StatusConsulta
    criadaEm?: Date
    canceladaEm?: Date
  }) {
    const inicio = instante(c.data, c.hora)
    for (const bloco of blocos(c.hora, c.tipo)) {
      ocupados.add(`${c.profissionalId}|${c.data}|${bloco}`)
      ocupados.add(`${c.pacienteId}|${c.data}|${bloco}`)
    }
    consultas.push({
      ...c,
      inicio,
      fim: new Date(inicio.getTime() + DURACAO_MINUTOS[c.tipo] * 60_000),
      criadaEm: c.criadaEm ?? new Date(Math.min(agora.getTime(), inicio.getTime()) - (1 + Math.floor(sortear() * 20)) * DIA),
      canceladaEm: c.canceladaEm ?? null,
    })
  }

  // Consulta da Maria Clara na próxima quarta-feira
  marcar({ profissionalId: ana, pacienteId: maria, data: proxima(3), hora: '10:00', tipo: 'primeira', status: 'agendada' })

  // Carlos faltou 6 vezes no último mês
  let diaFalta = somarDias(hoje, -2)
  for (let i = 0; i < 6; i++) {
    while (!diaUtil(diaFalta)) diaFalta = somarDias(diaFalta, -1)
    marcar({ profissionalId: profissionalIds[i], pacienteId: carlos, data: diaFalta, hora: '09:00', tipo: 'retorno', status: 'faltou' })
    diaFalta = somarDias(diaFalta, -4)
  }
  marcar({ profissionalId: ana, pacienteId: carlos, data: proxima(2), hora: '09:00', tipo: 'retorno', status: 'agendada' })

  // Dr. Marcos bloqueou a próxima sexta, mas já tinha pacientes marcados nesse dia
  const sextaDeFolga = proxima(5)
  const marcadasAntesDaFolga = new Date(agora.getTime() - 6 * DIA)
  for (const [hora, tipo] of [['09:00', 'primeira'], ['10:30', 'retorno'], ['14:00', 'retorno']] as const) {
    marcar({
      profissionalId: marcos,
      pacienteId: escolher(pacientesSorteio),
      data: sextaDeFolga,
      hora,
      tipo,
      status: 'agendada',
      criadaEm: marcadasAntesDaFolga,
    })
  }

  // Cancelamentos feitos no mesmo dia da consulta, nas últimas semanas
  for (const [dias, profissionalId] of [[-3, ana], [-6, rafael], [-9, juliana], [-13, marcos]] as const) {
    let data = somarDias(hoje, dias)
    while (!diaUtil(data)) data = somarDias(data, -1)
    const pacienteId = escolher(pacientesSorteio)
    if (!livre(profissionalId, pacienteId, data, '15:00', 'retorno')) continue
    marcar({
      profissionalId,
      pacienteId,
      data,
      hora: '15:00',
      tipo: 'retorno',
      status: 'cancelada',
      canceladaEm: instante(data, '08:40'),
    })
  }

  // Restante da agenda, do último mês até as próximas duas semanas
  for (let data = somarDias(hoje, -30); data <= somarDias(hoje, 14); data = somarDias(data, 1)) {
    if (!diaUtil(data)) continue
    for (const profissionalId of profissionalIds) {
      if (profissionalId === marcos && data === sextaDeFolga) continue
      for (const hora of GRADE) {
        if (sortear() > 0.35) continue
        const tipo: TipoConsulta = sortear() < 0.4 ? 'primeira' : 'retorno'
        const pacienteId = escolher(pacientesSorteio)
        if (!livre(profissionalId, pacienteId, data, hora, tipo)) continue

        const sorteio = sortear()
        if (data < hoje) {
          const status: StatusConsulta = sorteio < 0.06 ? 'cancelada' : sorteio < 0.11 ? 'faltou' : 'realizada'
          const inicio = instante(data, hora).getTime()
          const criadaEm = new Date(inicio - 10 * DIA)
          const canceladaEm = status === 'cancelada' ? new Date(inicio - 2 * DIA) : undefined
          marcar({ profissionalId, pacienteId, data, hora, tipo, status, criadaEm, canceladaEm })
        } else if (data > hoje && sorteio < 0.08) {
          const canceladaEm = new Date(agora.getTime() - (1 + Math.floor(sortear() * 20)) * HORA)
          marcar({ profissionalId, pacienteId, data, hora, tipo, status: 'cancelada', canceladaEm })
        } else {
          marcar({ profissionalId, pacienteId, data, hora, tipo, status: 'agendada' })
        }
      }
    }
  }

  await prisma.consulta.createMany({ data: consultas })
  await prisma.folga.create({
    data: { profissionalId: marcos, data: sextaDeFolga, criadaEm: new Date(agora.getTime() - DIA) },
  })

  console.log(`Seed concluído com ${usuarios.length} usuários e ${consultas.length} consultas. Senha de todos: ${SENHA}`)
}

main()
  .catch((erro) => {
    console.error(erro)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
