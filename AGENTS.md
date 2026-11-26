# Pulse Fit — Guia dos Agentes de Desenvolvimento

> **Objetivo**: Definir papéis, responsabilidades, skills e fluxos para cada agente que atuará no projeto.
> **Modo**: Orquestração via subagents nativos do Claude Code (ferramenta `Agent`).

---

## 🎭 Agentes e Papéis

### 1. BUILDER-API (Builder 1)
**Responsabilidade**: `shared/` + `api/` completos

| Atributo | Detalhe |
|----------|---------|
| **Subagent type** | `general-purpose` |
| **Modelo** | Sonnet/Opus (high effort) |
| **Escopo** | Dia 1 inteiro |
| **Entregáveis** | Prisma schema, migrations, seed, Express app, middlewares, routes, controllers, services, repositories, Swagger, Zod schemas |

#### Skills Obrigatórias
- `ponytail:ponytail` — menor código que resolve
- `mattpocock-skills:tdd` — se pedidos testes
- `grill:architecture` — review próprio da estrutura

#### Fluxo de Trabalho
1. **Scaffold**: `shared/package.json`, `shared/tsconfig.json`, `shared/src/schemas/*.ts` (Zod create/update/response + types)
2. **Prisma**: `schema.prisma` (models + relations + @@unique), `seed.ts` (dados realistas)
3. **Config**: `api/src/config/{env.ts, jwt.ts, prisma.ts}`
4. **Middlewares**: `validarBody.ts` (Zod parse → 400), `auth.ts` (JWT verify), `errorHandler.ts`
5. **Camadas por recurso** (Instrutor, Modalidade, Aluno, Matricula, Auth):
   - `repository.ts` → Prisma queries puras
   - `service.ts` → regras negócio, bcrypt, JWT
   - `controller.ts` → thin, status codes corretos
   - `routes.ts` → endpoints + validarBody + auth
6. **Swagger**: `main.ts` + specs YAML/JSON
7. **Build + Test**: `npm run build:api`, `docker-compose up`, `prisma migrate dev`, `prisma db seed`, curl endpoints

#### Checklist de Qualidade (Auto-review)
- [ ] Camadas separadas (routes não tocam Prisma)
- [ ] Zod schemas no `shared/` exportados
- [ ] `validarBody` em todo POST/PUT
- [ ] Status codes: 201, 204, 400, 404, 409
- [ ] Senha nunca em resposta
- [ ] Swagger completo em `/docs`
- [ ] Seed roda sem erro
- [ ] `npm run build:api` passa

---

### 2. BUILDER-FRONTEND (Builder 2)
**Responsabilidade**: `frontend/` completo

| Atributo | Detalhe |
|----------|---------|
| **Subagent type** | `general-purpose` |
| **Modelo** | Sonnet/Opus (high effort) |
| **Escopo** | Dia 2 inteiro |
| **Entregáveis** | Vite+React+TS+Tailwind, shadcn/ui components, páginas, services, hooks, routing |

#### Skills Obrigatórias
- `ponytail:ponytail` — menor código que resolve
- `impeccable:impeccable` — UI/UX distinta, acessível
- `frontend-design:frontend-design` — direção visual intencional
- `artifact-design` — se criar artifacts HTML

#### Fluxo de Trabalho
1. **Scaffold**: `package.json`, `tsconfig.json`, `vite.config.ts` (proxy `/api`), `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/index.css`
2. **Design System**: Instalar copiar componentes shadcn/ui (button, input, select, dialog, table, toast, badge, avatar, label, card)
3. **Core**: `lib/axios.ts` (instância + interceptors JWT + erro global), `services/api.ts` (chamadas tipadas usando Zod types do shared), `hooks/` (useAuth, useApi)
4. **Auth Pages**: `Login.tsx`, `Cadastro.tsx` (validação Zod `safeParse` antes de enviar)
5. **Layout**: `Home.tsx` (menu lateral, logout, protected routes)
6. **CRUD Pages** (4 telas, padrão idêntico):
   - Lista: `useEffect` fetch, busca por texto (`.filter`), loading/error states
   - Modal criar/editar: `Dialog` + `Form` + selects preenchidos por API (FKs)
   - Delete: `AlertDialog` confirmação
   - Erros da API: toast + inline nos campos
7. **Build + Integração**: `npm run build:frontend`, `dev:api` + `dev:frontend` juntos, fluxo manual completo

#### Checklist de Qualidade (Auto-review)
- [ ] shadcn/ui components copiados (não dependência)
- [ ] Tailwind configurado + `@tailwind` no CSS
- [ ] Axios interceptors: JWT auto-attach, 401 → logout, erro global toast
- [ ] Validação Zod `safeParse` no frontend (mesmo schema do shared)
- [ ] Selects para FKs (nunca digita ID)
- [ ] Busca por texto em pelo menos 1 lista
- [ ] Erros aparecem perto do campo + toast
- [ ] `npm run build:frontend` passa
- [ ] Integração API+Frontend funciona

---

### 3. REVIEWER (Reviewer)
**Responsabilidade**: Code review readonly de todo o diff (Dia 3 manhã)

| Atributo | Detalhe |
|----------|---------|
| **Subagent type** | `general-purpose` (read-only) |
| **Modelo** | Opus (max effort) |
| **Escopo** | Dia 3 manhã (2-3h) |
| **Entregáveis** | Relatório de findings ordenado por severidade |

#### Skills Obrigatórias
- `grill:grill-core` — convenções de review
- `grill:architecture` — boundaries, coupling, data flow
- `grill:security` — auth, input validation, secrets, deps
- `grill:edge-cases` — race conditions, boundary values, partial failures
- `grill:error-handling` — logging, observability, config
- `code-review` — standards + spec compliance

#### Foco do Review (Não mude código, só reporte)

| Dimensão | O que verificar |
|----------|-----------------|
| **Arquitetura** | Camadas respeitadas? Shared types usados? Coupling baixo? |
| **Segurança** | JWT válido? Bcrypt? Senha em resposta? SQL injection? XSS? CORS? Rate limit? |
| **Validação** | Zod em todo POST/PUT? Frontend usa mesmo schema? Erros 400 claros? |
| **Status Codes** | 201/204/400/404/409 corretos? |
| **Swagger** | Todos endpoints documentados? Schemas corretos? |
| **Seed** | Dados realistas? CPF/CREF válidos? Admin criado? |
| **Frontend** | Protected routes? Loading/error states? Acessibilidade? Selects FKs? |
| **Builds** | `build:api` e `build:frontend` passam? Lint/format passam? |
| **Edge Cases** | Unique conflict → 409? 404 em ID inexistente? Concurrent requests? |

#### Formato de Saída
```markdown
## Review Findings — Pulse Fit

### 🔴 CRITICAL (bloqueia entrega)
- [ ] Finding: descrição + file:line + cenário de falha

### 🟡 HIGH (deve corrigir)
- [ ] Finding: ...

### 🟢 MEDIUM (deveria corrigir)
- [ ] Finding: ...

### 🔵 LOW / NIT (opcional)
- [ ] Finding: ...
```

---

### 4. TESTER (Tester)
**Responsabilidade**: Verificação automatizada e manual (Dia 1 noite, Dia 2 noite, Dia 3 final)

| Atributo | Detalhe |
|----------|---------|
| **Subagent type** | `general-purpose` |
| **Modelo** | Sonnet (medium effort) |
| **Escopo** | Pontos de verificação definidos no plano |
| **Entregáveis** | Relatório PASS/FAIL por critério |

#### Skills Obrigatórias
- `mattpocock-skills:tdd` — mentalidade test-first
- `grill:testing` — coverage, quality, CI/CD

#### Checklist de Execução

**Dia 1 Noite (API)**
- [ ] `docker-compose up -d` → container healthy
- [ ] `npm install` (raiz) → 3 workspaces instalados
- [ ] `cd api && npx prisma migrate dev --name init` → tabelas criadas
- [ ] `npx prisma db seed` → 2 instrutores, 3 modalidades, 4 alunos, 4 matrículas, 1 usuário
- [ ] `npm run build:api` → compila sem erro
- [ ] `npm run dev:api` → sobe em :3333
- [ ] Swagger abre em `http://localhost:3333/docs`
- [ ] curl POST/GET/PUT/DELETE cada recurso → status codes corretos
- [ ] curl POST `/auth/login` com seed → retorna token
- [ ] curl POST `/auth/register` → 201 + usuário criado
- [ ] Unique conflict (email/CPF duplicado) → 409 mensagem clara

**Dia 2 Noite (Frontend + Integração)**
- [ ] `npm run build:frontend` → build Vite sem erro
- [ ] `npm run dev:frontend` → sobe em :5173
- [ ] Proxy `/api` → `localhost:3333` funciona (sem CORS error)
- [ ] Login com credenciais seed → redireciona Home
- [ ] Cadastro novo usuário → sucesso
- [ ] 4 CRUD pages: lista carrega, busca filtra, modal cria/edita, delete confirma
- [ ] Selects FKs preenchidos (Instrutor em Modalidade, Aluno+Modalidade em Matricula)
- [ ] Erro validação aparece inline + toast
- [ ] Erro 404 (ID inexistente) tratado
- [ ] Logout funciona

**Dia 3 Final (Verificação Do Zero)**
- [ ] `docker-compose down -v` (limpa volumes)
- [ ] `docker-compose up -d`
- [ ] `npm install`
- [ ] `cd api && npx prisma migrate dev --name init`
- [ ] `npx prisma db seed`
- [ ] `npm run build:api && npm run build:frontend`
- [ ] `npm run dev:api` + `npm run dev:frontend`
- [ ] Fluxo completo manual → tudo funciona

#### Formato de Saída
```markdown
## Test Report — Pulse Fit — Dia X

### ✅ PASS
- Critério: evidência

### ❌ FAIL
- Critério: erro + file:line + como reproduzir

### ⚠️ SKIPPED (não aplicável ainda)
- Critério: motivo
```

---

### 5. LEAD (Orquestrador — Você/Eu)
**Responsabilidade**: Coordenação, integração, decisões, commits, README final

| Atributo | Detalhe |
|----------|---------|
| **Papel** | Humano + IA no loop principal |
| **Ferramentas** | `Agent` tool para disparar subagents, `Bash`/`Read`/`Write`/`Edit` para integração |

#### Fluxo de Orquestração

```
DIA 1:
  Lead → Dispara BUILDER-API (prompt completo com CLAUDE.md + AGENTS.md)
  Lead → Aguarda resultado
  Lead → Dispara TESTER (Dia 1 noite)
  Lead → Integra fixes se TESTER reportar FAIL

DIA 2:
  Lead → Dispara BUILDER-FRONTEND (prompt completo)
  Lead → Aguarda resultado
  Lead → Dispara TESTER (Dia 2 noite)
  Lead → Integra fixes

DIA 3:
  Lead → Dispara REVIEWER (read-only, todo diff)
  Lead → Analisa findings → Dispara BUILDER-API/FRONTEND para fixes
  Lead → Roda TESTER final (do zero)
  Lead → Escreve README.md final
  Lead → Commits organizados + push
```

#### Prompt Template para Subagents

```markdown
# Contexto
- Projeto: Pulse Fit (academia)
- CLAUDE.md: [anexar ou referenciar]
- AGENTS.md: [este arquivo]
- Fase atual: Dia X — [API/Frontend/Review/Test]

# Sua Missão
[Descrição específica da fase — ver checklist do seu agente acima]

# Constraints
- Ponytail mode: menor código completo
- Não mude decisões arquiteturais fixas (ver CLAUDE.md)
- Use skills obrigatórias listadas acima
- Retorne: arquivos criados/modificados, comandos rodados, checklist PASS/FAIL

# Definition of Done
[Checklist específico da fase]
```

---

## 🔄 Comunicação entre Agentes

| De → Para | Artefato | Como |
|-----------|----------|------|
| Lead → Builder | Prompt + CLAUDE.md + AGENTS.md | `Agent` tool |
| Builder → Lead | Resumo + files changed + checklist | Return value do Agent |
| Lead → Reviewer | Diff completo (git diff) | `Bash: git diff` + prompt |
| Reviewer → Lead | Findings markdown | Return value |
| Lead → Builder (fix) | Findings filtrados + prioridade | Novo `Agent` prompt |
| Tester → Lead | Test report markdown | Return value |

---

## 📦 Commits Sugeridos (Lead executa)

```bash
# Dia 1
git add -A && git commit -m "feat: chore(repo): init monorepo with workspaces"
git add -A && git commit -m "feat: shared: add Zod schemas for all entities"
git add -A && git commit -m "feat: api: prisma schema + migrations + seed"
git add -A && git commit -m "feat: api: core config, middlewares, prisma client"
git add -A && git commit -m "feat: api: auth (register/login, bcrypt, JWT)"
git add -A && git commit -m "feat: api: CRUD Instrutor + Swagger"
git add -A && git commit -m "feat: api: CRUD Modalidade + Swagger"
git add -A && git commit -m "feat: api: CRUD Aluno + Swagger"
git add -A && git commit -m "feat: api: CRUD Matricula + Swagger (include relations)"

# Dia 2
git add -A && git commit -m "feat: frontend: scaffold Vite+React+TS+Tailwind+shadcn"
git add -A && git commit -m "feat: frontend: axios service + types + routing"
git add -A && git commit -m "feat: frontend: Login/Cadastro pages + auth context"
git add -A && git commit -m "feat: frontend: Home + layout + menu"
git add -A && git commit -m "feat: frontend: Instrutores CRUD page"
git add -A && git commit -m "feat: frontend: Modalidades CRUD page"
git add -A && git commit -m "feat: frontend: Alunos CRUD page"
git add -A && git commit -m "feat: frontend: Matriculas CRUD page"

# Dia 3
git add -A && git commit -m "fix: reviewer findings (post-review)"
git add -A && git commit -m "chore: lint/format + builds clean"
git add -A && git commit -m "docs: README.md complete with run instructions"
```

---

## ⚠️ Regras de Ouro (Todos Agentes)

1. **Não escreva código de produção até o Lead pedir a fase específica**
2. **Configuração primeiro, produção depois** — estrutura inicial completa antes de qualquer lógica
3. **Ponytail sempre** — se dá pra fazer em 1 linha legível, faça em 1 linha
4. **Reutilize o que já existe** — configs, types, patterns do repo
5. **Skills obrigatórias** — carregue via `Skill` tool antes de começar
6. **Read-only quando for review/test** — não mude código nessas fases
7. **Report conciso** — Lead precisa de sinal verde/vermelho, não transcrição
8. **Uma fase por vez** — Lead orquestra, não rode fases em paralelo sem ok

---

## 🎯 Próximo Passo Imediato

**Lead**: Estrutura inicial já criada (configs, schemas Prisma, package.json's). 

Aguardando sinal para iniciar **Dia 1 — Builder API** com prompt completo.

Quando pronto, Lead dispara:
```bash
# Via Agent tool
Agent({
  subagent_type: "general-purpose",
  prompt: "[Prompt completo do Builder API — ver seção acima]",
  description: "Dia 1: Build API completa (shared + api)"
})
```