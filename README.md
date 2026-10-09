# Clínica Bem Viver · Agendamento de consultas

## 1. Contexto

A Clínica Bem Viver fica em Recife e atende em várias especialidades, como clínica geral, cardiologia, dermatologia, ortopedia, pediatria e endocrinologia. Há alguns meses a clínica usa este sistema para marcar consultas, e ele já está em produção, com pacientes, profissionais e consultas gravados.

O projeto tem duas partes.

- `apps/api`, em Node com Express, Prisma e PostgreSQL.
- `apps/web`, em Next.js com React e Tailwind, com uma área para cada perfil. A recepção cuida da agenda do dia, o profissional vê a própria agenda e o paciente marca e acompanha as consultas pelo celular. Os componentes seguem a arquitetura atômica, em `src/components`, divididos em atoms, molecules, organisms e templates. As páginas em `src/app` montam a tela com esses componentes.

### Onde fica cada coisa

| Pasta ou arquivo | O que tem |
| --- | --- |
| `apps/api/src/rotas` | Rotas da api, uma por assunto (auth, profissionais, consultas, pacientes e integrações) |
| `apps/api/src/agenda.ts` | Regras de horário e de expediente usadas pelas rotas |
| `apps/api/src/auth.ts` | Login, token e permissão por perfil |
| `apps/api/prisma` | Schema do banco, migrations e seed |
| `apps/web/src/app` | Páginas de cada área |
| `apps/web/src/components` | Componentes em atoms, molecules, organisms e templates |
| `apps/web/src/hooks` e `apps/web/src/lib` | Sessão, chamadas à api e formatação de datas |
| `packages/shared` | Tipos e utilitários usados pela api e pelo web |
| `apps/api/test` e `apps/web/test` | Testes |

A clínica mandou alguns relatos de problemas, pedidos e uma lista de funcionalidades. Você vai assumir o sistema a partir daqui.

## 2. O que esperamos de você

Queremos entender como você pensa. Leia os relatos, investigue, corrija o que encontrar e conte no `DECISOES.md` o caminho que fez. Nas situações em aberto, decida o que fazer e explique por quê. Na lista de funcionalidades, ordene todas e implemente duas.

O prazo é curto de propósito e ninguém precisa resolver tudo. Pode entregar menos, desde que entenda e explique bem o que fez. Se não der tempo de fazer algo, registre o que faria.

Depois da entrega vem a entrevista técnica, em que vamos conversar sobre o que você entregou e sobre as decisões que tomou.

## 3. Como rodar o projeto

### Pré-requisitos

- Node.js 22 ou mais recente
- Docker com Docker Compose (Docker Desktop, OrbStack ou similar), aberto e rodando
- Git

### Comando único

Na raiz do projeto, rode estes dois comandos.

```bash
npm install
npm run dev
```

O `npm run dev` sobe o PostgreSQL e o Mailpit no Docker, aplica as migrations, roda o seed e inicia a api e o web. O seed apaga o banco local e cria tudo de novo, com datas relativas ao dia de hoje. Por isso, a cada `npm run dev` os dados voltam ao estado inicial.

### Portas

| Serviço | Endereço |
| --- | --- |
| Web | `http://localhost:3100` |
| API | `http://localhost:3333` |
| PostgreSQL | `localhost:5433` (usuário, senha e banco `bemviver`) |
| Prisma Studio (opcional) | `http://localhost:5555`, com `npm run studio` |
| n8n (bônus) | `http://localhost:5678`, com `npm run n8n` |
| Mailpit (caixa de e-mail falsa) | `http://localhost:8025`, com SMTP na porta 1025 |

O web repassa as chamadas de `/api` para a api, então no navegador tudo passa pela porta 3100.

### Outros comandos

| Comando | O que faz |
| --- | --- |
| `npm test` | Sobe o PostgreSQL e roda os testes da api e do web |
| `npm run lint` | ESLint em todo o projeto |
| `npm run typecheck` | TypeScript em todos os pacotes |
| `npm run build` | Build de produção do web |
| `npm run n8n` | Sobe o n8n, usado só no bônus do lembrete |

Os testes da api usam um banco separado, o `bemviver_teste`, criado automaticamente no mesmo container.

O projeto já tem alguns testes básicos em `apps/api/test` e `apps/web/test`, que servem de ponto de partida. Os ajudantes `apps/api/test/ajuda.ts`, que cria usuários e consultas no banco de teste, e `apps/web/test/simular-api.ts`, que simula as respostas da api, estão lá para você reaproveitar.

### Usuários de teste

A senha de todos é `bemviver123`.

| Perfil | Nome | E-mail |
| --- | --- | --- |
| Recepção | Fernanda Souza | recepcao@bemviver.com.br |
| Profissional | Dra. Ana Beatriz Cavalcanti, clínica geral | ana.cavalcanti@bemviver.com.br |
| Profissional | Dr. Rafael Albuquerque, cardiologia | rafael.albuquerque@bemviver.com.br |
| Profissional | Dra. Juliana Pessoa, dermatologia | juliana.pessoa@bemviver.com.br |
| Profissional | Dr. Marcos Lins, ortopedia | marcos.lins@bemviver.com.br |
| Profissional | Dra. Carolina Moura, pediatria | carolina.moura@bemviver.com.br |
| Profissional | Dr. Eduardo Tavares, endocrinologia | eduardo.tavares@bemviver.com.br |
| Paciente | Maria Clara Santos | maria.santos@exemplo.com |
| Paciente | João Pedro Almeida | joao.almeida@exemplo.com |
| Paciente | Carlos Henrique Barbosa | carlos.barbosa@exemplo.com |
| Paciente | Ana Luísa Ferreira | ana.ferreira@exemplo.com |
| Paciente | Bruno Carvalho | bruno.carvalho@exemplo.com |
| Paciente | Camila Rocha | camila.rocha@exemplo.com |
| Paciente | Diego Monteiro | diego.monteiro@exemplo.com |
| Paciente | Elaine Freitas | elaine.freitas@exemplo.com |
| Paciente | Felipe Andrade | felipe.andrade@exemplo.com |
| Paciente | Gabriela Nunes | gabriela.nunes@exemplo.com |
| Paciente | Henrique Melo | henrique.melo@exemplo.com |
| Paciente | Isabela Costa | isabela.costa@exemplo.com |
| Paciente | Lucas Siqueira | lucas.siqueira@exemplo.com |
| Paciente | Larissa Queiroz | larissa.queiroz@exemplo.com |
| Paciente | Mateus Vasconcelos | mateus.vasconcelos@exemplo.com |
| Paciente | Natália Ramos | natalia.ramos@exemplo.com |
| Paciente | Otávio Leal | otavio.leal@exemplo.com |
| Paciente | Patrícia Gomes | patricia.gomes@exemplo.com |
| Paciente | Renato Farias | renato.farias@exemplo.com |
| Paciente | Sofia Barros | sofia.barros@exemplo.com |

## 4. Regras de negócio

- Atendimento de segunda a sexta, das 8h às 18h, com almoço das 12h às 13h sem atendimento.
- Agenda em horários de 30 minutos, com America/Recife como fuso de referência.
- Primeira consulta dura 60 minutos e retorno dura 30.
- Um profissional atende um paciente por vez.
- O paciente pode cancelar a qualquer momento. Cancelar muda o status e nunca apaga o registro.
- Os perfis são paciente, recepção e profissional. O paciente vê, marca e cancela só as próprias consultas. A recepção marca e cancela para qualquer paciente e registra faltas. O profissional vê a própria agenda e bloqueia dias de folga.
- Bloquear uma folga não mexe nas consultas já marcadas naquele dia.
- Não existe encaixe, política de cancelamento tardio nem tratamento de faltas recorrentes.

## 5. Relatos da clínica

### Problemas relatados

- “Uma paciente disse que na tela dela a consulta aparece na quarta. Na agenda da recepção, a mesma consulta aparece na terça.”
- “Na semana passada o doutor ficou com dois pacientes no mesmo horário.”
- “Quando alguém cancela, ninguém mais consegue marcar naquele horário.”
- “Às vezes troco de profissional na agenda e continua aparecendo a agenda do anterior.”
- “Um paciente novo disse que a tela de consultas dele fica só carregando.”
- “Aconteceu uma vez de duas pessoas marcarem o mesmo horário. Não conseguimos reproduzir.”

### Pedidos e situações em aberto

- “Estamos perdendo dinheiro com cancelamentos no mesmo dia da consulta.”
- “A recepção precisa conseguir encaixar urgências, mesmo quando o horário já está ocupado.”
- “Um profissional vai tirar folga na sexta e já tem pacientes marcados. Não sabemos o que acontece com essas consultas.”
- “Tem paciente que falta toda semana. Queremos fazer alguma coisa.”

## 6. Funcionalidades pedidas

Ordene todas as funcionalidades abaixo por prioridade, com a justificativa de cada posição, e implemente duas delas.

- Lembrete automático da consulta, enviado 24 horas antes. Pode ser feito com n8n, como bônus (veja abaixo).
- Lista de espera para horários que forem liberados.
- Confirmação de presença pelo paciente.
- Remarcação pelo próprio paciente.
- Bloqueio de agenda por período, como férias.
- Histórico de consultas do paciente.
- Relatório de faltas.
- Busca de profissionais por especialidade.
- Exportação da agenda do dia em PDF.
- Tema escuro na área do paciente.

### Lembrete automático com n8n (bônus)

Se você escolher o lembrete automático como uma das duas funcionalidades, pode implementar do jeito que preferir. Fazer com n8n é a forma que mais valorizamos e conta como bônus. Faça de uma forma só, sem entregar o lembrete duas vezes. Quem escolher outras funcionalidades, ou fizer o lembrete de outro jeito, não perde pontos.

O ambiente já está pronto e roda todo na sua máquina, sem custo e sem conta em serviço externo.

- O Mailpit, em `http://localhost:8025`, sobe junto com o `npm run dev`. Ele é uma caixa de e-mail falsa. Tudo o que for enviado para o SMTP dele aparece lá, e nenhum e-mail sai de verdade. Serve para qualquer forma de lembrete, com n8n ou no código da api.
- O SMTP do Mailpit não tem usuário, senha nem SSL. De dentro do n8n, o servidor é `mailpit`, porta `1025`. Da api, que roda fora do Docker, é `localhost`, porta `1025`.
- `npm run n8n` sobe o n8n em `http://localhost:5678`. Na primeira vez, o Docker baixa a imagem do n8n, que tem cerca de 1,6 GB. No primeiro acesso, o n8n pede para criar um usuário, e esse cadastro fica só na sua máquina.
- De dentro do n8n, a api fica em `http://host.docker.internal:3333`, e ela precisa estar rodando com `npm run dev`.
- A rota `GET /integracoes/lembretes` devolve as consultas agendadas do dia seguinte, com nome e e-mail do paciente, profissional, especialidade, data e hora. Ela aceita `?data=AAAA-MM-DD` para testar com outro dia e exige o cabeçalho `x-chave-integracao` com o valor de `CHAVE_INTEGRACAO`, que está no `apps/api/.env`.

Se fizer com n8n, exporte o fluxo pelo menu do n8n e salve o arquivo em `n8n/lembrete.json` no repositório. No `DECISOES.md`, conte como montou o fluxo, como testou e o que mudaria para usar em produção.

## 7. Uso de IA

O uso de IA é permitido e bem-vindo, seja para entender o código, investigar erros, pensar em testes ou revisar a sua solução. Antes de aceitar uma sugestão, rode, teste e entenda o que ela faz.

Registre no `DECISOES.md` como você usou a IA, inclusive os pontos em que ela errou ou em que você descartou a sugestão, porque isso conta a seu favor.

## 8. Como entregar

1. Crie um repositório privado a partir deste template.
2. Adicione como colaborador o revisor indicado no e-mail.
3. Trabalhe com commits pequenos, sem squash. Queremos ver a ordem em que as coisas aconteceram.
4. Preencha o `DECISOES.md` na raiz do projeto.
5. Envie por e-mail o link do repositório e o hash do último commit.

## 9. Prazo, dúvidas e avaliação

O desafio começa na terça, 13/10, às 10h, e a entrega vai até quinta, 15/10, às 20h.

Mande as dúvidas pelo canal informado no e-mail. Se alguma regra parecer ambígua, você pode decidir, registrar a decisão no `DECISOES.md` e seguir em frente.

Três situações eliminam a entrega.

- Entrega fora do prazo.
- Projeto que não roda.
- Entrega sem o `DECISOES.md`.
