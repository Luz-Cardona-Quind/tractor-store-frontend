---
name: rspack-config
description: 'Configuración Rspack + Module Federation para host y remotes. Setup module-federation.config.ts.'
maxContextLines: 350
user-invokable: true
disable-model-invocation: false
scope: 'module-federation'
---

# Skill: Rspack Config (MFE)

**Scope**: ModuleFederation📦
**Trigger**: "crear MFE", "configurar Module Federation", "exposes/remotes"

---

## Propósito

Configurar Rspack y Module Federation para host y remotes siguiendo la estructura del proyecto.

---

## Contexto mínimo (autosuficiente)

- Host y remotes deben poder compilar y resolver `exposes/remotes` sin acoplamiento fuerte.
- El contrato de federación es técnico: nombre del remote, `entry`, módulos expuestos y shared deps.
- La configuración debe permitir evolución independiente por MFE.

## Checklist de configuración

1. Definir `name` único por host/remote.
2. Definir `exposes` en remote con rutas estables.
3. Definir `remotes` en host con alias coherentes.
4. Compartir dependencias críticas (`singleton` cuando aplique).
5. Verificar build local del host y del remote.

## Reglas obligatorias

- No romper aliases existentes del host.
- Evitar exponer rutas internas inestables como contrato público.
- Mantener la frontera host/remote por módulos, no por archivos sueltos.
- Cambios de federación requieren validación de rutas lazy.

## Anti-patrones

- Duplicar configuración de shared deps con versiones incompatibles.
- Hardcodear URLs de remoto sin estrategia de entorno.
- Cambiar nombres de `exposes` sin actualizar consumo en host.

