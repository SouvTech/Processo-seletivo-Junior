import Link from 'next/link'
import { classesDoBotao } from '@/components/atoms/Button/button'
import type { LinkButtonProps } from './types'

export default function LinkButton({ variante, className = '', ...props }: LinkButtonProps) {
  return <Link className={`${classesDoBotao(variante)} ${className}`} {...props} />
}
