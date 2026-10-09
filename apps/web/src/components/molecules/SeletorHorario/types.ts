export interface SeletorHorarioProps {
  horarios: string[]
  selecionado: string
  onSelecionar: (hora: string) => void
}
