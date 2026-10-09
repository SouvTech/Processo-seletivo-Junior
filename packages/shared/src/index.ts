export type Perfil = 'paciente' | 'recepcao' | 'profissional'
export type TipoConsulta = 'primeira' | 'retorno'
export type StatusConsulta = 'agendada' | 'cancelada' | 'realizada' | 'faltou'

export interface Usuario {
  id: string
  nome: string
  perfil: Perfil
}

export interface Profissional {
  id: string
  nome: string
  especialidade: string
}

export interface Paciente {
  id: string
  nome: string
  email: string
}

export interface Consulta {
  id: string
  profissionalId: string
  pacienteId: string
  data: string
  hora: string
  inicio: string
  fim: string
  tipo: TipoConsulta
  status: StatusConsulta
  criadaEm: string
  canceladaEm: string | null
  pacienteNome?: string
  profissionalNome?: string
  especialidade?: string
}

export interface Agenda {
  data: string
  folga: boolean
  consultas: Consulta[]
}

export const FUSO = 'America/Recife'

export const DURACAO_MINUTOS: Record<TipoConsulta, number> = {
  primeira: 60,
  retorno: 30,
}

// Períodos de atendimento em minutos desde a meia-noite (8h às 12h e 13h às 18h)
export const EXPEDIENTE = [
  { inicio: 8 * 60, fim: 12 * 60 },
  { inicio: 13 * 60, fim: 18 * 60 },
]

export function paraMinutos(hora: string) {
  const [h, m] = hora.split(':').map(Number)
  return h * 60 + m
}

export function paraHora(minutos: number) {
  const h = String(Math.floor(minutos / 60)).padStart(2, '0')
  const m = String(minutos % 60).padStart(2, '0')
  return `${h}:${m}`
}

// Todos os horários de início da grade de 30 minutos (08:00, 08:30, ..., 17:30)
export const GRADE = EXPEDIENTE.flatMap((periodo) => {
  const horas: string[] = []
  for (let minuto = periodo.inicio; minuto < periodo.fim; minuto += 30) {
    horas.push(paraHora(minuto))
  }
  return horas
})

// Data de hoje (YYYY-MM-DD) no fuso da clínica, independente do fuso de quem roda o código
export function hojeEmRecife(agora = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: FUSO }).format(agora)
}
