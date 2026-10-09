import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { SENHA, criarUsuario } from './ajuda'

describe('login', () => {
  it('devolve token e perfil com e-mail e senha corretos', async () => {
    const paciente = await criarUsuario('paciente', 'Paciente Teste')

    const resposta = await request(app).post('/auth/login').send({ email: paciente.email, senha: SENHA })

    expect(resposta.status).toBe(200)
    expect(resposta.body.token).toEqual(expect.any(String))
    expect(resposta.body.usuario).toEqual({ id: paciente.id, nome: 'Paciente Teste', perfil: 'paciente' })
  })

  it('recusa senha errada', async () => {
    const paciente = await criarUsuario('paciente')

    const resposta = await request(app).post('/auth/login').send({ email: paciente.email, senha: 'errada' })

    expect(resposta.status).toBe(401)
  })

  it('exige token nas rotas protegidas', async () => {
    const resposta = await request(app).get('/profissionais')

    expect(resposta.status).toBe(401)
  })
})
