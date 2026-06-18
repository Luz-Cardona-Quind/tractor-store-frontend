# Architecture Decision Records

Los ADRs documentan las decisiones de arquitectura significativas del proyecto, el contexto en que se tomaron y sus consecuencias.

## Formato

Cada ADR es un archivo Markdown con el nombre `NNNN-titulo-descriptivo.md` donde `NNNN` es un número secuencial de 4 dígitos.

```markdown
# NNNN — Título de la decisión

**Estado:** Propuesto | Aceptado | Obsoleto | Reemplazado por ADR-XXXX

**Fecha:** YYYY-MM-DD

## Contexto

Por qué se necesitaba tomar una decisión.

## Decisión

Qué se decidió.

## Consecuencias

Qué implica esta decisión (positivo y negativo).
```

## Índice

| ADR | Título | Estado |
|-----|--------|--------|
| [0001](./0001-module-federation-webpack.md) | Module Federation con webpack y @module-federation/enhanced | Aceptado |
| [0002](./0002-comunicacion-custom-events.md) | Comunicación cross-MFE mediante CustomEvents | Aceptado |
| [0003](./0003-design-tokens-css-custom-properties.md) | Design tokens como CSS Custom Properties | Aceptado |
| [0004](./0004-angular-standalone-components.md) | Angular standalone components sin NgModules | Aceptado |
| [0005](./0005-estado-signals-facade.md) | Gestión de estado con Signals y patrón Facade | Aceptado |
