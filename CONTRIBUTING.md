# Contributing to Pulse Fit

Thank you for your interest in contributing to Pulse Fit! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose
- Git

### Development Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/Pedro-Monteiro-Fontes/pulse-fit.git
cd pulse-fit

# 2. Start the database
docker-compose up -d

# 3. Install dependencies (installs all workspaces)
npm install

# 4. Configure environment
cp api/.env.example api/.env
# Edit api/.env if needed

# 5. Run migrations and seed
cd api && npx prisma migrate dev --name init && npx prisma db seed && cd ..

# 6. Start development servers (two terminals)
npm run dev:api      # http://localhost:3333
npm run dev:frontend # http://localhost:5173
```

## Project Structure

```
pulse-fit/
├── shared/          # Zod schemas (single source of truth)
├── api/             # Express + Prisma backend
├── frontend/        # React + Vite + Tailwind SPA
└── docker-compose.yml
```

## Development Workflow

### Branch Naming

- `feat/<short-description>` — New features
- `fix/<short-description>` — Bug fixes
- `docs/<short-description>` — Documentation updates
- `refactor/<short-description>` — Code refactoring
- `chore/<short-description>` — Maintenance tasks

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Examples:
- `feat(api): add instructor CRUD endpoints`
- `fix(frontend): handle 409 conflict on duplicate email`
- `docs(readme): update installation instructions`
- `refactor(shared): simplify validation schemas`

### Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** with focused commits
3. **Run quality checks** locally:
   ```bash
   npm run lint
   npm run format
   npm run build
   ```
4. **Push your branch** and open a PR against `main`
5. **Fill out the PR template** completely
6. **Wait for CI to pass** (lint, typecheck, build)
7. **Address review feedback** if any
8. **Squash and merge** when approved

## Code Standards

### TypeScript

- Use strict mode (already configured)
- Prefer `type` over `interface` for simple shapes
- Use Zod schemas from `shared` for validation
- Avoid `any` — use `unknown` if type is truly unknown

### API Layer Architecture

```
routes → controllers → services → repositories → Prisma
```

- **Routes**: Define endpoints, call controllers
- **Controllers**: Thin, handle req/res, status codes
- **Services**: Business logic, bcrypt, JWT
- **Repositories**: Pure Prisma queries

### Frontend

- Use shadcn/ui components (copied, not installed as dependency)
- Validate with Zod `safeParse` before API calls
- Use React Router v6 for routing
- Axios instance with interceptors for auth

### Validation

- **Single source of truth**: Zod schemas in `shared/`
- **API**: `validarBody` middleware on all POST/PUT
- **Frontend**: `schema.safeParse(data)` before submit

### Status Codes

| Operation | Success | Errors |
|-----------|---------|--------|
| Create | 201 | 400 (validation), 409 (unique conflict) |
| Read (list) | 200 | — |
| Read (single) | 200 | 404 |
| Update | 200 | 400, 404, 409 |
| Delete | 204 | 404 |

## Testing

Tests are not yet implemented. When adding tests:

- Place unit tests next to the code (`*.test.ts`)
- Use Vitest for unit/integration tests
- Run with `npm run test` (to be configured)

## Documentation

- Update README.md for user-facing changes
- Update CLAUDE.md / AGENTS.md for architectural changes
- Document new environment variables in `.env.example`
- Swagger docs auto-generated from code (API)

## Security

- Never commit secrets (`.env`, keys, tokens)
- Report vulnerabilities via SECURITY.md process
- All inputs validated via Zod
- JWT tokens signed with strong secret
- Passwords hashed with bcrypt (cost 12)

## Release Process

Releases are manual for now:

1. Update version in `package.json` (root)
2. Update CHANGELOG.md
3. Create git tag: `git tag v1.0.0`
4. Push tag: `git push origin v1.0.0`
5. GitHub Actions builds and publishes (to be configured)

## Getting Help

- Check existing issues and PRs
- Read CLAUDE.md for architecture details
- Read AGENTS.md for development workflow
- Open a discussion or issue for questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.