import { Router } from 'express'
import { conferirSenha, gerarToken } from '../auth'
import { prisma } from '../prisma'

export const rotasAuth = Router()

rotasAuth.post('/login', async (req, res) => {
  const email = String(req.body?.email ?? '').trim().toLowerCase()
  const senha = String(req.body?.senha ?? '')

  const usuario = await prisma.usuario.findUnique({ where: { email } })
  if (!usuario || !conferirSenha(senha, usuario.senhaHash)) {
    res.status(401).json({ erro: 'E-mail ou senha incorretos' })
    return
  }

  const dados = { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil }
  res.json({ token: gerarToken(dados), usuario: dados })
})
