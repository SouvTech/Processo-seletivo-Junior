import type { InputProps } from './types'

export default function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ${className}`}
      {...props}
    />
  )
}
