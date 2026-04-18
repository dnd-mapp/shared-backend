# @dnd-mapp/shared-backend

Shared NestJS infrastructure library for D&D Mapp backend services. Provides reusable dynamic
modules and configuration helpers that keep individual services thin and consistent.

## Installation

```bash
npm install @dnd-mapp/shared-backend
# or
pnpm add @dnd-mapp/shared-backend
```

## What's included

- **DatabaseModule** — manages the Prisma client lifecycle and MariaDB connection
- **HealthModule** — wires up Terminus health checks
- Config helpers for Fastify adapter, CORS, Helmet, rate limiting, validation, and serialization
- Class-validator decorator `@IsHost()` and an environment variable validation utility

## License

[MIT](./LICENSE)
