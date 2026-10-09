'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { hojeEmRecife, type Profissional, type TipoConsulta } from '@bemviver/shared'
import Alert from '@/components/atoms/Alert/alert'
import Button from '@/components/atoms/Button/button'
import Card from '@/components/atoms/Card/card'
import Input from '@/components/atoms/Input/input'
import Select from '@/components/atoms/Select/select'
import Field from '@/components/molecules/Field/field'
import SeletorHorario from '@/components/molecules/SeletorHorario/seletorHorario'
import { api } from '@/lib/api'
import { NOME_TIPO } from '@/lib/formato'

export default function AgendarConsulta() {
  const router = useRouter()
  const [profissionais, setProfissionais] = useState<Profissional[]>([])
  const [profissionalId, setProfissionalId] = useState('')
  const [data, setData] = useState('')
  const [tipo, setTipo] = useState<TipoConsulta>('primeira')
  const [horarios, setHorarios] = useState<string[] | null>(null)
  const [hora, setHora] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    api<Profissional[]>('/profissionais')
      .then(setProfissionais)
      .catch((e: Error) => setErro(e.message))
  }, [])

  useEffect(() => {
    if (!profissionalId || !data) return
    api<{ horarios: string[] }>(`/profissionais/${profissionalId}/horarios?data=${data}&tipo=${tipo}`)
      .then((resposta) => setHorarios(resposta.horarios))
      .catch((e: Error) => setErro(e.message))
  }, [profissionalId, data, tipo])

  async function confirmar() {
    setErro('')
    setEnviando(true)
    try {
      await api('/consultas', { metodo: 'POST', corpo: { profissionalId, data, hora, tipo } })
      router.push('/paciente')
    } catch (e) {
      setErro((e as Error).message)
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Marcar consulta</h1>
        <Link href="/paciente" className="text-sm text-teal-700 underline">
          Voltar
        </Link>
      </div>

      <Card className="space-y-4">
        <Field label="Profissional">
          <Select
            value={profissionalId}
            onChange={(e) => {
              setProfissionalId(e.target.value)
              setHora('')
            }}
          >
            <option value="">Selecione</option>
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.especialidade})
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Data">
          <Input
            type="date"
            min={hojeEmRecife()}
            value={data}
            onChange={(e) => {
              setData(e.target.value)
              setHora('')
            }}
          />
        </Field>

        <fieldset>
          <legend className="block text-sm font-medium text-gray-700">Tipo de consulta</legend>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {(['primeira', 'retorno'] as const).map((opcao) => (
              <Button
                key={opcao}
                variante={tipo === opcao ? 'primario' : 'secundario'}
                aria-pressed={tipo === opcao}
                onClick={() => {
                  setTipo(opcao)
                  setHora('')
                }}
              >
                {NOME_TIPO[opcao]}
              </Button>
            ))}
          </div>
        </fieldset>

        {profissionalId && data && horarios && (
          <fieldset>
            <legend className="block text-sm font-medium text-gray-700">Horário</legend>
            <SeletorHorario horarios={horarios} selecionado={hora} onSelecionar={setHora} />
          </fieldset>
        )}
      </Card>

      {erro && <Alert>{erro}</Alert>}

      <Button disabled={!hora || enviando} onClick={confirmar} className="w-full">
        {enviando ? 'Marcando...' : 'Confirmar consulta'}
      </Button>
    </div>
  )
}
