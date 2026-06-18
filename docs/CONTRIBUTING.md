# Guía de contribución — The Tractor Store

## Requisitos previos

- Node.js 20+
- pnpm 9+
- Java 21 (para el backend)

## Instalación

```bash
pnpm install
```

## Levantar el entorno de desarrollo

```bash
# Todos los apps en paralelo (shell + 3 MFEs)
pnpm dev

# Solo el shell (inicia los MFEs automáticamente vía devRemotes)
nx serve shell

# Un MFE en particular (standalone)
nx serve mfe-explore
nx serve mfe-decide
nx serve mfe-checkout

# Storybook del design system
pnpm storybook
```

## Flujo de trabajo

### Ramas

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Feature | `feat/nombre-descriptivo` | `feat/catalog-store-signals` |
| Fix | `fix/nombre-descriptivo` | `fix/minicart-shadow-dom-event` |
| Docs | `docs/nombre-descriptivo` | `docs/adr-module-federation` |
| Test | `test/nombre-descriptivo` | `test/cart-store-coverage` |

### Commits

Usamos **Conventional Commits**:

```
feat: descripción de la nueva funcionalidad
fix: descripción del bug corregido
docs: cambios en documentación
test: tests nuevos o modificados
refactor: refactorización sin cambio de comportamiento
chore: mantenimiento, dependencias, configuración
```

Un commit = un cambio lógico. No mezclar refactors con features.

### Pull Requests

1. Crear la rama desde `main`
2. Implementar el cambio con tests
3. Verificar que CI pase: lint + test + buildr

## Calidad

```bash
# Tests unitarios
nx run-many --target=test --all

# Tests afectados por cambios actuales
nx affected --target=test

# Lint
nx run-many --target=lint --all

# Build completo
nx run-many --target=build --all
```

### Cobertura mínima

- **Global**: 80%
- **Código nuevo**: 85%

SonarCloud bloquea el merge si no se cumplen estos umbrales.

## Convenciones de código

### Reglas obligatorias

- `strict: true` en TypeScript — nunca usar `any`
- Standalone components siempre (`standalone: true`) — nunca NgModules
- `OnPush` change detection en todos los componentes del design system
- Destrucción de observables con `takeUntilDestroyed()`
- Ningún `console.log` en código que se mergea a `main`
- Ningún TODO sin issue: `// TODO(#123): descripción`
- Ningún color/espaciado hardcodeado — solo CSS Custom Properties de `design-tokens`

### Reglas de módulos (Nx boundaries)

```
scope:explore  ─┐
scope:decide   ─┤  NO pueden importarse entre sí
scope:checkout ─┘
     ↓
scope:shared       Todos pueden importar desde aquí
     ↓
scope:shared       NO puede importar de nadie
```

## Agregar un nuevo componente al design system

1. Crear los archivos en `packages/ts-design-system/src/lib/<nombre>/`
2. Exportar desde `packages/ts-design-system/src/index.ts`
3. Agregar al registro en `packages/ts-design-system/src/elements.ts`
4. Crear story en `*.stories.ts`
5. Escribir tests con cobertura ≥ 85%
6. Documentar si modifica la API pública de un componente existente

## Agregar un nuevo evento cross-MFE

1. Definir el tipo del evento en `packages/shared-catalog/src/lib/events.ts`
2. Agregar la constante al objeto `CART_EVENTS` o `EXPLORE_EVENTS` (según scope)
3. Documentar el contrato en el ADR correspondiente o crear uno nuevo
4. Usar `bubbles: true` y `composed: true` siempre

## Architecture Decision Records

Cualquier decisión técnica significativa (nueva dependencia, cambio de patrón, modificación de la arquitectura MF) requiere un ADR en `docs/adr/`. Ver [`docs/adr/README.md`](./adr/README.md) para el formato.
