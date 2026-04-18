# Architecture

## Purpose

`@dnd-mapp/shared-backend` is a library package containing NestJS infrastructure shared across D&D Mapp backend services. It is not a runnable application.

## Module structure

### `DatabaseModule`

Dynamic module. Consuming apps call `DatabaseModule.forRoot(PrismaClient, options)` passing their own generated Prisma client class. The module is schema-agnostic — it only handles the MariaDB adapter lifecycle.

```ts
DatabaseModule.forRoot(PrismaClient, { log: ['error'] });
```

### `HealthModule`

Dynamic module. Consuming apps call `HealthModule.forRoot(HealthController)` passing their own controller class(es). The module sets up `TerminusModule` and `DatabaseModule` so health indicators are available via DI.

```ts
HealthModule.forRoot(MyAppHealthController);
```

Each app implements its own `HealthController` with app-specific readiness checks (DB + downstream services).

### Config functions

All configuration functions accept an optional `overrides` parameter. Apps only pass overrides when they diverge from the shared defaults. Call sites that use the defaults pass no second argument.

## Testing

Unit tests live next to source files (`*.spec.ts`). Config functions are tested as pure functions. `DatabaseService` is tested with a mocked Prisma client via `Test.createTestingModule()`.
