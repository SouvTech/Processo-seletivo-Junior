import type { ButtonHTMLAttributes } from 'react'

export type VarianteBotao = 'primario' | 'secundario' | 'perigo'
export type TamanhoBotao = 'normal' | 'compacto' | 'estreito'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao
  tamanho?: TamanhoBotao
}
