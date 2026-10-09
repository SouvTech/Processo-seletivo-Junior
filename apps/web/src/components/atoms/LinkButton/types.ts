import type { ComponentProps } from 'react'
import type Link from 'next/link'
import type { VarianteBotao } from '@/components/atoms/Button/types'

export interface LinkButtonProps extends ComponentProps<typeof Link> {
  variante?: VarianteBotao
}
