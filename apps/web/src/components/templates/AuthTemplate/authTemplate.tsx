import Card from '@/components/atoms/Card/card'
import type { AuthTemplateProps } from './types'

export default function AuthTemplate({ titulo, subtitulo, children }: AuthTemplateProps) {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-teal-800">{titulo}</h1>
          {subtitulo && <p className="text-sm text-gray-500">{subtitulo}</p>}
        </div>
        {children}
      </Card>
    </main>
  )
}
