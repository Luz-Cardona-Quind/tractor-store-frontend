---
name: remote-deployment
description: 'Deploy independiente de MFEs con CDN y versionado. Configuración de build y despliegue.'
maxContextLines: 300
user-invokable: true
disable-model-invocation: false
scope: 'module-federation'
---

# Skill: Remote Deployment (MFE)

**Scope**: ModuleFederation📦
**Trigger**: "deploy MFE", "configurar CDN", "versionado remotes"

---

## Propósito

Configurar deploy independiente de MFEs con versionado y CDN.

---

## Contexto mínimo (autosuficiente)

- Cada remote debe desplegarse de forma independiente y versionable.
- El host debe consumir entry remoto por entorno/version sin redeploy obligatorio.
- Pipeline de despliegue debe validar artefacto y compatibilidad de contrato.

## Estrategia recomendada

1. Versionar artefactos del remote por release.
2. Publicar a CDN con ruta estable + control de versión.
3. Parametrizar URLs de remotes por entorno.
4. Validar rollback rápido a versión previa.

## Checklist de despliegue

- Build del remote reproducible.
- Asset manifest y remote entry accesibles desde host.
- Smoke test de navegación host -> remote.
- Estrategia de caché definida (evitar servir entry obsoleto).

## Reglas obligatorias

- No acoplar deploy del remote al ciclo de release del host.
- No sobrescribir artefactos sin versionado.
- Mantener trazabilidad de versión desplegada por entorno.
