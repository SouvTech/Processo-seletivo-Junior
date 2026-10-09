'use client'

import { useEffect, useState } from 'react'
import type { Agenda } from '@bemviver/shared'
import Alert from '@/components/atoms/Alert/alert'
import Button from '@/components/atoms/Button/button'
import Card from '@/components/atoms/Card/card'
import MarcarConsulta from '@/components/organisms/MarcarConsulta/marcarConsulta'
import TabelaConsultas from '@/components/organisms/TabelaConsultas/tabelaConsultas'
import { api } from '@/lib/api'
import type { AgendaDoDiaProps } from './types'

export default function AgendaDoDia({ profissionalId, data }: AgendaDoDiaProps) {
  const [agenda, setAgenda] = useState<Agenda | null>(null)
  const [erro, setErro] = useState('')
  const [atualizacao, setAtualizacao] = useState(0)

  useEffect(() => {
    api<Agenda>(`/profissionais/${profissionalId}/agenda?data=${data}`)
      .then((resposta) => {
        setAgenda(resposta)
        setErro('')
      })
      .catch((e: Error) => setErro(e.message))
  }, [data, atualizacao])

  function recarregar() {
    setAtualizacao((n) => n + 1)
  }

  async function executar(acao: 'cancelar' | 'falta', consultaId: string) {
    try {
      await api(`/consultas/${consultaId}/${acao}`, { metodo: 'POST' })
      recarregar()
    } catch (e) {
      setErro((e as Error).message)
    }
  }

  if (!agenda) {
    return erro ? <Alert>{erro}</Alert> : <p className="text-sm text-gray-500">Carregando agenda...</p>
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
      <Card className="space-y-3">
        <h2 className="text-lg font-semibold first-letter:uppercase">
          {new Date(agenda.data).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })}
        </h2>
        {agenda.folga && <Alert variante="aviso">Dia bloqueado como folga do profissional.</Alert>}
        {erro && <Alert>{erro}</Alert>}
        <TabelaConsultas
          consultas={agenda.consultas}
          acoes={(consulta) =>
            consulta.status === 'agendada' && (
              <div className="flex justify-end gap-2">
                {new Date(consulta.inicio) <= new Date() && (
                  <Button variante="secundario" tamanho="compacto" onClick={() => executar('falta', consulta.id)}>
                    Registrar falta
                  </Button>
                )}
                <Button variante="secundario" tamanho="compacto" onClick={() => executar('cancelar', consulta.id)}>
                  Cancelar
                </Button>
              </div>
            )
          }
        />
      </Card>
      <MarcarConsulta profissionalId={profissionalId} data={data} onMarcada={recarregar} />
    </div>
  )
}
