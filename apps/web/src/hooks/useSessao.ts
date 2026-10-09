import { useMemo, useSyncExternalStore } from 'react'
import { CHAVE_SESSAO, lerSessao } from '@/lib/sessao'

// No servidor não existe localStorage, então a sessão fica undefined até a página carregar no navegador
export function useSessao() {
  const salva = useSyncExternalStore(
    () => () => {},
    () => localStorage.getItem(CHAVE_SESSAO),
    () => undefined,
  )
  return useMemo(() => (salva === undefined ? undefined : lerSessao()), [salva])
}
