---
name: funnel
description: Cambia el funnel activo para la conversación. Uso: /funnel [slug]
user-invocable: true
---

Cambia el funnel activo a: **$ARGUMENTS**

Usa este mapeo para saber qué archivo editar:

- `seed-mexico` → `src/app/content/funnel-copy.ts`
- `seed-mexico-qz` → `src/funnels/seed-mexico-qz/copy.ts`

Si el slug no existe, lee `src/config/funnels.ts` y lista los funnels registrados.

Confirma el cambio en una sola línea: qué funnel está activo y qué archivo es el de contenido.
