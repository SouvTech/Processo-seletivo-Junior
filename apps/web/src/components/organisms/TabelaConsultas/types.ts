import type { ReactNode } from 'react'
import type { Consulta } from '@bemviver/shared'

export interface TabelaConsultasProps {
  consultas: Consulta[]
  acoes?: (consulta: Consulta) => ReactNode
}
