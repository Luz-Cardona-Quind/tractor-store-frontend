---
name: variant-resolution
description: 'Define variante/estado/theme por bloque UI antes de implementar componentes Pepino.'
maxContextLines: 250
scope: 'styles-mf'
user-invokable: false
disable-model-invocation: false
---

# Skill: Variant Resolution (StylesMF)

## Propósito

Evitar desvíos visuales asegurando que cada bloque de Figma/HU tenga una configuración cerrada de:
- componente `pp-*`
- props de variante/estado
- slots
- theme/mode
- token(s) asociados

## Proceso

1. Mapear bloque visual a `pp-*` (MCP Pepino).
2. Confirmar atributos reales con `get_component_spec`.
3. Cerrar contrato por bloque:
   - `pp-*`
   - `appearance|variant|size|status|disabled`
   - `slots`
   - `theme/mode`
   - `token(s)` resueltos
4. Verificar que el snippet generado respeta ese contrato.
5. Si falta un campo del contrato, detener implementación y preguntar.

## Salida obligatoria

Tabla por bloque:

`Bloque | pp-* | Props variante/estado | Slots | Theme/Mode | Token(s) | Estado`

## Reglas duras

- No pasar a código con contrato incompleto.
- No compensar con CSS manual una variante no resuelta.
- Validar visualmente en el mismo `theme/mode` definido en el contrato.
- El aspecto final lo renderiza el DS en **`node_modules/@f2x-flypass`** (`pepino-core` + `pepino-angular`); si el contrato no coincide con el CSS cargado en Storybook/host, revisar imports globales y `pp-theme`/`pp-mode` antes de tocar SCSS.
