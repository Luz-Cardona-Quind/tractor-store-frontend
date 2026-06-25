# Historias de Usuario — The Tractor Store

> **Estado del proyecto:** La estructura del monorepo Nx está inicializada (shell + 3 MFEs + paquetes compartidos) pero todo el código funcional está por construir. Estas historias cubren el trabajo pendiente organizado en 9 épicas.

---

## Índice de Épicas

| Épica | Área | Historias |
|---|---|---|
| EP-01 | Contratos Compartidos (`shared-catalog`) | US-001 – US-003 |
| EP-02 | Design Tokens | US-004 – US-007 |
| EP-03 | Design System (`ts-design-system`) | US-008 – US-015 |
| EP-04 | Shell y Module Federation | US-016 – US-021 |
| EP-05 | Team Explore (`mfe-explore`) | US-022 – US-030 |
| EP-06 | Team Decide (`mfe-decide`) | US-031 – US-038 |
| EP-07 | Team Checkout (`mfe-checkout`) | US-039 – US-048 |
| EP-08 | Comunicación entre MFEs | US-041 – US-042 |
| EP-09 | Testing | US-043 – US-048 |

---

## EP-01 — Contratos Compartidos (`shared-catalog`)

### US-001 — Modelos de dominio TypeScript

**Como** desarrollador, **quiero** tener los modelos de dominio tipados en `shared-catalog`, **para** que todos los MFEs y el shell compartan el mismo contrato de datos sin duplicar tipos.

**Criterios de aceptación:**
- [ ] Existe la interfaz `Product` con campos: `id`, `name`, `category`, `price`, `images`, `variants: Variant[]`.
- [ ] Existe la interfaz `Variant` con campos: `sku`, `color`, `size`, `stock`, `price`.
- [ ] Existe la interfaz `LineItem` derivada de `Variant` con `quantity` y `productName` (usa `Pick` + intersección, no redefinición manual).
- [ ] Existe la interfaz `Cart` con `id`, `items: LineItem[]`.
- [ ] Existe la interfaz `Store` con `id`, `name`, `address`, `coordinates`.
- [ ] Existe la interfaz `Category` con `id`, `name`, `slug`, `imageUrl`.
- [ ] Existe el tipo genérico `Result<T, E = Error>` con variantes `{ ok: true; data: T }` y `{ ok: false; error: E }`.
- [ ] Todos los tipos se exportan desde `packages/shared-catalog/src/index.ts`.
- [ ] El archivo compila con `strict: true` y sin ningún `any`.
- [ ] Hay tests unitarios que validan la correcta construcción de cada tipo.

**Notas técnicas:** Archivo principal en `packages/shared-catalog/src/lib/models.ts`. Usar `Readonly<>` para los tipos de dominio que no deban mutar. El tipo `CartItem` se deriva de `LineItem` via `Omit` si se necesita.

---

### US-002 — DTO de respuestas de API

**Como** desarrollador, **quiero** tener tipos para las respuestas de cada endpoint de la API, **para** que los servicios HTTP sean completamente tipados y no requieran castings.

**Criterios de aceptación:**
- [ ] Existen interfaces para las respuestas de `/explore/api/home` (`HomeResponse` con `categories`, `stores`, `recommendations`).
- [ ] Existen interfaces para `/explore/api/category/:slug` (`CategoryResponse` con `products`, `filters`).
- [ ] Existen interfaces para `/decide/api/product/:id` (`ProductResponse` con el producto completo).
- [ ] Existen interfaces para `/checkout/api/cart` (`CartResponse`).
- [ ] Existen interfaces para `/checkout/api/order` (`OrderResponse` con `orderId`, `status`).
- [ ] Se exportan desde `packages/shared-catalog/src/index.ts`.
- [ ] No hay ningún `any` en ningún tipo.

**Notas técnicas:** Archivo en `packages/shared-catalog/src/lib/api.types.ts`. Los tipos de respuesta deben usar los modelos de dominio de US-001 (ej: `ProductResponse = { data: Product }`).

---

### US-003 — Eventos tipados entre MFEs

**Como** desarrollador, **quiero** tener los CustomEvents tipados declarados en `shared-catalog`, **para** que la comunicación entre MFEs sea type-safe y no requiera strings mágicos dispersos por el código.

**Criterios de aceptación:**
- [ ] Existe el evento `checkout:cart-updated` con payload `{ items: LineItem[]; total: number }`.
- [ ] Existe el evento `checkout:cart-item-added` con payload `{ item: LineItem }`.
- [ ] Existe el evento `checkout:cart-item-removed` con payload `{ sku: string }`.
- [ ] Existe el evento `explore:store-selected` con payload `{ storeId: string; storeName: string }`.
- [ ] Existe el evento `decide:variant-selected` con payload `{ sku: string; productId: string }`.
- [ ] Cada evento se define como una función helper tipada: `dispatchCartUpdated(payload)` que construye el `CustomEvent` con `bubbles: true` y `composed: true`.
- [ ] Existen type guards para hacer narrowing del payload al escuchar los eventos.
- [ ] Los eventos se exportan desde `packages/shared-catalog/src/index.ts`.
- [ ] Hay tests que validan que los eventos se construyen con los flags correctos.

**Notas técnicas:** Archivo en `packages/shared-catalog/src/lib/events.ts`. Usar `CustomEvent<Payload>` con generics. El `composed: true` es crítico para que los eventos atraviesen el Shadow DOM.

---

## EP-02 — Design Tokens

### US-004 — Tokens primitivos

**Como** desarrollador, **quiero** que `packages/design-tokens` exporte los tokens primitivos como CSS Custom Properties, **para** tener una única fuente de verdad para todos los valores de color, tipografía y espaciado del sistema.

**Criterios de aceptación:**
- [ ] Existen tokens de color en forma de paleta completa (ej: `--color-green-100` a `--color-green-900`, neutros, etc.) alineados con la referencia visual del Tractor Store.
- [ ] Existen tokens de tipografía: familias (`--font-sans`, `--font-heading`), tamaños de escala (`--text-xs` a `--text-4xl`), pesos.
- [ ] Existen tokens de espaciado en escala consistente (`--space-1` a `--space-16`).
- [ ] Existen tokens de bordes y radios (`--radius-sm`, `--radius-md`, `--radius-lg`).
- [ ] Los tokens se definen en un archivo SCSS y se exportan también como archivo CSS listo para importar.
- [ ] El paquete tiene un `index.ts` que exporta la ruta del archivo CSS para consumo programático.

**Notas técnicas:** Archivo en `packages/design-tokens/src/lib/primitives.scss`. Consultar la paleta visual en la referencia oficial: https://micro-frontends.org/tractor-store/

---

### US-005 — Tokens semánticos

**Como** desarrollador, **quiero** tokens semánticos que mapeen los primitivos a roles de UI, **para** poder cambiar el tema de la tienda modificando solo los tokens semánticos sin tocar los componentes.

**Criterios de aceptación:**
- [ ] Existen tokens semánticos de color: `--color-primary`, `--color-primary-hover`, `--color-secondary`, `--color-surface`, `--color-surface-elevated`, `--color-on-primary`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-error`, `--color-success`.
- [ ] Existen tokens semánticos de tipografía: `--font-body`, `--font-heading`, `--text-body`, `--text-heading-lg`, `--text-heading-sm`.
- [ ] Los tokens semánticos referencian los primitivos (ej: `--color-primary: var(--color-green-700)`).
- [ ] Los tokens semánticos se declaran en `:root` en un archivo separado `semantics.scss`.

---

### US-006 — Tokens de componente

**Como** desarrollador, **quiero** tokens de componente que encapsulen la apariencia de cada pieza del design system, **para** que los consumidores puedan personalizar componentes sin conocer su implementación interna.

**Criterios de aceptación:**
- [ ] Existen tokens para `TsButton`: `--button-bg`, `--button-color`, `--button-radius`, `--button-padding-x`, `--button-padding-y`.
- [ ] Existen tokens para `TsProductCard`: `--product-card-bg`, `--product-card-radius`, `--product-card-shadow`.
- [ ] Existen tokens para `TsCartCounter`: `--cart-counter-bg`, `--cart-counter-color`, `--cart-counter-size`.
- [ ] Existen tokens para `TsMiniCart`: `--mini-cart-bg`, `--mini-cart-border`, `--mini-cart-width`.
- [ ] Los tokens de componente referencian los semánticos (ej: `--button-bg: var(--color-primary)`).

---

### US-007 — Preset de TailwindCSS integrado con tokens

**Como** desarrollador, **quiero** un preset de Tailwind configurado con los design tokens semánticos, **para** usar clases utilitarias de Tailwind que respeten automáticamente el sistema de diseño.

**Criterios de aceptación:**
- [ ] Existe `packages/design-tokens/src/lib/tailwind.preset.js` exportando un preset de Tailwind.
- [ ] Los colores de Tailwind del proyecto incluyen `primary`, `surface`, `text` y `border` mapeados a los tokens semánticos CSS.
- [ ] La fuente por defecto de Tailwind apunta a `--font-body`.
- [ ] El preset se configura en `tailwind.config.js` raíz como `presets: [require('./packages/design-tokens/src/lib/tailwind.preset')]`.
- [ ] Alterar `--color-primary` en el shell se refleja en las clases `bg-primary`, `text-primary` de Tailwind.

---

## EP-03 — Design System (`ts-design-system`)

### US-008 — Componente TsButton

**Como** desarrollador, **quiero** un componente `TsButton` en el design system, **para** tener un botón consistente y accesible reutilizable en todos los MFEs.

**Criterios de aceptación:**
- [ ] El componente acepta `@Input() variant: 'primary' | 'secondary' | 'ghost' = 'primary'`.
- [ ] El componente acepta `@Input() size: 'sm' | 'md' | 'lg' = 'md'`.
- [ ] El componente acepta `@Input() disabled: boolean = false`.
- [ ] El componente acepta `@Input() loading: boolean = false` y muestra un spinner cuando está activo.
- [ ] El componente emite `@Output() clicked = new EventEmitter<void>()` y no emite si está `disabled` o `loading`.
- [ ] Usa `ChangeDetectionStrategy.OnPush`.
- [ ] Aplica estilos usando los tokens de componente (`--button-bg`, etc.) y clases de Tailwind.
- [ ] El componente tiene `encapsulation: ViewEncapsulation.Emulated` (default).
- [ ] Tiene tests con TestBed: render de cada variante, estado disabled, emisión de `clicked`.
- [ ] Se exporta desde `packages/ts-design-system/src/index.ts`.

**Notas técnicas:** Selector `ts-button`. Archivo en `packages/ts-design-system/src/lib/button/`.

---

### US-009 — Componente TsProductCard

**Como** usuario, **quiero** ver tarjetas de producto con imagen, nombre, precio y variantes disponibles, **para** evaluar rápidamente los productos sin entrar al detalle.

**Criterios de aceptación:**
- [ ] Acepta `@Input() product: ProductSummary` (tipo derivado de `Product` en shared-catalog con `Pick`).
- [ ] Acepta `@Input() showPrice: boolean = true`.
- [ ] Acepta `@Input() loading: boolean = false` y muestra skeleton cuando está activo.
- [ ] Emite `@Output() productSelected = new EventEmitter<string>()` con el `id` del producto al hacer click.
- [ ] Muestra imagen con `loading="lazy"` y fallback a placeholder si falla la carga.
- [ ] Muestra precio formateado con `CurrencyPipe`.
- [ ] Usa `ChangeDetectionStrategy.OnPush`.
- [ ] Tiene tests: render con producto completo, sin precio, estado loading, emisión de `productSelected`.

**Notas técnicas:** Selector `ts-product-card`. Archivo en `packages/ts-design-system/src/lib/product-card/`.

---

### US-010 — Componente TsVariantOption

**Como** usuario, **quiero** ver y seleccionar variantes de un producto (color/talla), **para** elegir la configuración exacta que quiero comprar.

**Criterios de aceptación:**
- [ ] Acepta `@Input() variant: Variant`.
- [ ] Acepta `@Input() selected: boolean = false`.
- [ ] Acepta `@Input() disabled: boolean = false` (para variantes sin stock).
- [ ] Emite `@Output() variantSelected = new EventEmitter<Variant>()` al hacer click.
- [ ] Aplica estilos visuales distintos para `selected`, `disabled` y estado normal.
- [ ] Muestra un badge "Sin stock" cuando `disabled` es `true`.
- [ ] Usa `ChangeDetectionStrategy.OnPush`.
- [ ] Tiene tests: render seleccionado, deshabilitado, emisión del output.

**Notas técnicas:** Selector `ts-variant-option`. Archivo en `packages/ts-design-system/src/lib/variant-option/`.

---

### US-011 — Componente TsMiniCart

**Como** usuario, **quiero** ver un resumen del carrito disponible en todo momento, **para** saber cuántos artículos tengo sin abandonar la página actual.

**Criterios de aceptación:**
- [ ] Acepta `@Input() items: LineItem[] = []`.
- [ ] Acepta `@Input() highlighted: boolean = false` y muestra una animación de "bounce" o highlight cuando se añade un artículo.
- [ ] Muestra el total de artículos (`items.reduce` sobre quantities).
- [ ] Muestra el precio total formateado.
- [ ] Emite `@Output() cartClicked = new EventEmitter<void>()` al hacer click para navegar al carrito.
- [ ] Muestra estado vacío diferenciado cuando `items` está vacío.
- [ ] Escucha el evento `checkout:cart-updated` del DOM y actualiza su estado reactivamente.
- [ ] Usa `ChangeDetectionStrategy.OnPush` y `signal()` para el estado interno.
- [ ] Tiene tests: estado vacío, con items, estado highlighted.

**Notas técnicas:** Selector `ts-mini-cart`. Archivo en `packages/ts-design-system/src/lib/mini-cart/`. Está expuesto también como Custom Element para que el shell lo consuma sin Module Federation completo.

---

### US-012 — Componente TsCartCounter

**Como** usuario, **quiero** ver el contador del carrito en el header, **para** saber en todo momento cuántos artículos tengo añadidos.

**Criterios de aceptación:**
- [ ] Acepta `@Input() count: number = 0`.
- [ ] Emite `@Output() clicked = new EventEmitter<void>()`.
- [ ] Usa `ViewEncapsulation.ShadowDom`.
- [ ] Los estilos se controlan desde fuera usando `--cart-counter-bg` y `--cart-counter-color`.
- [ ] Está registrado como Custom Element `<ts-cart-counter>` mediante `createCustomElement`.
- [ ] Se puede usar desde HTML plano sin Angular.
- [ ] Tiene tests que validan el Custom Element en un DOM simulado.

**Notas técnicas:** Selector `ts-cart-counter`. Archivo en `packages/ts-design-system/src/lib/cart-counter/`.

---

### US-013 — Build de Custom Elements (Angular Elements)

**Como** desarrollador, **quiero** un target de build alternativo que compile los componentes del design system como Custom Elements, **para** poder usarlos en contextos externos a Angular (páginas HTML, otros frameworks).

**Criterios de aceptación:**
- [ ] Existe un `main.elements.ts` en `ts-design-system` que registra todos los componentes como Custom Elements.
- [ ] El `project.json` de `ts-design-system` tiene un target `build:elements` que produce un bundle en `dist/ts-design-system/elements/`.
- [ ] El bundle resultante puede cargarse en un `index.html` plano y los elementos funcionan (`<ts-cart-counter>`, `<ts-mini-cart>`, etc.).
- [ ] Todos los Custom Elements escuchan y despachan los eventos tipados de `shared-catalog`.
- [ ] El bundle no incluye Angular como dependencia duplicada si ya está presente en la página.

---

### US-014 — Storybook para `ts-design-system`

**Como** desarrollador, **quiero** Storybook configurado para el design system, **para** documentar y revisar visualmente los componentes de forma interactiva sin levantar un MFE completo.

**Criterios de aceptación:**
- [ ] Nx puede ejecutar `nx run ts-design-system:storybook` en el puerto 6006.
- [ ] Existen stories en formato CSF v3 para: `TsButton` (todas las variantes y tamaños), `TsProductCard` (con y sin precio, con imagen real), `TsVariantOption` (seleccionado, deshabilitado, normal), `TsMiniCart` (vacío, con items, highlighted), `TsCartCounter`.
- [ ] Los controles de Storybook se generan automáticamente a partir de los `@Input()` y `@Output()` sin escribir `argTypes` manuales.
- [ ] Existe una story que demuestra la propagación del evento `checkout:cart-updated` entre `TsMiniCart` y `TsCartCounter`.
- [ ] Todas las stories pasan el Accessibility addon sin errores críticos.

---

### US-015 — Tests unitarios del design system

**Como** desarrollador, **quiero** tests unitarios con Jest y TestBed para todos los componentes del design system, **para** detectar regresiones antes de que lleguen a los MFEs.

**Criterios de aceptación:**
- [ ] Cobertura ≥ 80% en `ts-design-system`.
- [ ] Tests de `TsButton`: render de cada variante, estado disabled impide la emisión de `clicked`, estado loading muestra spinner.
- [ ] Tests de `TsProductCard`: render con todos los campos, render con `showPrice: false`, emisión de `productSelected`.
- [ ] Tests de `TsVariantOption`: render seleccionado, render disabled no emite `variantSelected`.
- [ ] Tests de `TsMiniCart`: estado vacío, recibe items y calcula total, highlight.
- [ ] Tests de `TsCartCounter` como Custom Element: instancia en DOM simulado, respeta CSS Custom Properties.
- [ ] Todos los tests corren con `nx run ts-design-system:test`.

---

## EP-04 — Shell y Module Federation

### US-016 — Configurar Module Federation (host + remotes)

**Como** desarrollador, **quiero** que el shell esté configurado como host de Module Federation y los tres MFEs como remotes, **para** que Angular, RxJS y `shared-catalog` sean singletons compartidos sin duplicar el bundle.

**Criterios de aceptación:**
- [ ] `@module-federation/enhanced` está instalado en el monorepo.
- [ ] El shell tiene `module-federation.config.ts` declarando `mfe-explore`, `mfe-decide` y `mfe-checkout` como remotes con sus URLs de `remoteEntry.js`.
- [ ] Cada MFE tiene `module-federation.config.ts` exponiendo su `entry.routes.ts`.
- [ ] `mfe-checkout` expone adicionalmente `MiniCartComponent`.
- [ ] `mfe-explore` expone adicionalmente `HeaderComponent`, `FooterComponent`, `RecommendationsComponent` y `StorePickerComponent`.
- [ ] `@angular/core`, `@angular/common`, `@angular/router`, `rxjs` y `@tractor-store/shared-catalog` se comparten como singletons (singleton + strictVersion).
- [ ] `nx run-many --target=serve --all` levanta los 4 servidores y la shell carga los MFEs correctamente.
- [ ] Los `project.json` de cada app tienen targets `build` y `serve` adaptados con los executors de Module Federation.

**Notas técnicas:** Usar `@nx/angular:module-federation-*` generators o configurar manualmente los `webpack.config.ts`. Los puertos son shell:4200, explore:4201, decide:4202, checkout:4203.

---

### US-017 — Rutas federadas en el shell

**Como** usuario, **quiero** que la navegación entre secciones del Tractor Store sea fluida, **para** que el cambio de página no recargue la aplicación completa.

**Criterios de aceptación:**
- [ ] La ruta `/` delega en `mfe-explore` y carga la `HomePage`.
- [ ] La ruta `/category/:slug` delega en `mfe-explore` y carga la `CategoryPage`.
- [ ] La ruta `/stores` delega en `mfe-explore` y carga la `StoresPage`.
- [ ] La ruta `/product/:id` delega en `mfe-decide` y carga la `ProductPage`.
- [ ] La ruta `/cart` delega en `mfe-checkout` y carga la `CartPage`.
- [ ] La ruta `/checkout` delega en `mfe-checkout` y carga la `CheckoutPage`.
- [ ] La ruta `/thanks` delega en `mfe-checkout` y carga la `ThanksPage`.
- [ ] Cada ruta se carga de forma lazy (chunk separado por MFE).
- [ ] Hay una ruta `**` que muestra una página 404 gestionada por el shell.

---

### US-018 — Layout del shell (Header y Footer)

**Como** usuario, **quiero** ver el header con el logo, navegación y el carrito, y el footer, en todas las páginas, **para** mantener la orientación y el acceso al carrito en todo momento.

**Criterios de aceptación:**
- [ ] El shell renderiza el `HeaderComponent` exportado por `mfe-explore` mediante Module Federation.
- [ ] El header incluye el `TsMiniCart` (del design system o del `mfe-checkout`) con el conteo actualizado.
- [ ] El shell renderiza el `FooterComponent` exportado por `mfe-explore`.
- [ ] Header y footer son persistentes: no se desmontan al navegar entre rutas.
- [ ] Si `mfe-explore` no está disponible al cargar el header/footer, se muestra un fallback mínimo (logo + links básicos) sin crashear.

---

### US-019 — Fallback cuando un MFE no está disponible

**Como** usuario, **quiero** ver un mensaje de error manejado cuando una sección de la tienda falla al cargar, **para** que el problema sea claro y no se rompa la experiencia completa del sitio.

**Criterios de aceptación:**
- [ ] Si un remote de Module Federation falla al cargarse (timeout, 404, error de red), el shell muestra un componente `MfeErrorFallback` en lugar de un crash de Angular.
- [ ] El `MfeErrorFallback` muestra un mensaje accionable: "Esta sección no está disponible. Intenta de nuevo." con un botón de reintento.
- [ ] El resto del shell (header, footer, otras rutas) sigue funcionando aunque un MFE falle.
- [ ] El error se reporta al servicio de logging (no `console.log`).
- [ ] Hay un test unitario que simula la carga fallida y verifica que se muestra el fallback.

---

### US-020 — Interceptor HTTP global

**Como** desarrollador, **quiero** un interceptor HTTP funcional para toda la aplicación, **para** centralizar el manejo de errores, logs y (futuro) auth sin duplicar lógica en cada servicio.

**Criterios de aceptación:**
- [ ] Existe un `ErrorInterceptor` que captura errores HTTP y los transforma en `Result<never, AppError>` antes de propagarlos a los servicios.
- [ ] Los errores 4xx se mapean a mensajes en español orientados al usuario (ej: 404 → "El recurso solicitado no existe").
- [ ] Los errores 5xx muestran "Hubo un problema. Por favor, inténtalo de nuevo." sin exponer detalles técnicos.
- [ ] Existe un `LoggingInterceptor` que registra URL, método y código de respuesta usando el servicio de logging (sin `console.log`).
- [ ] Los interceptores se registran en `app.config.ts` del shell con `withInterceptors([loggingInterceptor, errorInterceptor])`.
- [ ] El `LoggingInterceptor` va antes del `ErrorInterceptor` para que todos los requests (incluidos los fallidos) queden registrados.
- [ ] Hay tests unitarios de cada interceptor con `HttpTestingController`.

---

### US-021 — InjectionTokens para URLs de API

**Como** desarrollador, **quiero** `InjectionToken` tipados para las URLs base de cada API, **para** poder configurar diferentes entornos (dev, staging, prod) sin modificar los servicios.

**Criterios de aceptación:**
- [ ] Existen tokens: `EXPLORE_API_URL`, `DECIDE_API_URL`, `CHECKOUT_API_URL` de tipo `InjectionToken<string>`.
- [ ] Los tokens se definen en `shared-catalog` y se exportan desde su `index.ts`.
- [ ] Cada MFE provee su token en `app.config.ts` leyendo de `environment.ts`.
- [ ] Los servicios HTTP inyectan el token con `inject(EXPLORE_API_URL)` y no hardcodean URLs.
- [ ] Hay tests que verifican que los servicios usan el token en lugar de una URL literal.

---

## EP-05 — Team Explore (`mfe-explore`)

### US-022 — Página Home

**Como** usuario, **quiero** ver la página principal con teasers de categorías y recomendaciones de productos, **para** descubrir rápidamente qué tipos de tractores ofrece la tienda.

**Criterios de aceptación:**
- [ ] Existe `HomeComponent` en `packages/mfe-explore/src/app/pages/home/`.
- [ ] La página muestra una lista de categorías usando `TsProductCard` en modo teaser (sin precio).
- [ ] La página incluye el componente `RecommendationsComponent` con los productos recomendados.
- [ ] Los datos se cargan mediante `CatalogFacadeService` (que internamente usa `CatalogStore`).
- [ ] Mientras cargan los datos se muestra un skeleton usando el estado `loading` de `TsProductCard`.
- [ ] Hacer click en una categoría navega a `/category/:slug`.
- [ ] Hacer click en un producto recomendado navega a `/product/:id`.
- [ ] La ruta `/` está configurada como lazy route en `mfe-explore` y delega en el shell vía Module Federation.
- [ ] Tiene tests unitarios con MSW para mockear `/explore/api/home`.

---

### US-023 — Página CategoryPage

**Como** usuario, **quiero** navegar a una categoría de tractores y ver sus productos con filtros, **para** encontrar el tractor que se ajuste a mis necesidades sin revisar todo el catálogo.

**Criterios de aceptación:**
- [ ] Existe `CategoryPageComponent` en `packages/mfe-explore/src/app/pages/category/`.
- [ ] La página muestra el nombre de la categoría y la lista de productos usando `TsProductCard`.
- [ ] Existe al menos un filtro funcional: precio máximo o tipo de uso (selector).
- [ ] Los filtros activos se reflejan en los query params de la URL (`?maxPrice=5000`).
- [ ] Limpiar los filtros elimina los query params y muestra todos los productos.
- [ ] Cambiar de categoría (por slug) recarga los productos sin recargar la página.
- [ ] Si la categoría no existe, muestra un estado de error con mensaje "Categoría no encontrada".
- [ ] Tiene tests con MSW que cubren: carga exitosa, filtros, categoría inexistente.

---

### US-024 — Página StoresPage

**Como** usuario, **quiero** ver la lista de tiendas físicas del Tractor Store, **para** saber dónde puedo ver o recoger mi tractor.

**Criterios de aceptación:**
- [ ] Existe `StoresPageComponent` en `packages/mfe-explore/src/app/pages/stores/`.
- [ ] La página lista todas las tiendas con nombre, dirección y horario.
- [ ] Existe el `StorePickerComponent` que permite seleccionar una tienda como "mi tienda" preferida.
- [ ] Al seleccionar una tienda se despacha el evento `explore:store-selected`.
- [ ] La tienda seleccionada se persiste en el `CatalogStore` y se muestra como activa.
- [ ] La ruta `/stores` está configurada como lazy route.
- [ ] Tiene tests que verifican la selección de tienda y la emisión del evento.

---

### US-025 — Componentes Header y Footer (expuestos via Module Federation)

**Como** usuario, **quiero** ver el header con navegación y el footer en todas las páginas del site, **para** orientarme y acceder fácilmente a las secciones principales.

**Criterios de aceptación:**
- [ ] Existe `HeaderComponent` en `packages/mfe-explore/src/app/components/header/`.
- [ ] El header muestra: logo, links de navegación (Home, Categorías, Tiendas), y el slot del `TsMiniCart`.
- [ ] Existe `FooterComponent` en `packages/mfe-explore/src/app/components/footer/`.
- [ ] Ambos componentes están expuestos en la configuración de Module Federation de `mfe-explore`.
- [ ] El shell los importa dinámicamente y los integra en el layout principal.
- [ ] Los componentes son standalone, usan `ChangeDetectionStrategy.OnPush` y no importan NgModules.
- [ ] Tienen stories en Storybook.

---

### US-026 — Componente Recommendations

**Como** usuario, **quiero** ver recomendaciones de productos en la home y en las páginas de producto, **para** descubrir modelos relacionados.

**Criterios de aceptación:**
- [ ] Existe `RecommendationsComponent` en `packages/mfe-explore/src/app/components/recommendations/`.
- [ ] Acepta `@Input() productId?: string` para recomendaciones contextuales.
- [ ] Muestra una fila de `TsProductCard` en modo teaser con scroll horizontal.
- [ ] Los datos provienen del `CatalogStore` (selector de recomendaciones).
- [ ] El componente está expuesto via Module Federation para ser consumido por `mfe-decide`.
- [ ] Usa `ChangeDetectionStrategy.OnPush`.
- [ ] Tiene story en Storybook y tests unitarios.

---

### US-027 — `CatalogStore`, `CatalogActions` y `CatalogSelectors`

**Como** desarrollador, **quiero** un `CatalogStore` basado en Signals en `mfe-explore`, **para** gestionar el catálogo, los filtros activos y las recomendaciones de forma reactiva y predecible.

**Criterios de aceptación:**
- [ ] `CatalogStore` tiene estado: `categories: signal<Category[]>`, `products: signal<Product[]>`, `activeFilters: signal<FilterState>`, `recommendations: signal<Product[]>`, `selectedStore: signal<Store | null>`, `loading: signal<boolean>`, `error: signal<string | null>`.
- [ ] `CatalogActions` tiene funciones puras que mutan el estado via `.update()`: `loadHome()`, `loadCategory(slug)`, `applyFilter(filter)`, `clearFilters()`, `selectStore(store)`.
- [ ] `CatalogSelectors` tiene `computed()`: `filteredProducts`, `totalProducts`, `activeFilterCount`.
- [ ] El estado es inmutable: nunca se usa `state.set(mutatedValue)`, siempre `state.update(current => ({ ...current, ... }))`.
- [ ] `CatalogFacadeService` es lo único que los componentes inyectan; encapsula store + actions + selectors.
- [ ] Tiene tests unitarios del store y de los selectors con valores mock.

---

### US-028 — `CatalogService` (HTTP)

**Como** desarrollador, **quiero** un `CatalogService` que consuma los endpoints de la API de Explore, **para** obtener datos reales del backend de forma tipada.

**Criterios de aceptación:**
- [ ] `CatalogService` tiene métodos: `getHome(): Observable<HomeResponse>`, `getCategory(slug: string): Observable<CategoryResponse>`, `getStores(): Observable<Store[]>`, `getRecommendations(productId?: string): Observable<Product[]>`.
- [ ] Cada método usa `HttpClient` tipado (ej: `this.http.get<HomeResponse>(...)`).
- [ ] Usa `inject(EXPLORE_API_URL)` para la URL base.
- [ ] Los errores son manejados en el interceptor global; el servicio no tiene `.catch()` propios.
- [ ] Tiene tests con MSW que cubren respuestas exitosas y errores 404/500.

---

## EP-06 — Team Decide (`mfe-decide`)

### US-029 — Página ProductPage

**Como** usuario, **quiero** ver la página de detalle de un tractor con imágenes, descripción técnica y selector de variantes, **para** evaluar si es el modelo que quiero antes de añadirlo al carrito.

**Criterios de aceptación:**
- [ ] Existe `ProductPageComponent` en `packages/mfe-decide/src/app/pages/product/`.
- [ ] La página muestra: galería de imágenes, nombre, precio, descripción técnica, lista de variantes con `TsVariantOption`.
- [ ] Los datos del producto se precargan con un `ProductResolver` antes de activar la ruta (no hay flash de contenido vacío).
- [ ] Si el producto no existe (resolver retorna 404), redirige a `/` con un mensaje de error.
- [ ] La variante seleccionada por defecto es la primera disponible con stock.
- [ ] El componente `RecommendationsComponent` de `mfe-explore` se monta en la página vía Module Federation.
- [ ] La ruta `/product/:id` está configurada como lazy route.
- [ ] Tiene tests: carga exitosa, redirección en 404, precarga del resolver.

---

### US-030 — Selector de variantes y URL State Serialization

**Como** usuario, **quiero** que la variante seleccionada de un producto se refleje en la URL, **para** poder compartir el enlace al producto con una variante específica preseleccionada.

**Criterios de aceptación:**
- [ ] Al seleccionar una variante, la URL se actualiza a `/product/:id?sku=AU-02-BL` sin recargar la página.
- [ ] Al cargar `/product/:id?sku=AU-02-BL`, la variante correspondiente queda preseleccionada.
- [ ] Si el SKU del query param no existe, se selecciona la primera variante disponible.
- [ ] La serialización/deserialización del query param usa funciones `encodeVariant()` / `decodeVariant()` exportadas desde el store.
- [ ] El `ProductStore` mantiene `selectedSku: signal<string | null>` sincronizado con el query param.
- [ ] Tiene tests: URL con SKU válido, URL con SKU inválido, cambio de variante actualiza URL.

---

### US-031 — Formulario AddToCart y botón de añadir

**Como** usuario, **quiero** añadir el tractor al carrito con la variante seleccionada, **para** continuar comprando o proceder al checkout.

**Criterios de aceptación:**
- [ ] Existe `AddToCartFormFactory` que crea un `FormGroup` tipado con control `quantity: FormControl<number>` y validador `min(1)`, `max(variant.stock)`.
- [ ] El botón "Añadir al carrito" usa `TsButton` con `variant: 'primary'` y muestra estado `loading` mientras la petición está en curso.
- [ ] Si la variante tiene stock 0, el botón está deshabilitado con mensaje "Sin stock".
- [ ] Al añadir exitosamente, se despacha el evento `checkout:cart-item-added` con el `LineItem`.
- [ ] En caso de error HTTP, se muestra un mensaje de error accionable bajo el botón.
- [ ] Tiene tests: form válido, form inválido (quantity > stock), dispatching del evento.

---

### US-032 — `ProductStore`, `ProductActions`, `ProductSelectors`

**Como** desarrollador, **quiero** un `ProductStore` basado en Signals en `mfe-decide`, **para** gestionar el producto activo y la variante seleccionada de forma reactiva.

**Criterios de aceptación:**
- [ ] Estado: `product: signal<Product | null>`, `selectedSku: signal<string | null>`, `loading: signal<boolean>`, `error: signal<string | null>`.
- [ ] Selectors computed: `selectedVariant: computed()` que deriva la variante activa de `product` y `selectedSku`, `isOutOfStock: computed()`, `canAddToCart: computed()`.
- [ ] Actions: `loadProduct(id)`, `selectVariant(sku)`, `clearProduct()`.
- [ ] `ProductFacadeService` encapsula todo; los componentes solo inyectan la facade.
- [ ] Tiene tests unitarios del store: carga de producto, cambio de variante, selectors.

---

### US-033 — `ProductService` (HTTP) y `ProductResolver`

**Como** desarrollador, **quiero** un `ProductService` que consuma la API de Decide y un resolver que precargue el producto, **para** que la `ProductPage` siempre tenga datos disponibles al renderizar.

**Criterios de aceptación:**
- [ ] `ProductService.getProduct(id: string): Observable<ProductResponse>` usa `inject(DECIDE_API_URL)` y `HttpClient` tipado.
- [ ] `ProductResolver` implementa `ResolveFn<Product>` y retorna `EMPTY` + redirección a `/` si el producto no existe.
- [ ] La ruta `/product/:id` en `mfe-decide` tiene el resolver configurado.
- [ ] Tiene tests del resolver con respuesta 200, 404 y error de red.

---

## EP-07 — Team Checkout (`mfe-checkout`)

### US-034 — Página CartPage

**Como** usuario, **quiero** ver todos los artículos en mi carrito con sus detalles y precios, **para** revisar mi selección antes de comprar.

**Criterios de aceptación:**
- [ ] Existe `CartPageComponent` en `packages/mfe-checkout/src/app/pages/cart/`.
- [ ] Lista los `LineItem` con: imagen, nombre, variante (color/talla), precio unitario, quantity selector, precio total de línea, botón de eliminar.
- [ ] Muestra el subtotal, impuestos y total general calculados via selectors del `CartStore`.
- [ ] El botón "Proceder al pago" navega a `/checkout` y está deshabilitado si el carrito está vacío.
- [ ] El botón "Eliminar" en cada item despacha la acción de `CartActions` y emite `checkout:cart-item-removed`.
- [ ] Muestra un estado vacío con mensaje y CTA para ir a comprar si no hay items.
- [ ] Tiene tests: carrito con items, carrito vacío, eliminar item.

---

### US-035 — Página CheckoutPage

**Como** usuario, **quiero** completar el proceso de compra con mis datos de envío y pago, **para** formalizar el pedido de mi tractor.

**Criterios de aceptación:**
- [ ] Existe `CheckoutPageComponent` en `packages/mfe-checkout/src/app/pages/checkout/`.
- [ ] El formulario es un `ReactiveForm` tipado con campos: nombre, apellido, email, dirección, ciudad, código postal, teléfono.
- [ ] Cada campo tiene validadores: `required`, longitud mínima/máxima, formato email, formato teléfono.
- [ ] Los mensajes de error de validación son en español y aparecen solo después de `touched`.
- [ ] El botón "Confirmar pedido" usa `TsButton` con estado `loading` mientras la petición está en curso.
- [ ] Al submit exitoso, navega a `/thanks`.
- [ ] El `CanDeactivate` guard muestra un diálogo de confirmación si el usuario intenta salir con cambios sin guardar.
- [ ] Tiene tests: validación del formulario, submit exitoso, guard de CanDeactivate.

---

### US-036 — Página ThanksPage

**Como** usuario, **quiero** ver una página de confirmación con el resumen de mi pedido, **para** saber que mi compra se realizó correctamente.

**Criterios de aceptación:**
- [ ] Existe `ThanksPageComponent` en `packages/mfe-checkout/src/app/pages/thanks/`.
- [ ] Muestra el número de pedido retornado por la API.
- [ ] Muestra un resumen de los artículos comprados.
- [ ] Al cargar esta página, el `CartStore` se vacía (acción `clearCart()`).
- [ ] Incluye un CTA "Seguir comprando" que navega a `/`.
- [ ] Si se accede directamente sin haber hecho checkout (no hay `orderId`), redirige a `/`.
- [ ] Tiene tests: render con pedido, redirección sin pedido.

---

### US-037 — Componente MiniCart (expuesto via Module Federation)

**Como** usuario, **quiero** ver el contador del carrito actualizado en el header sin importar en qué MFE esté navegando, **para** saber siempre cuántos artículos tengo sin interrumpir mi navegación.

**Criterios de aceptación:**
- [ ] Existe `MiniCartComponent` en `packages/mfe-checkout/src/app/components/mini-cart/`.
- [ ] Usa el `CartStore` internamente para obtener `totalItems` y `totalPrice`.
- [ ] Escucha el evento `checkout:cart-updated` del DOM para mantenerse sincronizado.
- [ ] Al hacer click navega a `/cart`.
- [ ] Está expuesto en la configuración de Module Federation de `mfe-checkout`.
- [ ] El shell lo importa y lo monta en el `HeaderComponent`.
- [ ] Muestra animación de highlight cuando `checkout:cart-item-added` se recibe.
- [ ] Tiene tests que verifican la escucha del evento y la actualización del conteo.

---

### US-038 — `CartStore`, `CartActions`, `CartSelectors`

**Como** desarrollador, **quiero** un `CartStore` basado en Signals en `mfe-checkout`, **para** gestionar el estado del carrito de forma centralizada y reactiva.

**Criterios de aceptación:**
- [ ] Estado: `items: signal<LineItem[]>`, `loading: signal<boolean>`, `error: signal<string | null>`.
- [ ] Selectors computed: `totalItems: computed()`, `totalPrice: computed()`, `isEmpty: computed()`.
- [ ] Actions: `addItem(item: LineItem)`, `removeItem(sku: string)`, `updateQuantity(sku, qty)`, `loadCart()`, `clearCart()`, `placeOrder(formData)`.
- [ ] El store escucha el evento `checkout:cart-item-added` del DOM y ejecuta `addItem()` reactivamente (usando `effect()` registrado en el constructor).
- [ ] El estado es inmutable; todos los updates usan `.update(current => ...)`.
- [ ] `CartFacadeService` encapsula todo.
- [ ] Tiene tests unitarios: add, remove, update, selectors calculados.

---

### US-039 — `CartService` (HTTP)

**Como** desarrollador, **quiero** un `CartService` que consuma los endpoints de la API de Checkout, **para** persistir y recuperar el carrito del servidor.

**Criterios de aceptación:**
- [ ] Métodos: `getCart(): Observable<CartResponse>`, `addItem(lineItem: LineItem): Observable<CartResponse>`, `removeItem(sku: string): Observable<CartResponse>`, `placeOrder(form: OrderFormData): Observable<OrderResponse>`.
- [ ] Usa `inject(CHECKOUT_API_URL)` y `HttpClient` tipado.
- [ ] Los errores se delegan al interceptor global.
- [ ] Tiene tests con MSW: respuestas exitosas, 400, 500.

---

### US-040 — `CanDeactivate` guard en CheckoutPage

**Como** usuario, **quiero** ser avisado si intento salir del checkout con datos en el formulario, **para** no perder la información que ya introduje accidentalmente.

**Criterios de aceptación:**
- [ ] Existe `checkoutDeactivateGuard` implementado como función `CanDeactivateFn<CheckoutPageComponent>`.
- [ ] Si el formulario está `dirty` y no ha sido enviado, el guard muestra un diálogo de confirmación ("¿Seguro que quieres salir? Perderás los datos introducidos.").
- [ ] Si el usuario confirma, la navegación continúa. Si cancela, se queda en la página.
- [ ] El guard está configurado en la ruta `/checkout`.
- [ ] Tiene tests: formulario dirty → diálogo, formulario pristine → navegación directa.

---

## EP-08 — Comunicación entre MFEs

### US-041 — Flujo AddToCart cross-MFE (Decide → Checkout)

**Como** usuario, **quiero** que al pulsar "Añadir al carrito" en la página de producto el carrito se actualice inmediatamente en el header, **para** saber que el artículo fue añadido sin tener que ir al carrito.

**Criterios de aceptación:**
- [ ] `mfe-decide` despacha `checkout:cart-item-added` con el `LineItem` al confirmar la adición.
- [ ] `mfe-checkout` (MiniCart) escucha `checkout:cart-item-added` y actualiza el conteo en el header.
- [ ] El `MiniCart` muestra la animación highlight durante 2 segundos.
- [ ] El flujo funciona con los tres servidores corriendo simultáneamente (no solo en tests unitarios).
- [ ] Hay un test E2E Playwright que valida este flujo end-to-end.

---

### US-042 — Flujo StoreSelected cross-MFE (Explore → Checkout/Decide)

**Como** usuario, **quiero** que al seleccionar una tienda en "Tiendas" se refleje en el selector de recogida del checkout, **para** no tener que seleccionarla de nuevo al pagar.

**Criterios de aceptación:**
- [ ] `mfe-explore` despacha `explore:store-selected` al elegir una tienda.
- [ ] `mfe-checkout` escucha `explore:store-selected` y pre-rellena el campo de tienda de recogida en el formulario de checkout.
- [ ] La tienda seleccionada se muestra en la `CartPage` como opción de entrega.
- [ ] El evento tiene `composed: true` y funciona entre Shadow DOM boundaries.
- [ ] Tiene test E2E que valida la persistencia de la selección de tienda en el checkout.

---

## EP-09 — Testing

### US-043 — Configurar MSW handlers para las tres APIs

**Como** desarrollador, **quiero** handlers de MSW que simulen los tres APIs del Tractor Store, **para** desarrollar y testear sin necesidad de levantar el backend.

**Criterios de aceptación:**
- [ ] Existe `packages/shared-catalog/src/lib/mocks/handlers.ts` con handlers para:
  - `GET /explore/api/home` → `HomeResponse` con datos realistas de tractores.
  - `GET /explore/api/category/:slug` → `CategoryResponse` con 6-12 productos.
  - `GET /explore/api/stores` → array de `Store`.
  - `GET /decide/api/product/:id` → `ProductResponse` o 404.
  - `GET /checkout/api/cart` → `CartResponse`.
  - `POST /checkout/api/cart/items` → `CartResponse` actualizado.
  - `DELETE /checkout/api/cart/items/:sku` → `CartResponse` actualizado.
  - `POST /checkout/api/orders` → `OrderResponse`.
- [ ] Los handlers usan datos de tractores reales (nombres, modelos, precios coherentes).
- [ ] Existen handlers alternativos de error para simular 500 en cada endpoint.
- [ ] Los mismos handlers funcionan en tests Jest (Node.js) y en desarrollo local (Service Worker).

---

### US-044 — Tests de stores y facades

**Como** desarrollador, **quiero** tests unitarios de los stores y facades de los tres MFEs, **para** asegurarme de que la lógica de negocio es correcta y robusta.

**Criterios de aceptación:**
- [ ] Tests de `CatalogStore`: loadHome actualiza estado, applyFilter filtra productos, clearFilters restaura estado, error HTTP queda en `error` signal.
- [ ] Tests de `ProductStore`: loadProduct carga variantes, selectVariant actualiza `selectedSku`, `selectedVariant` selector retorna variante correcta.
- [ ] Tests de `CartStore`: addItem incrementa `totalItems`, removeItem decrementa, `totalPrice` computed es correcto, clearCart vacía el estado.
- [ ] Tests de `CatalogFacadeService`, `ProductFacadeService`, `CartFacadeService`: delegan correctamente a stores y actions.
- [ ] Cobertura ≥ 85% en stores y facades.

---

### US-045 — Tests de componentes de páginas

**Como** desarrollador, **quiero** tests de los componentes de página de los tres MFEs usando MSW para mockear HTTP, **para** asegurar que el render y la interacción son correctos.

**Criterios de aceptación:**
- [ ] Tests de `HomeComponent`: render con datos del mock, click en categoría navega a `/category/:slug`, estado loading muestra skeleton.
- [ ] Tests de `CategoryPageComponent`: filtros actualizan URL, productos filtrados son correctos, categoría no encontrada muestra error.
- [ ] Tests de `ProductPageComponent`: render del producto, selección de variante actualiza URL, AddToCart con stock 0 deshabilita botón.
- [ ] Tests de `CartPageComponent`: lista items, eliminar item llama la action correcta, carrito vacío muestra CTA.
- [ ] Tests de `CheckoutPageComponent`: validación de campos requeridos, submit exitoso navega a `/thanks`.
- [ ] Todos los tests usan los handlers de MSW (no `HttpTestingController`).

---

### US-046 — Tests E2E con Playwright: flujo completo de compra

**Como** desarrollador, **quiero** tests E2E que cubran el flujo de compra completo, **para** detectar regresiones en la integración entre los tres MFEs.

**Criterios de aceptación:**
- [ ] El test navega a `/` (home) y verifica que se muestran las categorías.
- [ ] Hace click en una categoría y verifica que `CategoryPage` muestra productos.
- [ ] Hace click en un producto y verifica que `ProductPage` carga el detalle.
- [ ] Selecciona una variante y verifica que la URL incluye `?sku=`.
- [ ] Añade el producto al carrito y verifica que el `MiniCart` en el header se actualiza.
- [ ] Navega a `/cart` y verifica que el item aparece con el precio correcto.
- [ ] Navega a `/checkout`, completa el formulario y hace submit.
- [ ] Verifica que `/thanks` muestra el número de pedido.
- [ ] El test usa locators por role (`getByRole`, `getByTestId`) y assertions con auto-wait.
- [ ] El test corre en CI con `nx run shell-e2e:e2e`.

---

### US-047 — Tests E2E con Playwright: flujo de error

**Como** desarrollador, **quiero** tests E2E que verifiquen el manejo de errores de red, **para** asegurarme de que el usuario siempre recibe mensajes útiles en lugar de pantallas rotas.

**Criterios de aceptación:**
- [ ] MSW devuelve 500 en `/decide/api/product/:id`; el test verifica que `ProductPage` muestra "Hubo un problema. Por favor, inténtalo de nuevo." con un botón de reintento.
- [ ] MSW devuelve 500 en `POST /checkout/api/orders`; el test verifica que `CheckoutPage` muestra el mensaje de error sin perder los datos del formulario.
- [ ] Un MFE falla al cargar (Module Federation error); el test verifica que el shell muestra `MfeErrorFallback`.
- [ ] Los mensajes de error son en español y no exponen detalles técnicos (sin stack traces, sin "HTTP 500").

---

### US-048 — Storybook test-runner en CI

**Como** desarrollador, **quiero** que el Storybook test-runner se ejecute en CI en cada PR, **para** detectar automáticamente si algún componente del design system deja de renderizar correctamente.

**Criterios de aceptación:**
- [ ] El workflow de CI tiene un step `Test Storybook` que ejecuta `storybook-test-runner`.
- [ ] Si una story tiene errores en consola al renderizar, el test falla y bloquea el merge.
- [ ] Las `play functions` de las stories interactivas se ejecutan como tests.

---

## Resumen de prioridades

| Prioridad | Historias | Razón |
|---|---|---|
| **P0 — Bloqueante** | US-001, US-003, US-004–US-006, US-016, US-017 | Sin modelos, tokens y Module Federation nada más puede arrancar |
| **P1 — Core funcional** | US-008–US-012, US-018–US-021, US-022–US-024, US-029–US-031, US-034–US-040 | El flujo principal de compra de principio a fin |
| **P2 — Completitud** | US-002, US-007, US-013, US-025–US-028, US-032–US-033, US-037–US-039, US-041–US-042 | Enriquecen la experiencia y la arquitectura |
| **P3 — Calidad** | US-014–US-015, US-043–US-048 | Testing y Storybook — necesarios para el entregable final |

---

*Generado el 2026-06-12. Referencia del reto: https://micro-frontends.org/tractor-store/*
