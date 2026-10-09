import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { hojeEmRecife } from '@bemviver/shared'
import { app } from '../src/app'
import { criarConsulta, criarUsuario, proximaSegunda, somarDias } from './ajuda'

const CHAVE = process.env.CHAVE_INTEGRACAO ?? ''

describe('integração de lembretes', () => {
  it('exige a chave de integração', async () => {
    const semChave = await request(app).get('/integracoes/lembretes')
    const chaveErrada = await request(app).get('/integracoes/lembretes').set('x-chave-integracao', 'errada')

    expect(semChave.status).toBe(401)
    expect(chaveErrada.status).toBe(401)
  })

  it('devolve as consultas agendadas do dia com o contato do paciente', async () => {
    const paciente = await criarUsuario('paciente', 'Paciente Teste')
    const profissional = await criarUsuario('profissional', 'Dra. Teste')
    const segunda = proximaSegunda()
    await criarConsulta({ profissionalId: profissional.id, pacienteId: paciente.id, data: segunda, hora: '09:00' })
    await criarConsulta({ profissionalId: profissional.id, pacienteId: paciente.id, data: segunda, hora: '10:00', status: 'cancelada' })
    await criarConsulta({ profissionalId: profissional.id, pacienteId: paciente.id, data: somarDias(segunda, 1), hora: '09:00' })

    const resposta = await request(app).get('/integracoes/lembretes').query({ data: segunda }).set('x-chave-integracao', CHAVE)

    expect(resposta.status).toBe(200)
    expect(resposta.body).toEqual([
      expect.objectContaining({
        data: segunda,
        hora: '09:00',
        pacienteNome: 'Paciente Teste',
        pacienteEmail: paciente.email,
        profissionalNome: 'Dra. Teste',
        especialidade: 'Clínica geral',
      }),
    ])
  })

  it('usa o dia seguinte quando a data não é informada', async () => {
    const paciente = await criarUsuario('paciente')
    const profissional = await criarUsuario('profissional')
    const amanha = somarDias(hojeEmRecife(), 1)
    await criarConsulta({ profissionalId: profissional.id, pacienteId: paciente.id, data: amanha, hora: '09:00' })

    const resposta = await request(app).get('/integracoes/lembretes').set('x-chave-integracao', CHAVE)

    expect(resposta.body.map((l: { data: string }) => l.data)).toEqual([amanha])
  })
})
