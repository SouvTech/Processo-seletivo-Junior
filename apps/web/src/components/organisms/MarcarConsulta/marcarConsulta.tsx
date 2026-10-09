'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { GRADE, type Paciente, type TipoConsulta } from '@bemviver/shared'
import Alert from '@/components/atoms/Alert/alert'
import Button from '@/components/atoms/Button/button'
import Card from '@/components/atoms/Card/card'
import Select from '@/components/atoms/Select/select'
import Field from '@/components/molecules/Field/field'
import { api } from '@/lib/api'
import { NOME_TIPO } from '@/lib/formato'
import type { MarcarConsultaProps } from './types'

export default function MarcarConsulta({ profissionalId, data, onMarcada }: MarcarConsultaProps) {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [pacienteId, setPacienteId] = useState('')
  const [tipo, setTipo] = useState<TipoConsulta>('primeira')
  const [hora, setHora] = useState(GRADE[0])
  const [mensagem, setMensagem] = useState<{ erro: boolean; texto: string } | null>(null)

  useEffect(() => {
    api<Paciente[]>('/pacientes')
      .then(setPacientes)
      .catch((e: Error) => setMensagem({ erro: true, texto: e.message }))
  }, [])

  async function marcar(evento: FormEvent) {
    evento.preventDefault()
    setMensagem(null)
    try {
      await api('/consultas', { metodo: 'POST', corpo: { profissionalId, pacienteId, data, hora, tipo } })
      setMensagem({ erro: false, texto: 'Consulta marcada.' })
      onMarcada()
    } catch (e) {
      setMensagem({ erro: true, texto: (e as Error).message })
    }
  }

  return (
    <Card>
      <form onSubmit={marcar} className="space-y-3">
        <h2 className="text-lg font-semibold">Marcar consulta</h2>
        <Field label="Paciente">
          <Select required value={pacienteId} onChange={(e) => setPacienteId(e.target.value)}>
            <option value="">Selecione</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tipo">
          <Select value={tipo} onChange={(e) => setTipo(e.target.value as TipoConsulta)}>
            <option value="primeira">{NOME_TIPO.primeira}</option>
            <option value="retorno">{NOME_TIPO.retorno}</option>
          </Select>
        </Field>
        <Field label="Horário">
          <Select value={hora} onChange={(e) => setHora(e.target.value)}>
            {GRADE.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </Select>
        </Field>
        <Button type="submit" className="w-full">
          Marcar
        </Button>
        {mensagem &&
          (mensagem.erro ? (
            <Alert>{mensagem.texto}</Alert>
          ) : (
            <p role="status" className="text-sm text-teal-700">
              {mensagem.texto}
            </p>
          ))}
      </form>
    </Card>
  )
}
