import type { CardProps } from './types'

export default function Card({ className = '', ...props }: CardProps) {
  return <div className={`rounded-lg border border-gray-200 bg-white p-4 ${className}`} {...props} />
}
