---
name: mfe-integration
description: 'Integración completa host-remote con providers y tokens. Configuración de API tokens, HttpClient.'
maxContextLines: 350
user-invokable: true
disable-model-invocation: false
scope: 'module-federation'
---

# Skill: MFE Integration (MFE)

**Scope**: ModuleFederation📦
**Trigger**: "integrar host remote", "configurar providers", "API tokens"

---

## Propósito

Completar integración host-remote con providers (API_BASE_URL, etc.), HttpClient y tokens necesarios.

---

## Contexto mínimo (autosuficiente)

- La integración debe mantener independencia: host pasa contexto inicial, remote gestiona su estado.
- Providers/tokens son contrato de infraestructura, no de negocio.
- El remote debe poder vivir en otro host con mínimos cambios.

## Reglas de estado (Signals vs NgRx)

- **Default en este ecosistema MFE**: Flux + Signals local por remote.
- Usar NgRx Store solo cuando exista una necesidad explícita de estado global complejo y gobernanza adicional.
- Evitar store global compartido entre MFEs para no introducir acoplamiento.
- Para estado cross-project, priorizar URL serialization + guard + resolver.

Referencia conceptual de NgRx Store: [NgRx Store](https://ngrx.io/guide/store).

## Checklist de integración

1. Tokens de API configurados y tipados.
2. HttpClient disponible en el boundary del remote.
3. Entrada del remote recibe y valida contexto inicial.
4. URL state habilitado cuando el flujo lo exige.
5. Build/lint/tests del host y remote en verde.

## Anti-patrones

- Inyectar dependencias de negocio del host dentro del remote.
- Acoplar remote a una sola URL/base de despliegue.
- Compartir estado mutable entre host y remote fuera de URL/contrato explícito.
