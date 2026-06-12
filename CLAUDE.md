# CLAUDE.md — The Tractor Store

Este archivo le da contexto a Claude Code sobre el proyecto, las decisiones técnicas tomadas,
las convenciones de código y las reglas que debe aplicar en todo momento.
Léelo completo antes de generar o modificar cualquier archivo.

---

## 1. Qué es este proyecto

**The Tractor Store** es un e-commerce de tractores construido como reto full-stack de Quind.
La arquitectura divide el frontend en tres micro-frontends independientes orquestados por un shell,
y el backend en un monolito modular con Spring Boot. El objetivo no es solo que funcione en local:
el entregable final requiere URLs públicas, pipelines de CI/CD y calidad medida en SonarCloud.

Referencia oficial del reto: https://micro-frontends.org/tractor-store/

---

## 2. Estructura del monorepo (frontend)

```
tractor-store-frontend/
├── apps/
│   └── shell/                  # Host app — orquesta los MFEs vía Module Federation
├── packages/
│   ├── mfe-explore/            # Team Explore: home, categorías, tiendas, header, footer
│   ├── mfe-decide/             # Team Decide: página de producto, selector de variantes
│   ├── mfe-checkout/           # Team Checkout: carrito, checkout, thanks, minicart
│   ├── ts-design-system/       # Librería Angular de componentes (+ build como Custom Elements)
│   ├── shared-catalog/         # Modelos de dominio, eventos tipados, contratos de API
│   └── design-tokens/          # CSS Custom Properties en tres capas (primitivo/semántico/componente)
├── docs/
│   ├── adr/                    # Architecture Decision Records
│   ├── ARCHITECTURE.md
│   └── CONTRIBUTING.md
├── nx.json
├── pnpm-workspace.yaml
└── CLAUDE.md                   # ← este archivo
```

**Puertos de desarrollo:**
- Shell: `http://localhost:4200`
- mfe-explore: `http://localhost:4201`
- mfe-decide: `http://localhost:4202`
- mfe-checkout: `http://localhost:4203`
- Storybook: `http://localhost:6006`

---

## 3. Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework UI | Angular | 19 (standalone, sin NgModules) |
| Reactividad | Signals + RxJS | Angular 19 built-in |
| Micro-frontends | Module Federation | @module-federation/enhanced |
| Monorepo | Nx | 21 |
| Gestor de paquetes | pnpm | 9+ |
| Estilos | TailwindCSS + CSS Custom Properties | Tailwind 3 |
| Componentes compartidos | Custom Elements vía Angular Elements | — |
| Testing unitario | Jest + TestBed | Jest 29 |
| Testing E2E | Playwright + MSW | — |
| Documentación visual | Storybook + Chromatic | Storybook 9 |
| Calidad | SonarCloud (org Quind) | — |
| CI/CD | GitHub Actions | — |
| Despliegue frontend | Vercel o Netlify | — |
| Backend | Spring Boot 3 + Java 21 + PostgreSQL | — |
| Despliegue backend | Fly.io o Render | — |

---

## 4. Decisiones de arquitectura (no negociables)

Estas decisiones están documentadas en `docs/adr/`. Respétalas siempre.

### 4.1 Module Federation
- Angular, RxJS y zone.js son **singletons compartidos**. Nunca los incluyas en el bundle de un MFE remoto.
- El shell es el único host. Los MFEs son siempre remotes.
- Si un MFE no está disponible en runtime, el shell muestra un fallback de error en lugar de crashear.

### 4.2 Comunicación entre MFEs
- Los MFEs **no se importan entre sí**. Nunca.
- La comunicación es exclusivamente por **CustomEvents tipados** declarados en `packages/shared-catalog/src/lib/events.ts`.
- Todos los eventos usan `bubbles: true` y `composed: true` para atravesar el Shadow DOM.
- Ejemplo: `new CustomEvent('checkout:cart-updated', { detail: payload, bubbles: true, composed: true })`.

### 4.3 Gestión de estado
- Cada MFE tiene su propio Store organizado en tres capas: **Store** (estado con Signals), **Actions** (funciones que mutan), **Selectors** (`computed()` que derivan datos).
- Los componentes solo inyectan la **Facade**, nunca el Store directamente.
- El estado es inmutable: usa siempre `state.update(current => ({ ...current, cambios }))`.

### 4.4 Design Tokens
- Los tokens viven en `packages/design-tokens` en tres capas: primitivos → semánticos → de componente.
- Ningún MFE ni componente declara colores o espaciados propios. Todos usan las CSS Custom Properties del paquete de tokens.
- Los componentes con Shadow DOM usan CSS Custom Properties para recibir estilos del host. Los estilos internos no se filtran hacia afuera.

### 4.5 Fronteras entre proyectos
- La regla `@nx/enforce-module-boundaries` está activa. Viola estas reglas y el lint fallará:
  - `scope:explore`, `scope:decide`, `scope:checkout` → **no pueden importarse entre sí**.
  - Cualquier MFE o el shell → pueden importar desde `scope:shared`.
  - `scope:shared` → **no puede importar de nadie**.

---

## 5. Convenciones de código

### 5.1 TypeScript
- `strict: true` siempre. No uses `any` bajo ninguna circunstancia; usa `unknown` si el tipo es incierto y nárrows explícitamente.
- Prefiere `interface` para contratos públicos y objetos de dominio. Usa `type` para uniones, intersecciones y tipos derivados con utility types.
- Usa utility types (`Partial`, `Pick`, `Omit`, `Record`, `Readonly`) en lugar de redefinir tipos a mano.
- Nombra los tipos de forma que expresen su propósito, no su estructura: `ProductSummary`, no `ProductWithNameAndPrice`.
- Exporta solo lo que otros módulos necesiten. Todo lo que sea interno va sin `export`.

### 5.2 Angular
- **Siempre standalone components** (`standalone: true`). Nunca NgModules.
- Usa `inject()` en lugar de constructor injection para servicios en componentes standalone.
- Los `@Input()` deben tener tipo explícito. Nunca `@Input() data: any`.
- Los `@Output()` emiten tipos específicos, nunca `EventEmitter<any>`.
- Usa `OnPush` change detection en todos los componentes del design system.
- Los componentes no llaman servicios HTTP directamente. Siempre pasan por la Facade del Store.
- Maneja la destrucción con `takeUntilDestroyed()` de `@angular/core/rxjs-interop`. Nunca dejes suscripciones sin cancelar.

### 5.3 Signals
- `signal()` para estado mutable local o del Store.
- `computed()` para todo valor derivado. Nunca calcules en el template lo que puedes precalcular con `computed()`.
- `effect()` solo para side effects (logs, sincronización con localStorage). Nunca para derivar estado.
- No uses `signal.set()` ni `signal.update()` fuera de las Actions del Store.

### 5.4 Estilos
- Tailwind primero. Solo usa BEM cuando el componente tiene estados o variantes complejas que Tailwind no expresaría bien.
- Nunca mezcles Tailwind y BEM en el mismo elemento.
- Clases de Tailwind en el orden: layout → box → tipografía → color → interactividad → responsive.
- Las CSS Custom Properties de los design tokens son las únicas fuentes de valores de color, tipografía y espaciado.

### 5.5 Naming conventions
- **Archivos**: `kebab-case`. Ejemplo: `product-card.component.ts`.
- **Componentes Angular**: `PascalCase` con sufijo. Ejemplo: `TsProductCardComponent`.
- **Servicios**: `PascalCase` con sufijo `Service`. Ejemplo: `CatalogFacadeService`.
- **Stores**: `PascalCase` con sufijo `Store`. Ejemplo: `CartStore`.
- **Interfaces**: `PascalCase` sin prefijo `I`. Ejemplo: `Product`, no `IProduct`.
- **CustomEvents**: `scope:accion` en kebab-case. Ejemplo: `checkout:cart-updated`, `explore:store-selected`.
- **CSS Custom Properties**: `--categoria-propiedad`. Ejemplo: `--color-primary`, `--button-bg`.
- **Archivos de test**: mismo nombre que el archivo que testea con sufijo `.spec.ts`.

---

## 6. Reglas de calidad (obligatorias)

- **Cobertura mínima**: 80% global, 85% en código nuevo. SonarCloud bloqueará el merge si no se cumple.
- **Cero `console.log`** en código que se mergea a main. Usa el servicio de logging si necesitas trazas.
- **Cero secretos en el repo**. Variables de entorno en `.env.local` (no commiteado) o en GitHub Secrets.
- **Cero `TODO` sin issue asociado**. Si dejas un TODO, debe tener el formato `// TODO(#123): descripción`.
- **Cero imports de barril circular**. Nx detecta esto; arréglalo antes de hacer commit.
- Cada función pública de un servicio o store debe tener **JSDoc** con descripción, parámetros y retorno.
- Los tests de un componente deben cubrir: render con inputs válidos, render con inputs límite, emisión de outputs, y manejo de estados vacíos o de error.

---

## 7. Buenas prácticas que Claude Code debe aplicar siempre

### Código limpio
- Funciones con una sola responsabilidad. Si una función hace más de una cosa, divídela.
- Máximo 20 líneas por función. Si supera ese umbral, es señal de que hay que extraer lógica.
- Nombres que explican la intención: `calculateCartTotal()`, no `calc()` ni `doStuff()`.
- Sin comentarios que expliquen *qué* hace el código (eso lo dice el código). Solo comentarios que expliquen *por qué* se tomó una decisión no obvia.
- Sin código comentado. Si no se usa, se elimina. Para eso existe git.

### Principios SOLID aplicados a este stack
- **S** — Un componente Angular hace una cosa: o muestra datos, o los transforma, o los captura. No las tres.
- **O** — Extiende comportamiento con nuevos componentes o tokens, no modificando los existentes.
- **L** — Si un componente acepta un tipo base, debe funcionar igual con cualquier subtipo.
- **I** — Las Facades exponen solo los métodos que cada componente necesita, no todo el Store.
- **D** — Los componentes dependen de abstracciones (Facades, InjectionTokens), no de implementaciones concretas.

### Manejo de errores
- Nunca dejes un `Observable` o `Promise` sin manejo de error.
- Los errores HTTP se manejan en el interceptor global y en la Facade, no en los componentes.
- Usa el tipo `Result<T, E>` definido en `shared-catalog` para funciones que pueden fallar.
- Los mensajes de error que ve el usuario son siempre accionables: "No pudimos cargar los productos. Intenta de nuevo." en lugar de "Error 500".

### Performance
- Usa `OnPush` y Signals para evitar re-renders innecesarios.
- Las listas largas usan `trackBy` o `@for (item of items; track item.id)`.
- Las imágenes tienen `loading="lazy"` y formato WebP cuando sea posible.
- Los imports de librerías grandes (lodash, etc.) son siempre de la función específica, nunca del módulo entero.

### Seguridad
- Nunca uses `innerHTML` ni `bypassSecurityTrust*` sin una razón documentada y revisada.
- Los inputs del usuario siempre se validan en el formulario Angular (Reactive Forms) y en el backend.
- CORS está configurado explícitamente en el backend: no uses `*` en producción.

---

## 8. Flujo de trabajo con Git

- **Rama principal**: `main`. Protegida. Requiere PR aprobado y CI en verde.
- **Ramas de feature**: `feat/nombre-descriptivo`. Ejemplo: `feat/catalog-store-signals`.
- **Ramas de fix**: `fix/nombre-descriptivo`. Ejemplo: `fix/minicart-shadow-dom-event`.
- **Conventional commits** obligatorios:
  - `feat:` nueva funcionalidad
  - `fix:` corrección de bug
  - `docs:` documentación
  - `test:` tests nuevos o modificados
  - `refactor:` refactorización sin cambio de comportamiento
  - `chore:` mantenimiento, dependencias, configuración
- Un commit = un cambio lógico. No mezcles refactors con features en el mismo commit.

---

## 9. Qué hacer antes de proponer cualquier cambio de código

1. Verifica que el cambio no viola ninguna regla de `@nx/enforce-module-boundaries`.
2. Confirma que el componente o servicio tiene o tendrá tests que cubran la lógica nueva.
3. Si modificas la API de un componente del design system (cambias un `@Input` o `@Output`), actualiza su story de Storybook.
4. Si el cambio afecta a la comunicación entre MFEs (CustomEvents o Module Federation config), documenta el impacto en el ADR correspondiente o crea uno nuevo.
5. Si introduces una nueva dependencia, justifica por qué no es suficiente lo que ya existe en el proyecto.

---

## 10. Comandos útiles del proyecto

```bash
# Instalar dependencias
pnpm install

# Levantar todo en desarrollo
nx run-many --target=serve --all

# Levantar solo un MFE
nx serve mfe-explore

# Construir todo
nx run-many --target=build --all

# Ejecutar todos los tests
nx run-many --target=test --all

# Ejecutar tests afectados por los cambios actuales
nx affected --target=test

# Lint
nx run-many --target=lint --all

# Storybook del design system
nx run ts-design-system:storybook

# Visualizar grafo de dependencias
nx graph

# Ejecutar tests E2E
nx run e2e:e2e
```

---

## 11. Recursos de referencia

- Especificación del reto: https://micro-frontends.org/tractor-store/
- Module Federation: https://module-federation.io/
- Angular 19 Signals: https://angular.dev/guide/signals
- Angular Elements: https://angular.dev/guide/elements
- Nx docs: https://nx.dev/
- Storybook Angular: https://storybook.js.org/docs/angular/get-started/introduction
- SonarCloud (org Quind): https://sonarcloud.io/organizations/quind
