import express, { type NextFunction, type Request, type Response } from 'express'
import { autenticar } from './auth'
import { rotasAuth } from './rotas/auth'
import { rotasConsultas } from './rotas/consultas'
import { rotasIntegracoes } from './rotas/integracoes'
import { rotasPacientes } from './rotas/pacientes'
import { rotasProfissionais } from './rotas/profissionais'

export const app = express()

app.use(express.json())

app.use('/auth', rotasAuth)
app.use('/integracoes', rotasIntegracoes)
app.use(autenticar)
app.use('/profissionais', rotasProfissionais)
app.use('/consultas', rotasConsultas)
app.use('/pacientes', rotasPacientes)

app.use((erro: { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  if (erro.status === 400) {
    res.status(400).json({ erro: 'Corpo da requisição inválido' })
    return
  }
  console.error(erro)
  res.status(500).json({ erro: 'Erro inesperado no servidor' })
})
