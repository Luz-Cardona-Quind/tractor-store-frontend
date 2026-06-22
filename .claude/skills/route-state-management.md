---
name: route-state-management
description: 'Flujo completo guards → resolvers → componente. Integración de URL state en rutas MFE.'
maxContextLines: 350
user-invokable: true
disable-model-invocation: false
scope: 'state-management'
---

# Skill: Route State Management (MFE)

**Scope**: StateManagement🔄
**Trigger**: "flujo guards resolvers", "route state", "estado cross-project"

---

## Propósito

Integrar flujo completo: guards → resolvers → componente con estado en URL.

---

## Contexto mínimo (autosuficiente)

- Host y remote deben intercambiar estado por URL.
- El estado del remote es local; no se comparte store global entre MFEs.
- El orden correcto evita pantallas inconsistentes:
  1) guard valida, 2) resolver hidrata, 3) componente consume.

## Arquitectura objetivo

- **Guard**: valida precondiciones de entrada.
- **Resolver**: transforma URL -> estado de dominio.
- **Componente**: opera con estado ya hidratado.
- **Store local (signals)**: administra mutaciones internas del remote.

> Para el patrón Flux completo (state + store + actions + selectors como `@Injectable`), ver skill **flux-signals-store**.

## Decisión: ¿signals simples o Flux completo?

| Criterio | Signals en componente | Flux completo |
|----------|-----------------------|---------------|
| Formulario de un solo paso | ✅ | — |
| 3+ operaciones HTTP / modales / paginación | — | ✅ |
| Estado entre varias rutas del remote | — | ✅ |

## Reglas obligatorias

1. No leer query params directamente en componente para estado crítico.
2. No usar store global compartido entre MFEs.
3. Estado inicial siempre entra por URL serializada o resolver.
4. Fallback de navegación explícito cuando guard/resolver fallan.
5. Store con clases `@Injectable()` — nunca funciones sueltas de signal.

## Checklist de implementación

- Ruta con `canActivate` y `resolve`.
- Guard y resolver con pruebas unitarias.
- Componente recibe estado de `route.data`.
- Navegación saliente conserva/actualiza estado serializado.
- Casos de error cubiertos (sin state, state inválido, decode fallido).

## Anti-patrones

- Lógica de API dentro del guard cuando solo debe validar.
- Resolver mutando estado global.
- Rehidratar estado en múltiples puntos de la ruta.
- `featureStore = signal()` como función suelta → usar clase `@Injectable()`.

