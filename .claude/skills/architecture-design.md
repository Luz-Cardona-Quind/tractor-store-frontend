---
name: architecture-design
description: 'Decisiones arquitectónicas y patrones para Micro Frontends. Valida alineación con arquitectura del proyecto.'
maxContextLines: 350
scope: 'planning-mf'
user-invokable: false
disable-model-invocation: false
---

# Skill: Architecture Design (MFE)

**Scope**: PlanningMF📋
**Trigger**: después de implementation-plan, antes de delegar ejecución

---

## Propósito

Validar decisiones arquitectónicas del plan MFE y confirmar que la solución sea desacoplada, mantenible y desplegable.

---

## Contexto mínimo (autosuficiente)

- Arquitectura objetivo: host + remotes con fronteras claras.
- Estado recomendado en MFE: local por remote; intercambio cross-project por URL/contrato explícito.
- Integración UI: design system first (props/slots/tokens antes de CSS manual).

## Proceso

1. Validar que el plan sigue patrones MFE
2. Decidir hand-off(s) según tipo de tarea
3. Ordenar ejecución de agentes

---

## Criterios de validación arquitectónica

1. **Fronteras**: host no consume internals del remote.
2. **Estado**: no hay store global compartido entre MFEs sin justificación.
3. **Rutas**: lazy loading y puntos de entrada estables.
4. **Contratos**: tokens/providers/URLs definidos y tipados.
5. **Despliegue**: remote desplegable sin bloquear release del host.

## Reglas obligatorias

- Rechazar soluciones que mezclen responsabilidades host/remote.
- Evitar decisiones irreversibles sin mitigación (nombres públicos, contratos).
- Preferir cambios incrementales sobre refactors masivos sin pruebas.

## Checklist de salida

- Decisiones tomadas + alternativa descartada (breve).
- Riesgos arquitectónicos identificados.
- Orden de delegación recomendado.
- Validaciones técnicas mínimas requeridas para cerrar.

