'use client'

import { useState } from 'react'
import Button from '@/components/atoms/Button/button'
import Card from '@/components/atoms/Card/card'
import { NOME_STATUS, NOME_TIPO, formatarData } from '@/lib/formato'
import type { CartaoConsultaProps } from './types'

export default function CartaoConsulta({ consulta, onCancelar }: CartaoConsultaProps) {
  const [confirmando, setConfirmando] = useState(false)

  return (
    <Card className="space-y-1">
      <p className="font-medium first-letter:uppercase">
        {formatarData(consulta.data)} às {consulta.hora}
      </p>
      <p className="text-gray-700">
        {consulta.profissionalNome} ({consulta.especialidade})
      </p>
      <p className="text-sm text-gray-500">
        {NOME_TIPO[consulta.tipo]}, {NOME_STATUS[consulta.status].toLowerCase()}
      </p>
      {consulta.status === 'agendada' &&
        (confirmando ? (
          <div className="flex gap-2 pt-2">
            <Button variante="perigo" onClick={() => onCancelar(consulta.id)} className="flex-1">
              Confirmar cancelamento
            </Button>
            <Button variante="secundario" onClick={() => setConfirmando(false)}>
              Voltar
            </Button>
          </div>
        ) : (
          <Button variante="secundario" onClick={() => setConfirmando(true)} className="mt-2 w-full">
            Cancelar consulta
          </Button>
        ))}
    </Card>
  )
}
