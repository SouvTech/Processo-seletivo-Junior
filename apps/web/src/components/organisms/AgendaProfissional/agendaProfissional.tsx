'use client'

import { useEffect, useState } from 'react'
import { hojeEmRecife, type Agenda } from '@bemviver/shared'
import Alert from '@/components/atoms/Alert/alert'
import Button from '@/components/atoms/Button/button'
import Card from '@/components/atoms/Card/card'
import Input from '@/components/atoms/Input/input'
import Field from '@/components/molecules/Field/field'
import TabelaConsultas from '@/components/organisms/TabelaConsultas/tabelaConsultas'
import { useSessao } from '@/hooks/useSessao'
import { api } from '@/lib/api'
import { formatarData } from '@/lib/formato'

export default function AgendaProfissional() {
  const profissionalId = useSessao()?.usuario.id
  const [data, setData] = useState(() => hojeEmRecife())
  const [agenda, setAgenda] = useState<Agenda | null>(null)
  const [erro, setErro] = useState('')
  const [confirmando, setConfirmando] = useState(false)
  const [atualizacao, setAtualizacao] = useState(0)

  useEffect(() => {
    if (!profissionalId) return
    api<Agenda>(`/profissionais/${profissionalId}/agenda?data=${data}`)
      .then((resposta) => {
        setAgenda(resposta)
        setErro('')
      })
      .catch((e: Error) => setErro(e.message))
  }, [profissionalId, data, atualizacao])

  async function bloquearDia() {
    try {
      await api(`/profissionais/${profissionalId}/folgas`, { metodo: 'POST', corpo: { data } })
      setConfirmando(false)
      setAtualizacao((n) => n + 1)
    } catch (e) {
      setErro((e as Error).message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Field label="Data">
          <Input
            type="date"
            required
            value={data}
            onChange={(e) => {
              setData(e.target.value)
              setConfirmando(false)
            }}
          />
        </Field>
        {agenda && !agenda.folga && !confirmando && (
          <Button variante="secundario" onClick={() => setConfirmando(true)}>
            Bloquear este dia como folga
          </Button>
        )}
        {confirmando && (
          <div className="flex gap-2">
            <Button onClick={bloquearDia}>Confirmar folga</Button>
            <Button variante="secundario" onClick={() => setConfirmando(false)}>
              Voltar
            </Button>
          </div>
        )}
      </div>

      {erro && <Alert>{erro}</Alert>}

      {agenda && (
        <Card className="space-y-3">
          <h2 className="text-lg font-semibold first-letter:uppercase">{formatarData(agenda.data)}</h2>
          {agenda.folga && <Alert variante="aviso">Este dia está bloqueado como folga.</Alert>}
          <TabelaConsultas consultas={agenda.consultas} />
        </Card>
      )}
    </div>
  )
}
