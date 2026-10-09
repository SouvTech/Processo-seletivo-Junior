import { DURACAO_MINUTOS, EXPEDIENTE, GRADE, paraMinutos, type TipoConsulta } from '@bemviver/shared'

interface Horario {
  hora: string
  tipo: TipoConsulta
}

export function dataValida(data: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(data) && new Date(`${data}T12:00:00Z`).toISOString().startsWith(data)
}

export function ehTipoConsulta(tipo: unknown): tipo is TipoConsulta {
  return tipo === 'primeira' || tipo === 'retorno'
}

export function somarDias(data: string, dias: number) {
  const d = new Date(`${data}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + dias)
  return d.toISOString().slice(0, 10)
}

export function diaUtil(data: string) {
  const diaDaSemana = new Date(`${data}T12:00:00Z`).getUTCDay()
  return diaDaSemana >= 1 && diaDaSemana <= 5
}

// Recife não tem horário de verão, então o deslocamento é sempre -03:00
export function instante(data: string, hora: string) {
  return new Date(`${data}T${hora}:00-03:00`)
}

export function cabeNoExpediente({ hora, tipo }: Horario) {
  const inicio = paraMinutos(hora)
  const fim = inicio + DURACAO_MINUTOS[tipo]
  return EXPEDIENTE.some((periodo) => inicio >= periodo.inicio && fim <= periodo.fim)
}

export function temConflito(marcadas: Horario[], nova: Horario) {
  return marcadas.some((marcada) => marcada.hora === nova.hora)
}

export function horariosDisponiveis(marcadas: Horario[], tipo: TipoConsulta, data: string, agora = new Date()) {
  return GRADE.filter((hora) => instante(data, hora) > agora && !temConflito(marcadas, { hora, tipo }))
}

// Devolve o motivo quando o horário não pode ser marcado
export function validarHorario(data: string, hora: string, tipo: TipoConsulta, agora = new Date()) {
  if (!dataValida(data)) return 'Informe a data no formato AAAA-MM-DD'
  if (!diaUtil(data)) return 'A clínica atende de segunda a sexta'
  if (!GRADE.includes(hora)) return 'Escolha um horário da grade de 30 minutos'
  if (!cabeNoExpediente({ hora, tipo })) return 'A consulta precisa terminar antes do almoço ou do fim do expediente'
  if (instante(data, hora) <= agora) return 'Esse horário já passou'
  return null
}
