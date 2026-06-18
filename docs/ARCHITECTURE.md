# Architecture — The Tractor Store

## Visión general

The Tractor Store es un e-commerce de tractores construido con una arquitectura de **micro-frontends** orquestada por un shell host. Cada equipo posee un MFE independiente que se integra en runtime vía Module Federation.

```
┌─────────────────────────────────────────────┐
│                   Shell (4200)               │
│         Host — orquesta los MFEs            │
│  ┌───────────┐ ┌──────────┐ ┌────────────┐  │
│  │ mfe-explore│ │mfe-decide│ │mfe-checkout│  │
│  │  (4201)   │ │  (4202)  │ │  (4203)    │  │
│  └───────────┘ └──────────┘ └────────────┘  │
└─────────────────────────────────────────────┘
         ↕ CustomEvents (bubbles + composed)
┌─────────────────────────────────────────────┐
│              Paquetes compartidos            │
│  ts-design-system │ shared-catalog │ tokens  │
└─────────────────────────────────────────────┘
```

## Micro-frontends

| MFE | Puerto | Scope Nx | Responsabilidad |
|-----|--------|----------|-----------------|
| shell | 4200 | `scope:shell` | Host, navegación, layout global |
| mfe-explore | 4201 | `scope:explore` | Home, categorías, tiendas, header, footer |
| mfe-decide | 4202 | `scope:decide` | Página de producto, selector de variantes |
| mfe-checkout | 4203 | `scope:checkout` | Carrito, checkout, thanks, minicart |

## Paquetes compartidos

| Paquete | Scope Nx | Contenido |
|---------|----------|-----------|
| `ts-design-system` | `scope:shared` | Componentes Angular (Button, ProductCard, VariantOption, MiniCart, CartCounter). Exporta también como Custom Elements. |
| `shared-catalog` | `scope:shared` | Modelos de dominio (`Product`, `LineItem`, etc.), eventos tipados (`CartUpdatedEvent`), constantes. |
| `design-tokens` | `scope:shared` | CSS Custom Properties en tres capas: primitivos → semánticos → de componente. |

## Comunicación entre MFEs

Los MFEs **nunca se importan entre sí**. Se comunican exclusivamente mediante **CustomEvents** declarados en `packages/shared-catalog/src/lib/events.ts`.

```
checkout:cart-updated   →  CartUpdatedEvent  (emite mfe-checkout, escucha shell/ts-design-system)
explore:store-selected  →  StoreSelectedEvent (emite mfe-explore, escucha mfe-decide)
```

Todos los eventos se despachan con `bubbles: true` y `composed: true` para atravesar Shadow DOM.

## Module Federation

- **Host**: `apps/shell` — usa `@nx/angular:module-federation-dev-server`
- **Remotes**: cada MFE expone `./Routes` apuntando a su `remote-entry/entry.routes.ts`
- **Singletons**: Angular, RxJS y zone.js se comparten como singletons; nunca se incluyen en los bundles remotos
- **Convención de imports**: los imports dinámicos en el shell usan guiones: `import('mfe-explore/Routes')`, no guiones bajos

## Gestión de estado (por MFE)

Cada MFE organiza su estado en tres capas:

```
Store (Signals)  →  Actions (funciones mutadoras)  →  Selectors (computed)
                          ↕
                      Facade (API pública hacia componentes)
```

Los componentes inyectan la `Facade`, nunca el `Store` directamente.

## Decisiones de arquitectura

Ver [`docs/adr/`](./adr/) para los Architecture Decision Records completos.
