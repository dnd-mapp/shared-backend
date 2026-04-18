# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- (n/a)

### Changed

- (n/a)

### Deprecated

- (n/a)

### Removed

- (n/a)

### Fixed

- (n/a)

### Security

- (n/a)

---

## [1.0.0] - 2026-04-18

### Added

- `ConfigModule` with Fastify adapter setup, CORS, Helmet, throttler, class-transform, and serialization configuration
- Environment variable validation with `validateEnvironmentVariables` and `IsHost` decorator
- `DatabaseModule` providing a Prisma-based database service with MariaDB adapter support
- `HealthModule` exposing a `/health` endpoint via `@nestjs/terminus`
- GitHub Actions workflows for pull requests, main branch pushes, tag pushes, and releases
- Dependabot configuration for automated dependency updates
- ESLint, Prettier, markdownlint, and EditorConfig tooling setup
- Vitest test configuration with coverage support
- Vite build configuration producing ESM, CJS, and type declaration outputs

---
