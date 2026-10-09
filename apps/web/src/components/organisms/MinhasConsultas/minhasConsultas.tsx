'use client'

import { useEffect, useState } from 'react'
import type { Consulta } from '@bemviver/shared'
import Alert from '@/components/atoms/Alert/alert'
import LinkButton from '@/components/atoms/LinkButton/linkButton'
import CartaoConsulta from '@/components/molecules/CartaoConsulta/cartaoConsulta'
import { api } from '@/lib/api'

export default function MinhasConsultas() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [erro, setErro] = useState('')
  const [atualizacao, setAtualizacao] = useState(0)

  useEffect(() => {
    api<Consulta[]>('/consultas/minhas')
      .then(setConsultas)
      .catch((e: Error) => setErro(e.message))
  }, [atualizacao])

  async function cancelar(id: string) {
    try {
      await api(`/consultas/${id}/cancelar`, { metodo: 'POST' })
      setAtualizacao((n) => n + 1)
    } catch (e) {
      setErro((e as Error).message)
    }
  }

  if (consultas.length === 0) return <p className="text-gray-500">Carregando suas consultas...</p>

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Minhas consultas</h1>
        <LinkButton href="/paciente/agendar">Marcar consulta</LinkButton>
      </div>

      {erro && <Alert>{erro}</Alert>}

      <ul className="space-y-3">
        {consultas.map((consulta) => (
          <li key={consulta.id}>
            <CartaoConsulta consulta={consulta} onCancelar={cancelar} />
          </li>
        ))}
      </ul>
    </div>
  )
}
