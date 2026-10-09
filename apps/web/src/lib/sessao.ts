import type { Usuario } from '@bemviver/shared'

export interface Sessao {
  token: string
  usuario: Usuario
}

export const CHAVE_SESSAO = 'bemviver-sessao'

export function lerSessao(): Sessao | null {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_SESSAO) ?? 'null')
  } catch {
    return null
  }
}

export function salvarSessao(sessao: Sessao) {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao))
}

export function encerrarSessao() {
  localStorage.removeItem(CHAVE_SESSAO)
}
