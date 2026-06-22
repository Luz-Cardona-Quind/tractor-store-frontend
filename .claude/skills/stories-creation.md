---
name: stories-creation
description: 'Crear stories CSF3 para componentes MFE. Play functions, testing interactivo. INCLUYE implementación obligatoria de storyFormPreset en el componente.'
maxContextLines: 400
user-invokable: true
disable-model-invocation: false
scope: 'storybook'
---

# Skill: Stories Creation (MFE)

**Scope**: Storybook📖  
**Trigger**: "crear stories", "documentar componente", "HU con casos de uso"  
**Hand-off**: → msw-integration

---

## ⚠️ REGLA CRÍTICA: 2 pasos inseparables

Crear stories requiere DOS cambios: uno en el **componente** y uno en el **archivo de stories**.  
**Si solo se crea el `.stories.ts` sin modificar el componente → el formulario aparece vacío.**

---

## PASO 1 — Modificar el COMPONENTE `.ts`

Agregar `@Input()` para Storybook y método `patchForm()`:

```typescript
// En el .component.ts
interface StoryFormPreset {
  // todos los campos del FormGroup del componente
  [key: string]: string | boolean | number | undefined;
}

// @Inputs para Storybook (no afectan producción)
@Input() storyFormPreset: Partial<StoryFormPreset> | null = null;
@Input() storyFormTouchedFields: string[] = [];
@Input() storyMockApiError: string | null = null;

ngOnInit(): void {
  this.buildForm();
  if (this.storyFormPreset) { this.patchForm(); }
}

ngOnChanges(changes: SimpleChanges): void {
  if (changes['storyFormPreset'] && this.form) { this.patchForm(); }
}

private patchForm(): void {
  if (!this.storyFormPreset || !this.form) { return; }
  this.form.patchValue(this.storyFormPreset);
  if (this.storyFormTouchedFields.length > 0) {
    this.storyFormTouchedFields.forEach(f => {
      this.form.get(f)?.markAsTouched();
      this.form.get(f)?.markAsDirty();
    });
  } else {
    this.form.markAllAsTouched();
  }
}
```

---

## PASO 2 — Crear el archivo `.stories.ts`

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { within, expect } from '@storybook/test';
import { MiFormularioComponent } from './mi-formulario.component';

const meta: Meta<MiFormularioComponent> = {
  component: MiFormularioComponent,
  title: 'MFE/[Feature]/MiFormulario',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<MiFormularioComponent>;

// Historia 1: Estado vacío
export const EstadoVacio: Story = {
  name: '1. Estado Vacío (botón deshabilitado)',
  args: { storyFormPreset: null, storyFormTouchedFields: [], storyMockApiError: null },
  play: async ({ canvasElement }) => {
    const ppButton = canvasElement.querySelector('pp-button');
    await expect(ppButton?.getAttribute('disabled')).not.toBeNull();
  },
};

// Historia 2: Errores de validación
export const ErroresValidacion: Story = {
  name: '2. Errores de Validación — campos requeridos',
  args: {
    storyFormPreset: { nombre: '', email: '' },
    storyFormTouchedFields: ['nombre', 'email'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Este campo es obligatorio')).toBeVisible();
  },
};

// Historia 3: Formulario completo (botón habilitado)
export const FormularioCompleto: Story = {
  name: '3. Formulario Completo (botón habilitado)',
  args: {
    storyFormPreset: {
      // TODOS los campos necesarios para que el formulario sea válido
      nombre: 'David',
      apellido: 'Santiago',
      email: 'david@ejemplo.com',
      emailConfirm: 'david@ejemplo.com',
      celular: '3001234567',
      acceptTerms: true,
    },
    storyFormTouchedFields: [], // vacío = markAllAsTouched
  },
  play: async ({ canvasElement }) => {
    const ppButton = canvasElement.querySelector('pp-button');
    await expect(ppButton?.getAttribute('disabled')).toBeNull(); // habilitado
  },
};
```

---

## Convenciones CSF3

- `export default meta` con `tags: ['autodocs']`
- Una story por cada estado/caso de uso de la HU
- `play` solo con `canvasElement` (no `fixture`)
- NUNCA `getByLabelText()` con componentes Pepino (shadow DOM)
- NUNCA `userEvent.type()` en `pp-input`

---

## Referencias

- Patrón completo: `agent-storybook.mdc` en `.cursor/rules/`
- Componente de referencia (este repo): `packages/mfe-fuel/src/app/forms/supply-form/`
  - `supply-form.component.ts` → implementación del formulario
  - `supply-form.stories.ts` → stories con args/casos
- Regla portable: no depender de rutas fijas; inferir estructura del proyecto objetivo.
