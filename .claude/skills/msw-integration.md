---
name: msw-integration
description: 'MSW handlers para Storybook y host. Mock de APIs en stories MFE y en apps/host/src/mocks. Método, request tipado y response por contrato de HU.'
maxContextLines: 400
user-invokable: true
disable-model-invocation: false
scope: 'storybook'
---

# Skill: MSW Integration (MFE)

**Scope**: Storybook📖
**Trigger**: "mock API", "MSW handlers", "mockear endpoint en story", "mock host"
**Hand-off**: → documentación inline del componente

---

## Cuándo usar MSW vs storyFormPreset

| Story | Mecanismo | MSW |
|-------|-----------|-----|
| Estado visual (form vacío, errores validación, campos completos) | `storyFormPreset` vía `@Input()` | ❌ No necesita |
| Submit / carga de datos que dispara HTTP real | `parameters.msw.handlers` | ✅ Necesita |

**Regla**: si la story nunca llega a hacer una llamada HTTP, no usar MSW.

---

## 1. Mock en Storybook

### Configuración global — preview.ts

```typescript
import { initialize, mswLoader } from 'msw-storybook-addon';
initialize();
export const loaders = [mswLoader];
```

### Patrón en la story

```typescript
import { http, HttpResponse } from 'msw';

export const ConApiMock: Story = {
  name: '4. Envío exitoso',
  parameters: {
    msw: {
      handlers: [
        http.post('/api/v1/[recurso]', () =>
          HttpResponse.json({ id: '123' }, { status: 200 })
        ),
      ],
    },
  },
};

export const ErrorApi400: Story = {
  name: '5. Error API 400',
  parameters: {
    msw: {
      handlers: [
        http.post('/api/v1/[recurso]', () =>
          HttpResponse.json({ message: 'Datos inválidos' }, { status: 400 })
        ),
      ],
    },
  },
};

export const ErrorServidor: Story = {
  name: '6. Error servidor 500',
  parameters: {
    msw: {
      handlers: [
        http.post('/api/v1/[recurso]', () =>
          HttpResponse.json({ message: 'Error interno' }, { status: 500 })
        ),
      ],
    },
  },
};
```

---

## 2. Mock en el Host (obligatorio tras implementar el servicio)

Después de implementar el servicio HTTP en el remote, **crear el handler en el host**.

### Crear `apps/host/src/mocks/[feature]-api.handlers.ts`

```typescript
import { http, HttpResponse, delay } from 'msw';

// Tipar el payload — nunca any
type [Feature]RequestPayload = {
  field1: string;
  field2: string;
};

export const [feature]Handlers = [
  http.post('/api/v1/[recurso]', async ({ request }) => {
    await delay(500);

    const body = (await request.json()) as [Feature]RequestPayload;

    if (!body.field1 || !body.field2) {
      return HttpResponse.json(
        { message: 'Campos requeridos' },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      { id: 'mock-id-123', status: 'success' },
      { status: 200 }
    );
  }),
];
```

### Registrar en `apps/host/src/mocks/index.ts`

```typescript
import { [feature]Handlers } from './[feature]-api.handlers';

export const worker = setupWorker(
  // handlers existentes...
  ...[feature]Handlers,
);
```

### Reglas del handler en host

- Tipar el payload con `type` local — nunca `any`
- `delay()` en todos los handlers
- Response con la misma forma que el contrato de la HU
- Un handler por endpoint + método HTTP

---

## Mock data centralizado

```typescript
// src/app/mocks/[feature].mock.ts
export const mockFeatureResponse = { id: '123', status: 'success' };
export const mockApiError = { message: 'Error interno', code: 'INTERNAL_ERROR' };
```

---

## Reglas generales

- Mock data realista — nunca `'test'`, `'string'`, `1`
- Separar happy path y errores en handlers/stories distintos
- Usar `HttpResponse` de `msw` — nunca `Response` nativo
