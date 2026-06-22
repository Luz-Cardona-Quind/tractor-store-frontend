---
name: resolvers-setup
description: 'urlStateResolver para pre-activación. Resolver genérico para cargar estado desde URL.'
maxContextLines: 350
user-invokable: true
disable-model-invocation: false
scope: 'state-management'
---

# Skill: Resolvers Setup (MFE)

**Scope**: StateManagement🔄
**Trigger**: "configurar resolver", "urlStateResolver", "hydrate state desde URL"

---

## Propósito

Configurar urlStateResolver genérico para pre-cargar estado desde URL antes de activar ruta.

---

## Contexto mínimo (autosuficiente)

- El resolver hidrata estado antes del render del componente.
- El componente debe recibir estado ya resuelto (no parsear query params directo).
- Resolver + guard deben trabajar juntos: guard valida presencia, resolver hidrata.

## Flujo recomendado

1. Leer `state` desde query params.
2. Deserializar con `UrlSerializationService`.
3. Retornar `null` o fallback si el estado no es válido.
4. Exponer resultado vía `resolve` data.

## Reglas obligatorias

- Resolver sin efectos secundarios.
- Manejo seguro de estado inválido.
- Tipado explícito del retorno.
- Sin lógica de negocio compleja dentro del resolver.

## Checklist de calidad

- Ruta usa `resolve: { urlState: ... }`.
- Componente consume `resolved data` en lugar de parsear URL.
- Tests de resolver cubren: válido, ausente, corrupto.
- Fallback de navegación definido cuando no hay estado.
