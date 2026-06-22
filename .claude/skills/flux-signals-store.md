---
name: flux-signals-store
description: 'Patrón Flux+Signals class-based para estado local del MFE. Store @Injectable + Actions Facade + Selectors computed. Decisión signals simples vs Flux completo.'
maxContextLines: 400
user-invokable: true
disable-model-invocation: false
scope: 'state-management'
---

# Skill: Flux+Signals Store (providers/)

**Scope**: StateManagement🔄
**Trigger**: "providers", "store actions selectors", "Flux+Signals", "estado complejo remote", "cuándo usar store"

---

## Propósito

Implementar el patrón Flux+Signals class-based para gestionar estado local de un remote con múltiples operaciones HTTP, modales o navegación interna entre rutas del mismo remote.

---

## Decisión obligatoria antes de crear

| Criterio | Signals en componente | Flux completo |
|----------|-----------------------|---------------|
| 1–2 operaciones HTTP (ej: POST formulario) | ✅ | — |
| 3+ operaciones (GET + POST + PUT + DELETE) | — | ✅ |
| Estado compartido entre rutas del remote | — | ✅ |
| Modales, pasos de flujo, paginación | — | ✅ |
| Formulario de un solo paso | ✅ | — |

**Regla**: nunca crear 4 archivos para un formulario simple. `signal()` local en el componente es suficiente.

---

## Arquitectura — 4 archivos

```
src/app/providers/[feature]/
├── [feature].state.ts     → tipos + initialState (sin imports Angular)
├── [feature].store.ts     → @Injectable, signal<State>, solo transiciones
├── [feature].actions.ts   → @Injectable Facade, HTTP + nav + lógica negocio
├── [feature].selectors.ts → @Injectable, computed() para la vista
└── index.ts               → barrel export
```

### Responsabilidades

- **state.ts**: shape del estado, union types de pasos, `initialState`. Cero dependencias.
- **store.ts**: `WritableSignal<State>`. Métodos nombrados con dominio (`startLoadingDrivers`, no `setLoading`). No llama HTTP.
- **actions.ts**: única capa que llama servicios HTTP. Inyecta `Router` y `URL_SERIALIZATION_SERVICE` para navegación. Errores con `err: unknown` + type guard.
- **selectors.ts**: solo `computed()`. Sin side effects. El componente consume esto, nunca `.state()` directo.

### Registro de providers

```typescript
// entry.routes.ts — ruta raíz del remote
providers: [FeatureStore, FeatureActions, FeatureSelectors]
// NUNCA providedIn: 'root'
```

### Consumo en componente

```typescript
private readonly actions = inject(FeatureActions);
protected readonly sel   = inject(FeatureSelectors);

ngOnInit(): void { this.actions.loadItems(); }
```

---

## Tests mínimos

| Archivo | Casos |
|---------|-------|
| `store.spec.ts` | initialState correcto; transiciones actualizan state |
| `actions.spec.ts` | llama store correcto en éxito; llama fail en error HTTP |
| `selectors.spec.ts` | computed se actualiza al mutar store; flags derivados correctos |

---

## Anti-patrones

- `store.state().items` en componente → usar Selectors
- HTTP en Store → va en Actions
- Store global entre remotes → cada remote aísla su store
- 4 archivos para formulario simple → signals locales

---


