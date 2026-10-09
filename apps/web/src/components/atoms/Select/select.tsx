import type { SelectProps } from './types'

export default function Select({ className = '', ...props }: SelectProps) {
  return (
    <select
      className={`mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ${className}`}
      {...props}
    />
  )
}
