# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

App web de rehabilitación lumbar personalizada (hernia discal L4-L5 / L5-S1, paciente Borja). Stack: HTML + CSS + JS vanilla, sin frameworks, sin build step. Se sirve directamente desde GitHub Pages en `https://roystrife.github.io/rehab-bor`.

Tras cada cambio: `git add <archivos> && git commit -m "..." && git push origin main`. GitHub Pages se actualiza automáticamente en 1-2 min. El PC tiene un auto-pull cada 5 min via Task Scheduler (`autopull.ps1`, ignorado por git).

## Arquitectura

### Separación estricta datos / lógica

- **`data.js`** — única fuente de verdad. Todo lo que define el plan (ejercicios, bloques, sesiones semanales, fichas wiki) vive aquí. **Es el único archivo que se edita para cambios de contenido.**
- **`app.js`** — lógica de UI, localStorage, renderizado. No declara datos de ejercicios.
- **`style.css`** — estilos. Design tokens en `:root`.
- **`index.html`** — estructura HTML estática. Los paneles los rellena `app.js` via `innerHTML`.

### Flujo de datos en `data.js`

```
Catálogos (CORE, HIP, HINGE, PULL, PUSH, SHOULDER, ARM, QUAD, GLUTE, CARD)
    → CAT (lookup global prefijado: 'CORE-A', 'HIP-B', ...)
    → expandBlock() convierte exIds en exs resolviendo contra CAT
    → WEEK (plan semanal, día 0-6, referencia exIds o exs inline)
    → buildSessions(WEEK) → SESSIONS (consume app.js)
```

Los bloques de movilidad (`MOB_BLOCK_A1`, `MOB_BLOCK_B_LUN`, etc.) se definen antes de `WEEK` y se insertan directamente en `blocks[]`.

### Estructura de un ejercicio en el catálogo

```js
'X': { grupo:'core', plano:'anti-ext', equipo:'bw',
  n:'Nombre del ejercicio', d:'3x10 cada lado',
  note:'Cue principal · Cue secundario',
  wid:'id-para-EX_DB',                    // enlaza con la ficha wiki
  variant:'S1-2: ... · S3-4: ... · S7+: ...',
  gym: true,                               // solo si requiere gym
  homeAlt: { n:'...', d:'...', note:'...' } }
```

### Fichas wiki (`EX_DB`)

Cada `wid` referenciado en un ejercicio debe tener su entrada en `EX_DB`:

```js
EX_DB['wid-del-ejercicio'] = {
  nombre, categoria, color,
  descripcion, posicion,
  pasos: ['...'],
  errores: ['...'],
  variantes: ['S1-2: ... S3-4: ...'],
  notas_columna: '...'
};
```

### IDs globales

Formato: `GRUPO-LETRA` (ej. `CORE-A`, `HIP-I`, `HINGE-F`). La letra puede ser `A`-`Z` o con sufijo (`G2`, `L2`). Para añadir ejercicios nuevos a un catálogo existente, usar la siguiente letra disponible.

### Plan semanal (`WEEK`)

Días numerados por `getDay()` (0=Dom, 1=Lun, ..., 6=Sab). Día 3 (Miércoles) es neural. Cada día tiene `blocks[]` con bloques identificados por `id` ('A','B','C',...). Los bloques usan `exIds` (resueltos contra CAT) o `exs` inline (array de objetos ejercicio directos).

## Tareas frecuentes

### Añadir un ejercicio nuevo

1. Añadirlo al catálogo correspondiente en `data.js` con la siguiente letra libre.
2. Crear su ficha `EX_DB['wid']` (descripcion, pasos, errores, variantes, notas_columna).
3. Si debe aparecer en el plan semanal, añadir su ID (`GRUPO-LETRA`) al `exIds` del bloque del día correspondiente en `WEEK`.
4. Si es de movilidad diaria, puede añadirse también a `MOB_BLOCK_HIP` o a los `MOB_BLOCK_B_*`.

### Cambiar la dosificación de un ejercicio

Editar el campo `d:` del ejercicio en el catálogo (afecta a todos los días donde aparece). Si solo debe cambiar en un día concreto, usar un ejercicio inline en `exs` del bloque de ese día.

### Añadir/quitar ejercicio de un día

Editar el array `exIds` del bloque correspondiente en `WEEK`. Si el bloque usa `exs` inline (como el bloque D del Miércoles), añadir el objeto directamente al array.

### Variantes por estadio (`PROG_STAGE`)

Los valores son `'S1-2'`, `'S3-4'`, `'S5-6'`, `'S7+'`. El campo `variant` del ejercicio y de `EX_DB` sigue el patrón `'S1-2: descripcion · S3-4: descripcion · ...'`. El estadio activo del usuario se guarda en `localStorage` como `rehab_prog_stage_v8`.

## Contexto clínico (relevante para añadir ejercicios)

- Hernia discal extruida bilateral L4-L5 y L5-S1 con afectación S1. Fase 2 de rehabilitación.
- Criterio de seguridad absoluto: **lumbar neutra** en todo ejercicio. Parar si irradiación S1.
- Los ejercicios de bisagra/RDL son el movimiento más sensible (tensión nervio ciático).
- Estadio actual: `PROG_STAGE` en localStorage (por defecto S1-2 en instancia nueva).
- `notas_columna` en EX_DB debe explicar siempre la relevancia para L4-L5/L5-S1.
