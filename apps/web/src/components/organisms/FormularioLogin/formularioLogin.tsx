'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'
import type { Usuario } from '@bemviver/shared'
import Alert from '@/components/atoms/Alert/alert'
import Button from '@/components/atoms/Button/button'
import Input from '@/components/atoms/Input/input'
import Field from '@/components/molecules/Field/field'
import { api } from '@/lib/api'
import { lerSessao, salvarSessao } from '@/lib/sessao'

export default function FormularioLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const sessao = lerSessao()
    if (sessao) router.replace(`/${sessao.usuario.perfil}`)
  }, [router])

  async function entrar(evento: FormEvent) {
    evento.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      const sessao = await api<{ token: string; usuario: Usuario }>('/auth/login', {
        metodo: 'POST',
        corpo: { email, senha },
      })
      salvarSessao(sessao)
      router.push(`/${sessao.usuario.perfil}`)
    } catch (e) {
      setErro((e as Error).message)
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={entrar} className="space-y-4">
      <Field label="E-mail">
        <Input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="Senha">
        <Input
          type="password"
          required
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </Field>
      {erro && <Alert>{erro}</Alert>}
      <Button type="submit" disabled={enviando} className="w-full">
        {enviando ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
