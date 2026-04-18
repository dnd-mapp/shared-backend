# Setup

## Prerequisites

- Node.js `~24.14` (Mise reads version from `package.json`)
- pnpm `10.33.0`

## Install dependencies

```bash
pnpm install
```

## Build

```bash
pnpm build
```

Watch mode (development):

```bash
pnpm build-dev
```

## Test

```bash
pnpm test
```

Interactive UI:

```bash
pnpm test:development
```

## Lint & format

```bash
pnpm lint
pnpm format:write
```

## Publishing

The package is published to the `@dnd-mapp` npm scope. Build before publishing:

```bash
pnpm build
pnpm publish --access restricted
```
