---
name: mfe-architecture-review
description: 'Review de patrones MFE y Module Federation. Validación de arquitectura.'
maxContextLines: 350
user-invokable: true
disable-model-invocation: false
scope: 'prereviews-mf'
---

# Skill: MFE Architecture Review (MFE)

**Scope**: PreReviewsMF🔍
**Trigger**: "review arquitectura", "validar MFE", "pre-PR architecture check"

---

## Propósito

Revisar patrones MFE y Module Federation con foco en riesgos de acoplamiento, regresiones y mantenibilidad.

---

## Contexto mínimo (autosuficiente)

- El review es de riesgo, no solo de estilo.
- Se priorizan problemas que pueden romper integración host/remote.
- Se valida arquitectura real observada en código, no intención.

## Qué revisar (prioridad alta -> baja)

1. Contratos públicos de remotes (`exposes`, rutas de entrada).
2. Dependencias compartidas y compatibilidad.
3. Acoplamiento indebido host <-> remote.
4. Estrategia de estado cross-project.
5. Estrategia de despliegue/versionado.

## Hallazgos esperados

- Bugs o riesgos de integración.
- Posibles regresiones por cambios de contrato.
- Gaps de pruebas de integración/routing.
- Deuda técnica crítica antes de PR.

## Reglas obligatorias

- Reportar hallazgos con severidad (alta/media/baja).
- Incluir evidencia de código o configuración.
- Si no hay hallazgos, declarar riesgos residuales y vacíos de prueba.

## Checklist de salida

- Lista de findings priorizada.
- Preguntas abiertas que bloquean merge (si aplica).
- Recomendaciones accionables por impacto.

