---
name: url-serialization
description: 'UrlSerializationService con Base64 en query params. Serialización y deserialización de estado en URL.'
maxContextLines: 350
user-invokable: true
disable-model-invocation: false
scope: 'state-management'
---

# Skill: URL Serialization (MFE)

**Scope**: StateManagement🔄
**Trigger**: "serializar estado URL", "UrlSerializationService", "state en query params"

---

## Propósito

Implementar UrlSerializationService con Base64 para serializar/deserializar estado en query params.

---

## Contexto mínimo (autosuficiente)

- En arquitectura MFE, el estado no debe depender solo de memoria local.
- La URL es el contrato de entrada entre host y remote.
- El servicio de serialización debe ser determinista, tolerante a errores y tipado.

## Reglas obligatorias

1. Serializar a Base64 desde JSON estable.
2. Deserializar con `try/catch` y retorno seguro (`null` o fallback tipado).
3. Nunca lanzar excepción al consumidor por payload inválido.
4. No usar `any`; usar genéricos y tipos explícitos.
5. El resultado debe ser apto para guards/resolvers (sin side effects).

## Contrato recomendado

```typescript
export interface UrlSerializationService {
  serialize<T>(data: T): string;
  deserialize<T>(encoded: string): T | null;
}
```

## Checklist de calidad

- Servicio puro (sin dependencias de UI).
- Manejo de datos corruptos cubierto.
- Tests para: ida/vuelta, payload vacío, payload inválido, compatibilidad de tipos.
- Integración validada en ruta que consume `state`.

## Anti-patrones

- Guardar estado sensible en claro.
- Acoplar el servicio a un dominio específico de MFE.
- Mutar el objeto original antes de serializar.
