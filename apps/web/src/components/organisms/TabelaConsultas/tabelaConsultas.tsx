import { NOME_STATUS, NOME_TIPO } from '@/lib/formato'
import type { TabelaConsultasProps } from './types'

export default function TabelaConsultas({ consultas, acoes }: TabelaConsultasProps) {
  if (consultas.length === 0) {
    return <p className="text-sm text-gray-500">Nenhuma consulta neste dia.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 text-gray-500">
          <tr>
            <th className="py-2 pr-4 font-medium">Horário</th>
            <th className="py-2 pr-4 font-medium">Paciente</th>
            <th className="py-2 pr-4 font-medium">Tipo</th>
            <th className="py-2 pr-4 font-medium">Situação</th>
            {acoes && <th className="py-2" />}
          </tr>
        </thead>
        <tbody>
          {consultas.map((consulta) => (
            <tr
              key={consulta.id}
              className={`border-b border-gray-100 ${consulta.status === 'cancelada' ? 'text-gray-400' : ''}`}
            >
              <td className="py-2 pr-4 font-medium">{consulta.hora}</td>
              <td className="py-2 pr-4">{consulta.pacienteNome}</td>
              <td className="py-2 pr-4">{NOME_TIPO[consulta.tipo]}</td>
              <td className="py-2 pr-4">{NOME_STATUS[consulta.status]}</td>
              {acoes && <td className="py-2 text-right whitespace-nowrap">{acoes(consulta)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
