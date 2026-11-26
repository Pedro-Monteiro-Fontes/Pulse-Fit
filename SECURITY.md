# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x.x   | ✅ Yes    |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

**Do not** create a public GitHub issue for security vulnerabilities.

Instead, please email us at: **security@pulsefit.example.com** (replace with actual email)

Include the following information:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days
- **Fix Timeline**: Depends on severity (see below)

## Severity Classification

| Severity | Description | Target Fix |
|----------|-------------|------------|
| Critical | Remote code execution, authentication bypass, data breach | 24-48 hours |
| High | SQL injection, XSS, privilege escalation | 1 week |
| Medium | Information disclosure, weak crypto, rate limit bypass | 2 weeks |
| Low | Minor issues, defense in depth improvements | Next release |

## Security Measures in Place

### Authentication & Authorization
- JWT tokens with configurable expiration (default 7 days)
- bcrypt password hashing (cost factor 12)
- Stateless auth — no server-side sessions
- Protected routes on frontend and API

### Input Validation
- Zod schemas for all API inputs (single source of truth in `shared/`)
- Frontend validation using same schemas
- `validarBody` middleware on all mutating endpoints

### API Security
- Helmet.js for security headers
- CORS configured for frontend origin only
- Rate limiting (express-rate-limit)
- Request size limits

### Database
- Parameterized queries via Prisma (prevents SQL injection)
- Unique constraints on sensitive fields (email, CPF)
- Soft deletes not implemented — hard deletes with confirmation

### Secrets Management
- `.env` files gitignored
- `.env.example` with placeholders only
- JWT_SECRET must be rotated in production
- Database credentials in Docker/environment only

### Frontend
- Content Security Policy via Helmet
- XSS protection via React's built-in escaping
- Axios interceptors for token management
- No sensitive data in localStorage (only JWT)

## Dependency Security

- Dependabot configured for weekly updates
- `npm audit` run in CI (when configured)
- Production dependencies minimized
- Dev dependencies separated

## Secure Development Practices

- Code review required for all changes
- CI pipeline with lint, typecheck, build
- Secret scanning with GitLeaks
- No direct commits to main (PR required)

## Contact

For security questions or concerns:
- Email: security@pulsefit.example.com
- GitHub: [Security Advisories](https://github.com/Pedro-Monteiro-Fontes/pulse-fit/security/advisories)

---

*This policy is a living document and will be updated as the project evolves.*