# 0001 — Module Federation con webpack y @module-federation/enhanced

**Estado:** Aceptado

**Fecha:** 2026-06-10

## Contexto

El proyecto necesita una arquitectura de micro-frontends donde el shell (host) pueda cargar dinámicamente los tres MFEs (mfe-explore, mfe-decide, mfe-checkout) en runtime sin conocer sus implementaciones internas en tiempo de compilación.

Se evaluaron dos opciones:
1. **@module-federation/enhanced** (webpack) — estándar de la industria, amplia comunidad, soporte nativo en Nx
2. **@angular-architects/native-federation** (esbuild) — más moderno, compatible con el builder por defecto de Angular 21

## Decisión

Se usa **@module-federation/enhanced 2.x con webpack** a través de `@nx/angular:webpack-browser` y los utilitarios de `@nx/module-federation`.

Los cuatro apps (shell + 3 MFEs) cambian del executor `@angular/build:application` (esbuild) al executor `@nx/angular:webpack-browser` (webpack).

## Consecuencias

**Positivo:**
- Integración probada en Nx con generadores y ejecutores dedicados
- `@nx/angular:module-federation-dev-server` orquesta el arranque de todos los remotes automáticamente
- Soporte para singletons de Angular/RxJS/zone.js sin configuración extra
- Compatible con `@module-federation/enhanced` ≥ 2.x que añade tipado y runtime mejorado

**Negativo:**
- Builds más lentos que esbuild (webpack vs esbuild)
- Requiere `@angular-devkit/build-angular` como dependencia adicional

**Convención crítica:** Los imports dinámicos en el shell deben usar guiones, NO guiones bajos: `import('mfe-explore/Routes')`. El helper `withModuleFederation` registra los remotes con su nombre de proyecto Nx (con guiones) como clave en `mappedRemotes`.
