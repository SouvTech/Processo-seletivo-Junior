import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { Perfil, Usuario } from '@bemviver/shared'

declare module 'express-serve-static-core' {
  interface Request {
    usuario: Usuario
  }
}

const SEGREDO = process.env.JWT_SEGREDO ?? 'segredo-local-de-desenvolvimento'

export function gerarHashSenha(senha: string) {
  const salt = randomBytes(16).toString('hex')
  return `${salt}:${scryptSync(senha, salt, 64).toString('hex')}`
}

export function conferirSenha(senha: string, hash: string) {
  const [salt, esperado] = hash.split(':')
  return timingSafeEqual(scryptSync(senha, salt, 64), Buffer.from(esperado, 'hex'))
}

export function gerarToken(usuario: Usuario) {
  return jwt.sign(usuario, SEGREDO, { expiresIn: '8h' })
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    res.status(401).json({ erro: 'Faça login para continuar' })
    return
  }
  try {
    const { id, nome, perfil } = jwt.verify(token, SEGREDO) as Usuario
    req.usuario = { id, nome, perfil }
    next()
  } catch {
    res.status(401).json({ erro: 'Sua sessão expirou. Faça login de novo' })
  }
}

export function permitir(...perfis: Perfil[]) {
  return <P>(req: Request<P>, res: Response, next: NextFunction) => {
    if (perfis.includes(req.usuario.perfil)) {
      next()
    } else {
      res.status(403).json({ erro: 'Você não tem permissão para isso' })
    }
  }
}
