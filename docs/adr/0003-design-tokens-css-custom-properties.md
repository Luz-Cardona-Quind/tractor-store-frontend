# 0003 — Design tokens como CSS Custom Properties

**Estado:** Aceptado

**Fecha:** 2026-06-10

## Contexto

Con múltiples MFEs y componentes con Shadow DOM, se necesita una forma de compartir valores de diseño (colores, tipografía, espaciados) que:
- Funcione a través de Shadow DOM
- Sea el único origen de verdad
- No requiera importar SCSS en cada MFE

## Decisión

Los design tokens se implementan como **CSS Custom Properties** en `packages/design-tokens`, organizados en tres capas:

1. **Primitivos** — valores raw: `--blue-500: #3b82f6`
2. **Semánticos** — intención de uso: `--color-primary: var(--blue-500)`
3. **De componente** — componente específico: `--button-bg: var(--color-primary)`

El paquete exporta un `index.scss` que se incluye en el `:root` de cada app. Las CSS Custom Properties heredan a través del Shadow DOM de forma nativa.

## Consecuencias

**Positivo:**
- Los componentes con Shadow DOM reciben estilos del host sin piercear el encapsulamiento
- Cambiar el tema requiere sobreescribir solo las variables semánticas
- Zero duplicación de valores entre MFEs

**Negativo:**
- Requiere que `packages/design-tokens/src/lib/index.scss` se cargue como estilo global en cada app
- Las herramientas de linting de SCSS no verifican que los nombres de variables existan
