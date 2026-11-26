# Pulse Fit — Sistema de Gestão para Academia

> **Pulse Fit** é uma academia de alto desempenho e bem-estar. Este sistema nasceu da necessidade real de substituir planilhas, WhatsApp e cadernos por uma plataforma centralizada, confiável e escalável para gerenciar instrutores, modalidades, alunos e matrículas.

---

## 🎯 O Problema

Uma academia com 350+ alunos, 8 instrutores e 12 modalidades não se gere no "jeitinho":

| Antes | Dor |
|-------|-----|
| Planilhas compartilhadas | Dados sobrescritos, matrículas perdidas |
| WhatsApp para agendar | Overbooking, resposta lenta, aluno sem vaga |
| Fichas de papel | CPF/e-mail errado, impossível contactar |
| Caderno de mensalidades | 40+ inadimplentes invisíveis, receita vazando |
| Instrutores sem visão | Professor não sabe quem são seus alunos novos |
| Relatórios manuais | 6h/semana montando planilhas de ocupação |

---

## 💡 A Solução

Sistema web full-stack que centraliza tudo:

- **CRUD completo** de Instrutores, Modalidades, Alunos e Matrículas
- **Validação rigorosa** (CPF, e-mail, telefone) — dado sujo não entra
- **Relacionamentos claros**: Matrícula liga Aluno ↔ Modalidade (que tem Instrutor)
- **Busca instantânea** por nome/CPF
- **Seletores (select)** no formulário — ninguém digita ID à mão
- **Login seguro** (bcrypt + JWT) — só recepcionista/admin acessa
- **Documentação automática** via Swagger
- **Dados de demonstração** realistas (seed)

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      MONOREPO (npm workspaces)              │
├──────────────┬──────────────────────┬───────────────────────┤
│   shared     │        api           │      frontend         │
│  (Zod schemas)│  (Node/Express/TS)  │   (React/Vite/TS)     │
└──────────────┴──────────────────────┴───────────────────────┘
```

### Camadas da API (padrão Clean Architecture)

```
routes → controllers → services → repositories → Prisma → PostgreSQL
```

- **Routes**: Definem endpoints, chamam controllers
- **Controllers**: Recebem req/res, validam params, chamam services, retornam status codes corretos
- **Services**: Regras de negócio, orquestram repositories, hasheiam senha, geram JWT
- **Repositories**: Queries Prisma puras (findMany, findUnique, create, update, delete)

### Validação Compartilhada (Zod)

- Schemas definidos **uma vez** em `shared/`
- Usados na **API** (middleware `validarBody`) e no **Frontend** (`safeParse`)
- Erro 400 com mensagem por campo — consistência garantida

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Por que |
|--------|------------|---------|
| **Banco** | PostgreSQL 16 (Docker) | Robusto, relacional, ACID |
| **ORM** | Prisma | Type-safe, migrations, seed, studio |
| **API** | Node 20 + Express + TypeScript | Padrão de mercado, ecossistema maduro |
| **Validação** | Zod | Schema-first, inferência de tipos, DX excelente |
| **Auth** | bcrypt + JWT (stateless) | Seguro, escalável, sem sessão no servidor |
| **Docs** | Swagger/OpenAPI 3 | `/docs` interativo, contratos vivos |
| **Frontend** | React 18 + Vite + TypeScript | Dev server rápido, HMR, build otimizado |
| **UI** | shadcn/ui + Tailwind CSS | Acessível, copiável (sem dep pesada), customizável |
| **HTTP** | Axios + interceptors | Instância única, refresh token, erro global |
| **Roteamento** | React Router v6 | Padrão da indústria, type-safe |

---

## 🗃️ Modelo de Dados

### Entidades Principais

```
Instrutor (1) ──────< (N) Modalidade
                            │
                            │ (N)
                            ▼
Aluno (1) ─────────> (N) Matrícula <──── (N) Modalidade
```

| Tabela | Campos-chave | @unique |
|--------|--------------|---------|
| **Instrutor** | id, nome, email, telefone, cref | email |
| **Modalidade** | id, nome, descricao, instrutorId | nome |
| **Aluno** | id, nome, cpf, email, telefone, dataNascimento | cpf, email |
| **Matricula** | id, alunoId, modalidadeId, dataInicio, status | (alunoId, modalidadeId) |
| **Usuario** | id, nome, email, senhaHash | email |

> **Matrícula** é a tabela "ponte" obrigatória — liga Aluno e Modalidade (duas FKs).

---

## 🔐 Decisões Arquiteturais

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| **Monorepo** | npm workspaces (shared, api, frontend) | `npm install` único, types compartilhados, versionamento atômico |
| **Validação** | Zod no `shared` | Single source of truth; front + back usam o mesmo schema |
| **Auth** | JWT stateless + bcrypt | Simples para SPA + API separada; sem sticky sessions |
| **UI** | shadcn/ui (Radix + Tailwind) | Acessível por padrão, sem runtime pesado, copy-paste components |
| **Banco** | PostgreSQL via Docker | Ambiente idêntico dev/prod; `docker-compose up` sobe tudo |
| **Seed** | Dados realistas (CPF/CREF válidos algoritmicamente) | Demo pronta, seed documenta o modelo |
| **Status codes** | 201 (create), 204 (delete), 400 (validation), 404 (not found), 409 (unique conflict) | REST semântico, frontend trata erros por código |

---

## 🚀 Como Rodar (Desenvolvimento)

> **Pré-requisitos**: Node 20+, Docker, npm 10+

```bash
# 1. Clone e entre no diretório
git clone <repo-url>
cd pulse-fit

# 2. Suba o banco
docker-compose up -d

# 3. Instale dependências (raiz instala todos workspaces)
npm install

# 4. Configure variáveis de ambiente
cp api/.env.example api/.env
# Edite api/.env se needed (JWT_SECRET já vem gerado)

# 5. Rode migrations e seed
cd api
npx prisma migrate dev --name init
npx prisma db seed
cd ..

# 6. Inicie API e Frontend (terminais separados)
npm run dev:api      # http://localhost:3333
npm run dev:frontend # http://localhost:5173

# 7. Acesse
# - Frontend: http://localhost:5173
# - API Docs (Swagger): http://localhost:3333/docs
```

### Credenciais de Demo (do seed)

```
Email:    admin@pulsefit.com
Senha:    pulsefit123
```

---

## 📦 Scripts Principais

```json
// package.json (raiz)
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

## ✅ Definition of Done

- [ ] `docker-compose up -d` → PostgreSQL saudável
- [ ] `npm install` → instala shared, api, frontend sem erro
- [ ] `npx prisma migrate dev` → tabelas criadas
- [ ] `npx prisma db seed` → dados carregados (2 instrutores, 3 modalidades, 4 alunos, 4 matrículas, 1 admin)
- [ ] `npm run build:api` → compila TypeScript sem erro
- [ ] `npm run build:frontend` → build Vite otimizado sem erro
- [ ] `npm run dev:api` + `npm run dev:frontend` → ambos rodam juntos
- [ ] Fluxo manual: login → CRUD nas 4 telas → busca → erro validação → erro 404 → delete confirm
- [ ] Swagger em `/docs` completo com todos endpoints
- [ ] ESLint + Prettier passam (`npm run lint`, `npm run format`)

---

## 📁 Estrutura do Projeto

```
pulse-fit/
├── package.json              # workspaces: shared, api, frontend
├── docker-compose.yml        # PostgreSQL 16
├── README.md                 # Este arquivo
├── NARRATIVA.md              # História completa do problema/solução
├── shared/                   # Pacote compartilhado (Zod schemas)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── schemas/
│       │   ├── instrutor.ts
│       │   ├── modalidade.ts
│       │   ├── aluno.ts
│       │   ├── matricula.ts
│       │   └── usuario.ts
│       └── index.ts
├── api/                      # Backend (Express + Prisma)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .env                  # Não versionado (gitignore)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── main.ts
│       ├── config/
│       ├── middlewares/
│       ├── routes/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       └── utils/
└── frontend/                 # SPA (React + Vite + Tailwind)
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── components/       # shadcn/ui components
        ├── lib/
        ├── hooks/
        ├── pages/
        ├── services/
        └── types/
```

---

## 📖 Documentação Adicional

- **[NARRATIVA.md](./NARRATIVA.md)** — História completa: problema real, personas, métricas de sucesso
- **Swagger UI** — `http://localhost:3333/docs` (quando API rodando)
- **Prisma Studio** — `npm run db:studio` (interface visual do banco)

---

## 🤝 Contribuição

Projeto solo — mas issues e PRs são bem-vindos para melhorias.

---

## 📄 Licença

MIT — use livremente.