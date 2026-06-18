# 0004 — Angular standalone components sin NgModules

**Estado:** Aceptado

**Fecha:** 2026-06-10

## Contexto

Angular 14+ introduce standalone components que eliminan la necesidad de NgModules. Angular 19+ los establece como el patrón por defecto. El proyecto se inicia con Angular 21.

## Decisión

**Todos los componentes son standalone** (`standalone: true`). No se crean NgModules en ninguna parte del proyecto.

Corolarios:
- Inyección de dependencias vía `inject()`, no via constructor
- Bootstrap con `bootstrapApplication()` o `createApplication()`
- Importaciones directas entre componentes en el array `imports: []`

## Consecuencias

**Positivo:**
- Tree-shaking más fino — se importa solo lo que se usa
- Componentes autónomos: más fáciles de testear sin configurar módulos
- Compatible con Angular Elements sin wrapper NgModule

**Negativo:**
- Cada componente debe declarar explícitamente sus dependencias en `imports: []`
- Los desarrolladores habituados a NgModules necesitan adaptarse
