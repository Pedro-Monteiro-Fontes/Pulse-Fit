# Pulse Fit — Documentação para Agentes IA

> **Projeto**: Sistema de gestão para academia (Pulse Fit)
> **Stack**: Monorepo npm (shared, api, frontend) — PostgreSQL + Prisma, Node/Express/TS, React/Vite/TS, Zod, JWT, Swagger, shadcn/ui + Tailwind
> **Modo**: Desenvolvimento solo, entrega em 3 dias

---

## 🎯 Visão Geral do Projeto

**Pulse Fit** é uma academia de alto desempenho que precisa substituir planilhas/WhatsApp/papel por um sistema centralizado. O software gerencia:

- **Instrutores** (nome, email, telefone, CREF)
- **Modalidades** (nome, descrição, instrutor responsável)
- **Alunos** (nome, CPF, email, telefone, data nascimento)
- **Matrículas** (aluno + modalidade + data início + status)
- **Usuários** (login da recepção/admin — bcrypt + JWT)

**Requisitos não-funcionais**: Validação rigorosa (Zod shared), status codes REST corretos, Swagger em `/docs`, seed realista, builds sem erro.

---

## 🏗️ Estrutura do Monorepo

```
pulse-fit/
├── package.json              # workspaces: shared, api, frontend
├── docker-compose.yml        # PostgreSQL 16
├── README.md                 # Documentação completa
├── NARRATIVA.md              # História do problema/solução
├── CLAUDE.md                 # Este arquivo
├── AGENTS.md                 # Guia dos agentes
├── shared/                   # Zod schemas (single source of truth)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/schemas/{instrutor,modalidade,aluno,matricula,usuario}.ts
├── api/                      # Backend Express + Prisma
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .env                  # gitignored
│   ├── prisma/schema.prisma  # Models + relations
│   ├── prisma/seed.ts        # Dados demo realistas
│   └── src/
│       ├── main.ts           # Bootstrap + Swagger
│       ├── config/           # env, jwt, prisma client
│       ├── middlewares/      # validarBody, auth, errorHandler
│       ├── routes/           # Por recurso + auth
│       ├── controllers/      # Thin, delegam para services
│       ├── services/         # Regras de negócio
│       ├── repositories/     # Prisma queries puras
│       └── utils/
└── frontend/                 # SPA React + Vite + Tailwind
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts        # Proxy /api → localhost:3333
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── index.css         # @tailwind base/components/utilities
        ├── components/       # shadcn/ui (button, input, select, dialog, table, toast, badge, avatar)
        ├── lib/axios.ts      # Instância + interceptors
        ├── hooks/
        ├── pages/            # Login, Cadastro, Home, Instrutores, Modalidades, Alunos, Matriculas
        ├── services/api.ts   # Chamadas tipadas
        └── types/            # Mirror do shared
```

---

## 🔑 Decisões Arquiteturais Fixas

| Decisão | Escolha | Não mude sem aprovação |
|---------|---------|------------------------|
| Monorepo | npm workspaces | ✅ |
| Validação | Zod em `shared/` | ✅ |
| Auth | JWT stateless + bcrypt | ✅ |
| UI | shadcn/ui + Tailwind | ✅ |
| Banco | PostgreSQL via Docker | ✅ |
| Seed | CPF/CREF válidos algoritmicamente | ✅ |
| Camadas API | routes → controllers → services → repositories | ✅ |
| Status codes | 201, 204, 400, 404, 409 | ✅ |
| Proxy Vite | `/api` → `localhost:3333` | ✅ |

---

## 📋 Cronograma (3 Dias)

### Dia 1 — API Completa
- Repo + Shared + API Core (Prisma, config, middlewares)
- CRUD Instrutor/Modalidade/Aluno/Matricula + Auth + Swagger + Seed
- Build API + Testes manuais (curl)

### Dia 2 — Frontend Completo
- Scaffold Vite + React + TS + Tailwind + shadcn/ui
- Axios service + tipos + rotas
- 7 páginas: Login, Cadastro, Home, 4 CRUDs
- Build Frontend + Integração

### Dia 3 — Polimento + Entrega
- Code review (arquitetura, segurança, bugs, performance)
- Fixes + lint/format + builds limpos
- README final + verificação do zero

---

## 🛠️ Skills Disponíveis (Use conforme necessário)

| Skill | Quando usar |
|-------|-------------|
| `ponytail:ponytail` | Sempre — menor código que resolve |
| `mattpocock-skills:tdd` | Test-first se pedido |
| `mattpocock-skills:diagnosing-bugs` | Debug de falhas |
| `grill:grill-core` / `grill:security` / `grill:architecture` | Reviews profundos |
| `impeccable:impeccable` | Frontend UI/UX |
| `frontend-design:frontend-design` | Direção visual distinta |
| `artifact-design` / `artifact-diagramming` | Se criar artifacts HTML |
| `code-review` | Review de diffs |
| `simplify` | Limpeza de código |

---

## 📝 Regras de Código (Ponytail Mode)

1. **Menor mudança completa** — não adicione o que não foi pedido
2. **Reutilize existente** — helpers, patterns, configs já no repo
3. **Stdlib/Platform first** — CSS nativo > JS, constraint DB > app code
4. **Deps instaladas > nova dep** — nunca adicione dep para poucas linhas
5. **Uma linha se dá pra ler** — senão, mínimo que funciona
6. **Sem abstração/boilerplate "para depois"**
7. **Shortcut com comentário**: `shortcut: <limite>, <quando upgradear>`
8. **Nunca corte**: validação nas fronteiras, error handling que previne perda, segurança, acessibilidade, pedido explícito do usuário
9. **Nova lógica non-trivial → 1 teste/assert** (trivial não precisa)

---

## ✅ Definition of Done (Global)

- [ ] `docker-compose up -d` → PostgreSQL saudável
- [ ] `npm install` (raiz) → instala shared, api, frontend sem erro
- [ ] `npx prisma migrate dev` (em api) → tabelas criadas
- [ ] `npx prisma db seed` (em api) → dados carregados
- [ ] `npm run build:api` → compila TypeScript sem erro
- [ ] `npm run build:frontend` → build Vite otimizado sem erro
- [ ] `npm run dev:api` + `npm run dev:frontend` → ambos rodam juntos
- [ ] Fluxo manual: login → CRUD 4 telas → busca → erro validação → erro 404 → delete confirm
- [ ] Swagger em `/docs` completo
- [ ] `npm run lint` + `npm run format` passam

---

## 🔐 Variáveis de Ambiente

| Arquivo | Variáveis |
|---------|-----------|
| `api/.env.example` | `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `NODE_ENV` |
| `api/.env` | Copiado do example + `JWT_SECRET` gerado (gitignored) |

---

## 📦 Scripts Principais (Root)

```json
{
  "scripts": {
    "dev:api": "npm run dev -w api",
    "dev:frontend": "npm run dev -w frontend",
    "build:api": "npm run build -w api",
    "build:frontend": "npm run build -w frontend",
    "build": "npm run build:api && npm run build:frontend",
    "db:up": "docker-compose up -d",
    "db:down": "docker-compose down",
    "db:migrate": "npm run prisma:migrate -w api",
    "db:seed": "npm run prisma:seed -w api",
    "db:studio": "npm run prisma:studio -w api",
    "lint": "npm run lint -w api && npm run lint -w frontend && npm run lint -w shared",
    "format": "npm run format -w api && npm run format -w frontend && npm run format -w shared"
  }
}
```

---

## 🚫 O que NÃO fazer (até pedido explícito)

- ❌ Escrever código de produção (controllers, services, páginas, componentes)
- ❌ Criar testes automatizados
- ❌ Implementar lógica de negócio
- ❌ Adicionar dependências não listadas nos package.json atuais
- ❌ Mudar decisões arquiteturais fixas
- ❌ Criar arquivos fora da estrutura definida