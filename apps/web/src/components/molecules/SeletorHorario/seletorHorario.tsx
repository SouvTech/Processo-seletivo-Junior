import Button from '@/components/atoms/Button/button'
import type { SeletorHorarioProps } from './types'

export default function SeletorHorario({ horarios, selecionado, onSelecionar }: SeletorHorarioProps) {
  if (horarios.length === 0) {
    return <p className="mt-1 text-sm text-gray-500">Nenhum horário disponível nesse dia.</p>
  }

  return (
    <div className="mt-1 grid grid-cols-4 gap-2">
      {horarios.map((hora) => (
        <Button
          key={hora}
          variante={selecionado === hora ? 'primario' : 'secundario'}
          tamanho="estreito"
          aria-pressed={selecionado === hora}
          onClick={() => onSelecionar(hora)}
        >
          {hora}
        </Button>
      ))}
    </div>
  )
}
