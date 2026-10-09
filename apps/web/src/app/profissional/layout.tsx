import type { ReactNode } from 'react'
import AreaTemplate from '@/components/templates/AreaTemplate/areaTemplate'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AreaTemplate perfil="profissional" titulo="Minha agenda">
      {children}
    </AreaTemplate>
  )
}
