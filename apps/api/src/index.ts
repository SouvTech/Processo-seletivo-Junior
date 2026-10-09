import { app } from './app'

const porta = Number(process.env.PORTA ?? 3333)

app.listen(porta, () => {
  console.log(`API rodando em http://localhost:${porta}`)
})
