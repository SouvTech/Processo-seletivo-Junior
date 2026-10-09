import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { criarUsuario } from './ajuda'

describe('profissionais', () => {
  it('lista os profissionais com nome e especialidade', async () => {
    const paciente = await criarUsuario('paciente')
    const profissional = await criarUsuario('profissional', 'Dra. Teste')

    const resposta = await request(app).get('/profissionais').set('Authorization', paciente.auth)

    expect(resposta.status).toBe(200)
    expect(resposta.body).toEqual([{ id: profissional.id, nome: 'Dra. Teste', especialidade: 'Clínica geral' }])
  })
})
