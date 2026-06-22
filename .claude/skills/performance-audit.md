---
name: performance-audit
description: 'Lighthouse, bundle size, lazy loading. Auditoría de performance MFE.'
maxContextLines: 350
user-invokable: true
disable-model-invocation: false
scope: 'prereviews-mf, qa-auditor'
---

# Skill: Performance Audit (MFE)

**Scope**: PreReviewsMF🔍
**Trigger**: "auditar performance", "Lighthouse", "bundle size", "web vitals"

---

## Propósito

Ejecutar Lighthouse, analizar bundle size y validar lazy loading.

---

## Contexto mínimo (autosuficiente)

- En MFE, la performance crítica está en:
  1) tamaño del entry inicial,
  2) lazy loading efectivo,
  3) latencia de interacción al montar remotes.

## Métricas mínimas

- LCP
- INP
- CLS
- tamaño de bundles iniciales y chunks lazy

## Reglas obligatorias

1. Medir en build de producción.
2. Reportar baseline vs resultado actual.
3. Distinguir problemas del host vs del remote.
4. Entregar recomendaciones priorizadas por impacto/esfuerzo.

## Checklist de auditoría

- Lighthouse ejecutado con evidencia.
- Bundle size inspeccionado por target.
- Rutas lazy verificadas en navegación real.
- Hallazgos con acción concreta (qué cambiar y dónde).

## Anti-patrones

- Optimizar sin métricas base.
- Mezclar métricas de entornos no comparables.
- Concluir mejora sin evidencia de build prod.
