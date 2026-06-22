---
name: mfe-routing
description: 'Routing lazy loading entre host y MFEs. Configuración de rutas y carga dinámica de remotes.'
maxContextLines: 350
user-invokable: true
disable-model-invocation: false
scope: 'module-federation'
---

# Skill: MFE Routing (MFE)

**Scope**: ModuleFederation📦
**Trigger**: "configurar routing MFE", "lazy load remote", "entry.routes"

---

## Propósito

Configurar routing con lazy loading entre host y MFEs. Incluye entry.routes.ts y app.routes.ts.

---

## Contexto mínimo (autosuficiente)

- El host solo conoce el punto de entrada público del remote.
- Cada remote define su routing interno y su `entry` federado.
- El lazy loading evita cargar código de remotes fuera de demanda.

## Flujo recomendado

1. Host: registrar ruta lazy hacia el remote.
2. Remote: exponer `entry.routes.ts` o módulo de entrada.
3. Remote: resolver estado inicial antes de pintar páginas críticas.
4. Validar navegación ida/vuelta sin pérdida de estado.

## Reglas obligatorias

- Rutas públicas del remote deben ser estables.
- Evitar importar directamente componentes internos del remote desde host.
- Proteger rutas con guard/resolver cuando dependen de URL state.
- Mantener desacoplado el dominio de navegación entre MFEs.

## Checklist de calidad

- Navegación al remote funciona en frío y en caliente.
- Deep link al remote funciona con estado URL.
- Errores de remote no rompen navegación global del host.
- Pruebas de routing cubren casos felices y fallos.
