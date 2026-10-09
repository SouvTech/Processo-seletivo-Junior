import { encerrarSessao, lerSessao } from './sessao'

interface Opcoes {
  metodo?: 'GET' | 'POST'
  corpo?: unknown
}

export async function api<T>(caminho: string, { metodo = 'GET', corpo }: Opcoes = {}): Promise<T> {
  const sessao = lerSessao()
  const resposta = await fetch(`/api${caminho}`, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(sessao ? { Authorization: `Bearer ${sessao.token}` } : {}),
    },
    body: corpo === undefined ? undefined : JSON.stringify(corpo),
  })
  const json = await resposta.json().catch(() => null)

  if (resposta.status === 401) encerrarSessao()
  if (!resposta.ok) {
    throw new Error(json?.erro ?? 'Não foi possível concluir. Tente de novo.')
  }
  return json as T
}
