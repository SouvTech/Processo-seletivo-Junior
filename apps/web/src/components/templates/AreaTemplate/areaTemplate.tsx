'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Button from '@/components/atoms/Button/button'
import { useSessao } from '@/hooks/useSessao'
import { encerrarSessao } from '@/lib/sessao'
import type { AreaTemplateProps } from './types'

export default function AreaTemplate({ perfil, titulo, children }: AreaTemplateProps) {
  const router = useRouter()
  const sessao = useSessao()
  const autorizado = sessao?.usuario.perfil === perfil

  useEffect(() => {
    if (sessao !== undefined && !autorizado) router.replace('/')
  }, [sessao, autorizado, router])

  if (!sessao || !autorizado) return null

  function sair() {
    encerrarSessao()
    router.replace('/')
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="font-semibold text-teal-800">Clínica Bem Viver</p>
            <p className="text-sm text-gray-500">{titulo}</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-gray-600 sm:inline">{sessao.usuario.nome}</span>
            <Button variante="secundario" tamanho="compacto" onClick={sair}>
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-4">{children}</main>
    </div>
  )
}
