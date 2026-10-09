import type { FieldProps } from './types'

export default function Field({ label, className = '', children }: FieldProps) {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`}>
      {label}
      {children}
    </label>
  )
}
