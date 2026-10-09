import type { Consulta } from '@bemviver/shared'

export interface CartaoConsultaProps {
  consulta: Consulta
  onCancelar: (id: string) => void
}
