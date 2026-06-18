# 0002 — Comunicación cross-MFE mediante CustomEvents

**Estado:** Aceptado

**Fecha:** 2026-06-10

## Contexto

Los MFEs son bundles independientes. Necesitan comunicarse (p. ej., cuando el usuario agrega un producto al carrito, el contador en el header debe actualizarse), pero no pueden importarse entre sí sin violar los límites de scope de Nx.

Se evaluaron:
1. **CustomEvents del DOM** — nativo, sin dependencias, atraviesa Shadow DOM con `composed: true`
2. **Estado compartido (NgRx, Signals en scope:shared)** — acopla los MFEs a una librería de estado
3. **BroadcastChannel API** — válido pero no necesario para eventos síncronos en la misma página

## Decisión

La comunicación cross-MFE se hace exclusivamente mediante **CustomEvents tipados** declarados en `packages/shared-catalog/src/lib/events.ts`.

Reglas:
- Todo evento usa `bubbles: true` y `composed: true`
- Los tipos de evento se declaran en `shared-catalog` (único origen de verdad)
- El nombre sigue la convención `scope:accion` en kebab-case: `checkout:cart-updated`

## Consecuencias

**Positivo:**
- Zero acoplamiento entre MFEs — solo comparten los tipos del evento
- Funciona a través de Shadow DOM sin configuración extra
- Los eventos son observables con `fromEvent()` de RxJS

**Negativo:**
- No hay un bus de eventos centralizado; cada MFE escucha en `document`
- Debugging requiere conocer los nombres de los eventos
