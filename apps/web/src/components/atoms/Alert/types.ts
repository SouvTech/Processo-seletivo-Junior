import type { ReactNode } from 'react'

export interface AlertProps {
  variante?: 'erro' | 'aviso'
  children: ReactNode
}
