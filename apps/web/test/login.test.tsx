import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from '../src/app/page'
import { lerSessao } from '../src/lib/sessao'
import { simularApi } from './simular-api'

const roteador = { push: vi.fn(), replace: vi.fn() }
vi.mock('next/navigation', () => ({ useRouter: () => roteador }))

describe('login', () => {
  it('guarda a sessão e leva o usuário para a área do perfil dele', async () => {
    simularApi(() => ({ token: 'abc', usuario: { id: '1', nome: 'Maria', perfil: 'paciente' } }))
    render(<LoginPage />)

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'maria@exemplo.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'bemviver123' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }))

    await waitFor(() => expect(roteador.push).toHaveBeenCalledWith('/paciente'))
    expect(lerSessao()?.token).toBe('abc')
  })
})
