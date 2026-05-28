# PRD-001: Robustez y Consistencia del UI Kit

> **Estado:** Borrador  
> **Tipo:** Technical / Product  
> **Prioridad:** Alta  
> **Fecha:** 2026-05-27

---

## 1. Contexto y Problema

### 1.1 Problema

La librería `pdm-ui-kit` tiene problemas recurrentes cuando se consume en proyectos Angular + Tailwind:

| Síntoma | Frecuencia | Impacto |
|---------|-----------|---------|
| Componentes pierden estilos parciales o totales en el proyecto consumidor | Alta | UI rota |
| `button-group` se superpone con otros componentes en responsive | Media | Mal diseño |
| Select options, dropdown, tooltip son tapados por headers de tabla | Media | Funcionalidad rota |
| Select dentro de dialog a veces aparece detrás del modal | Media | UX roto |
| `date-picker` tiene comportamiento errático de z-index | Baja | UX degradado |
| `stack`/`collapse` de tablas no se comporta como documentado | Media | Confianza |
| Group primitives (button-group, toggle-group, input-group) no se adaptan en pantallas chicas | Alta | UX mobile |

### 1.2 Causas Raíz

Después de un audit de 3 ángulos, las causas raíz son sistémicas, no bugs aislados:

1. **La librería no publica CSS propio.** Todo el estilo vive en clases Tailwind dentro de templates/TS. Si el proyecto consumidor no configura Tailwind para escanear la librería, la UI degrada a markup casi sin estilos.

2. **Componentes flotantes inconsistentes.** Algunos (`select`, `dropdown-menu`, `date-picker`) usan Angular CDK Overlay (se portalean al body, escapan de overflow clips). Otros (`tooltip`, `popover`, `hover-card`, `combobox`, `menubar`, `context-menu`) renderizan inline/absolute en el DOM local, lo que los hace vulnerables a clipping por `overflow`, `transform`, stacking contexts, headers sticky, y modals.

3. **z-index no se impone consistentemente.** Existe `Z_INDEX` centralizado, pero:
   - `date-picker` no lo usa en su panel.
   - Si el consumidor pasa `overlayOptions.panelClass`, puede reemplazar la clase de z-index.
   - `drawerBackdrop` y `overlay` están definidos pero nunca usados.

4. **Responsive incompleto.** `stack` y `collapse` de tablas no están implementados. Group primitives son rígidos en una fila.

5. **Host sin display explícito.** Solo `pdm-icon` define `:host { display: }`. Angular custom elements quedan inline por defecto, lo que rompe `w-full`, flex y grid en ciertos contextos.

---

## 2. Objetivos

### 2.1 Objetivo General

Hacer que `pdm-ui-kit` funcione de manera robusta y predecible en cualquier proyecto consumidor Angular + Tailwind, eliminando los síntomas de la sección 1.

### 2.2 Objetivos Específicos

- **Packaging:** Consumidores obtienen estilos correctos sin configuración manual de Tailwind.
- **Overlays:** Ningún overlay se ve tapado por otro componente, overflow, o stacking context.
- **Responsive:** Componentes se adaptan correctamente en mobile sin overlap.
- **Contrato claro:** Documentación de integración de consumidor sin ambigüedades.

---

## 3. Scope — Qué incluye y qué no

### 3.1 Incluye (In Scope)

| Área | Items |
|------|-------|
| **Packaging de estilos** | Publicar CSS de tokens/tema, actualizar README con integración Tailwind, incluir vars chart |
| **Overlay system** | Migrar tooltip, popover, hover-card, combobox a CDK Overlay; crear helper de merge de z-index |
| **z-index** | Consolidar escala Z_INDEX, corregir date-picker, asegurar que overlayOptions nunca borre z-index base |
| **Responsive** | Rediseñar button-group, toggle-group, input-group para mobile; completar o quitar stack/collapse de tablas |
| **Host display** | Agregar `:host` a componentes que lo necesitan (table, select, dialog, input, tabs, button-group) |
| **Dialog** | Agregar `min-h-0` al body del dialog |
| **Tests/Demo** | Storybook o demo que verifique overlay nesting, responsive, y overlap |

### 3.2 Excluye (Out of Scope)

- Reescribir la librería a standalone components (mantener NgModules por ahora)
- Migrar a Angular 17+ standalone
- Agregar testing infrastructure completa ( Jasmine/Karma setup nuevo)
- Cambiar tokens de diseño o paleta de colores
- Agregar nuevos componentes
- Optimizar bundle size o tree-shaking
- Cambiar la estrategia de Z_INDEX (la escala actual es correcta, el problema es la enforcement)

---

## 4. Solución — Arquitectura

### 4.1 Arquitectura Propuesta

```
Fase 1 — Quick Wins (menor riesgo, mayor cobertura de síntomas)
├── 1.1 Consumable CSS bundle
│   ├── Crear src/lib/styles/tokens.css
│   └── Actualizar ng-package.json para incluirlo
├── 1.2 Documentación de integración
│   ├── Sección "Consumer Setup" en README.md
│   └── Tokens completos (incluyendo chart)
├── 1.3 Z-index enforcement
│   ├── Helper mergeOverlayPanelClass()
│   ├── Corregir date-picker
│   └── Eliminar duplicado drawerBackdrop/modalBackdrop (ambos z-50)
├── 1.4 Host display baseline
│   └── :host { display: block } en componentes clave
├── 1.5 Dialog scroll fix
│   └── min-h-0 en body wrapper
│
Fase 2 — Overlay Foundation (trabajo medium, impacta UX)
├── 2.1 Shared overlay base (crear overlay-service o reutilizar createOverlayStrategy)
├── 2.2 Migrar tooltip a CDK Overlay
├── 2.3 Migrar popover a CDK Overlay
├── 2.4 Migrar hover-card a CDK Overlay
├── 2.5 Migrar combobox a CDK Overlay
├── 2.6 Migrar menubar submenu + context-menu a CDK Overlay
│
Fase 3 — Responsive Hardening
├── 3.1 Rediseñar button-group con estrategia responsive
├── 3.2 Ajustar toggle-group, input-group
├── 3.3 Corregir toolbar de data-table
├── 3.4 Table strategy: implementar o remover stack/collapse
│
Fase 4 — Regression Coverage
├── 4.1 Storybook/demo con escenarios conflictivos
└── 4.2 Tests mínimos de overlay stacking y responsive
```

### 4.2 Notas de Diseño

- **Angular CDK Overlay** es el patrón correcto para todos los overlays. Es el mismo que ya usan `select`, `dropdown-menu`, `date-picker`. El helper `createFlexiblePositionStrategy` ya existe.
- **No se debe crear un nuevo sistema de overlays.** Se reutiliza y estandariza el existente.
- **z-index scale actual es correcta.** El problema es la implementación inconsistente, no la escala.
- **CSS bundle no reemplaza Tailwind.** Los componentes siguen usando clases Tailwind en templates. El bundle cubre solo tokens y estilos base que no pueden ser generados por Tailwind (CSS custom properties, keyframes de animación).

---

## 5. Criterios de Aceptación

### 5.1 Packaging

- [ ] Existe un archivo CSS publicable en el paquete que define todos los tokens requeridos
- [ ] Consumidores pueden hacer `import 'pdm-ui-kit/styles'` y obtener los tokens básicos
- [ ] README incluye ejemplo concreto de configuración Tailwind `content` para escanear la librería
- [ ] Todos los tokens usados en componentes están documentados (incluyendo `--chart-*`)

### 5.2 Overlay

- [ ] `tooltip` funciona dentro de `pdm-dialog` sin ser tapado
- [ ] `tooltip` funciona dentro de `pdm-table` con sticky header sin ser tapado
- [ ] `tooltip` no es clipeado por `overflow: hidden/auto` del ancestro
- [ ] `popover` tiene el mismo comportamiento que tooltip
- [ ] `hover-card` tiene el mismo comportamiento
- [ ] `combobox` tiene el mismo comportamiento
- [ ] `menubar` submenu tiene el mismo comportamiento
- [ ] `context-menu` tiene el mismo comportamiento
- [ ] Ningún overlay es clipeado por ninguna configuración de overflow de ningún ancestro

### 5.3 z-index

- [ ] `date-picker` usa `Z_INDEX.popover` en su panel overlay
- [ ] Consumer no puede romper el z-index base pasando `overlayOptions.panelClass`
- [ ] Drawer y Dialog tienen valores distintos y documentados (no ambos `z-50`)
- [ ] `logZIndexStack` sigue funcionando para debugging

### 5.4 Responsive

- [ ] `button-group` con 4+ botones no se superpone con elementos adyacentes en mobile
- [ ] `toggle-group` no se superpone en mobile
- [ ] `input-group` con pre/suffix no rompe su contenedor en mobile
- [ ] Toolbar de `data-table` no se superpone en mobile
- [ ] Tabla con `responsiveStrategy="stack"` convierte filas en cards en mobile
- [ ] Tabla con `responsiveStrategy="collapse"` oculta columnas en mobile

### 5.5 Host display

- [ ] `pdm-table` responde a `w-full` desde el host
- [ ] `pdm-select` responde a `w-full` desde el host
- [ ] `pdm-dialog` responde a `class` de width desde el host
- [ ] `pdm-button-group` no fuerza inline en contexts de flex/grid

### 5.6 Dialog

- [ ] Dialog con mucho contenido tiene scroll interno sin overflow en el viewport
- [ ] Scroll del dialog funciona en iOS Safari
- [ ] Header y footer del dialog se mantienen visibles durante el scroll

---

## 6. Medición de Éxito

### 6.1 Antes

| Métrica | Valor estimado |
|---------|---------------|
| Tickets de "componente no se ve" en consumidores | ~4/mes |
| Tickets de "overlay se tapa" | ~2/mes |
| Tickets de "responsive se rompe" | ~2/mes |
| Confianza en la librería (subjetiva) | Media |

### 6.2 Después (target a 3 meses)

| Métrica | Valor target |
|---------|------------|
| Tickets de "componente no se ve" en consumidores | 0/mes |
| Tickets de "overlay se tapa" | 0/mes |
| Tickets de "responsive se rompe" | 0/mes |
| Confianza en la librería (subjetiva) | Alta |
| Cobertura de scenarios críticos con demo/test | >80% |

---

## 7. Dependencias

- Angular CDK Overlay (ya en uso, peer dep)
- ng-packagr (build existente)
- Tailwind CSS (consumidor)
- No se introducen nuevas dependencias

---

## 8. Documentos Relacionados

- `audit/overlay-stacking.md` — detalle técnico del audit de overlays
- `audit/responsive-layout.md` — detalle técnico del audit de responsive
- `audit/packaging-consumer-styles.md` — mapa de arquitectura de packaging
- `src/lib/utils/z-index.ts` — escala actual de z-index
- `src/lib/overlay/create-flexible-position-strategy.ts` — estrategia de posición actual
- `MIGRATION.md` — guía de migración desde v0.1.x
- `design.md` — documentación de diseño existente

---

## 9. Roadmap Tentativo

| Semana | Entregable |
|--------|-----------|
| 1 | Fase 1 completa (CSS bundle + docs + z-index fix + host + dialog) |
| 2 | Fase 2: tooltip + popover migrados a CDK Overlay |
| 3 | Fase 2: hover-card + combobox migrados a CDK Overlay |
| 4 | Fase 2: menubar + context-menu migrados a CDK Overlay |
| 5 | Fase 3: button-group responsive + toggle-group + input-group |
| 6 | Fase 3: data-table toolbar + table stack/collapse |
| 7-8 | Fase 4: Demo/Storybook con escenarios críticos |
| 9+ | Mantenimiento, polish, follow-up de issues |

> **Nota:** El roadmap es tentativo. Las fases 1 y 2 tienen scope más definido y menor riesgo. La fase 3 requiere más investigación de usuario/consumidor para priorizar correctamente.

---

## 10. Preguntas Abiertas (para el equipo)

1. ¿Los consumidores de la librería usan Storybook? ¿Vale la pena invertir en stories o preferimos una demo standalone?
2. ¿Hay proyectos consumidores específicos donde podamos validar los fixes antes de publicar la nueva versión?
3. ¿La librería necesita seguir soporte para Angular 14 además de 15+? Los devDeps actuales apuntan a Angular 14.2, pero peerDeps dicen >=15.
4. ¿Queremos version bump a 0.3.0 por breaking en overlay behavior, o 0.2.x por ser "bugfixes"?
5. ¿Hay presupuesto para tests automatizados (Karma/Jasmine o migrar a Vitest/Jest)?
