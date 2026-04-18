# @dnd-mapp/shared-backend

Shared NestJS infrastructure library for D&D Mapp backend services.

## Prerequisites

This repository uses [mise](https://mise.jdx.dev/) to manage Node.js and pnpm versions. Refer to the
[mise configuration guide](https://github.com/dnd-mapp/.github/blob/main/docs/mise-configuration.md)
for setup instructions.

Once mise is configured, install dependencies:

```bash
mise install
pnpm install
```

## Scripts

| Command | Description |
|:--------|:------------|
| `pnpm build` | Production build (ESM + CJS + type declarations) |
| `pnpm build:development` | Watch mode build |
| `pnpm test` | Run unit tests with Vitest |
| `pnpm lint` | Lint with markdownlint and ESLint |
| `pnpm format:write` | Format with Prettier |
| `pnpm format:check` | Check formatting |

## License

[MIT](./LICENSE)
