# 0005 — Gestión de estado con Signals y patrón Facade

**Estado:** Aceptado

**Fecha:** 2026-06-10

## Contexto

Cada MFE necesita gestión de estado local. Se evaluaron:
1. **NgRx** — robusto pero verboso y con boilerplate elevado
2. **Signals nativos de Angular** — built-in en Angular 16+, sin dependencias externas
3. **RxJS BehaviorSubject** — funcional pero más complejo que Signals para estado síncrono

## Decisión

El estado de cada MFE se gestiona con **Angular Signals** organizados en tres capas:

```
Store  →  clase con signal() para estado mutable
Actions →  funciones que llaman a store.update()
Selectors → computed() que derivan datos del store
```

Los componentes inyectan una **Facade** que expone solo los selectores y acciones relevantes. Nunca acceden al Store directamente.

El estado es **inmutable**: las actualizaciones siempre usan `store.update(current => ({ ...current, cambios }))`.

## Consecuencias

**Positivo:**
- Zero dependencias externas de estado
- Change detection eficiente con `OnPush` — Angular sabe exactamente qué cambió
- Facade aísla a los componentes de los detalles de implementación del store
- `computed()` garantiza que los valores derivados siempre están actualizados

**Negativo:**
- Sin DevTools de debugging como Redux DevTools
- El patrón Facade requiere disciplina para no saltárselo
- Los `effect()` para side effects deben usarse con cuidado (no para derivar estado)
