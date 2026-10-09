import type { ReactNode } from 'react'
import type { Perfil } from '@bemviver/shared'

export interface AreaTemplateProps {
  perfil: Perfil
  titulo: string
  children: ReactNode
}
