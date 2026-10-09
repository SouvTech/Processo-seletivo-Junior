'use client'

import { useEffect, useState } from 'react'
import { hojeEmRecife, type Profissional } from '@bemviver/shared'
import Alert from '@/components/atoms/Alert/alert'
import Input from '@/components/atoms/Input/input'
import Select from '@/components/atoms/Select/select'
import Field from '@/components/molecules/Field/field'
import AgendaDoDia from '@/components/organisms/AgendaDoDia/agendaDoDia'
import { api } from '@/lib/api'

export default function RecepcaoPage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [profissionalId, setProfissionalId] = useState('')
  const [data, setData] = useState(() => hojeEmRecife())
  const [erro, setErro] = useState('')

  useEffect(() => {
    api<Profissional[]>('/profissionais')
      .then((lista) => {
        setProfissionais(lista)
        setProfissionalId(lista[0]?.id ?? '')
      })
      .catch((e: Error) => setErro(e.message))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <Field label="Profissional" className="min-w-64 flex-1">
          <Select value={profissionalId} onChange={(e) => setProfissionalId(e.target.value)}>
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.especialidade})
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Data">
          <Input type="date" required value={data} onChange={(e) => setData(e.target.value)} />
        </Field>
      </div>

      {erro && <Alert>{erro}</Alert>}
      {profissionalId && data && <AgendaDoDia profissionalId={profissionalId} data={data} />}
    </div>
  )
}
