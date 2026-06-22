---
name: implementation-plan
description: 'Creación de planes estructurados de implementación para Micro Frontends. Define pasos, archivos y validaciones.'
maxContextLines: 300
scope: 'planning-mf'
user-invokable: false
disable-model-invocation: false
---

# Skill: Implementation Plan (MFE)

**Scope**: PlanningMF📋
**Trigger**: después de task-analysis, antes de cualquier edición de código

---

## Propósito

Crear plan estructurado de implementación con pasos concretos, archivos a crear/modificar y criterios de validación.

---

## Contexto mínimo (autosuficiente)

- El plan debe ser ejecutable sin suposiciones ocultas.
- Debe separar claramente análisis, implementación y validación.
- Debe permitir detener implementación cuando hay ambigüedad de diseño o negocio.

## Formato obligatorio del plan

1. Objetivo funcional (1-2 líneas).
2. Alcance técnico (qué sí / qué no).
3. Archivos a crear/modificar.
4. Pasos secuenciales de implementación.
5. Riesgos y bloqueos.
6. Validaciones técnicas (lint/build/tests/storybook).

## Proceso

1. Definir pasos de implementación en orden
2. Especificar archivos a crear o modificar
3. Definir criterios de éxito por paso
4. Identificar riesgos técnicos y decisiones abiertas
5. Documentar en checklist accionable

## Reglas obligatorias

- No incluir pasos vagos (ej. "ajustar cosas").
- Cada paso debe tener salida verificable.
- No pasar a implementación con preguntas abiertas críticas.
- Si hay UI basada en diseño, exigir evidencia de mapeo antes de codificar.

## Checklist de calidad

- Plan cubre arquitectura, estado, UI y pruebas.
- Incluye criterio de done medible.
- Incluye rollback o estrategia de mitigación básica.
- Está alineado al flujo de agentes del proyecto.

---
