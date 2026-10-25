# PDM UI Kit

Librería de componentes UI para Angular 15+, construida sobre patrones visuales del **Figma de shadcn/ui** y adaptada para el ecosistema de Corelusa.

## ⚠️ Consumer Setup - IMPORTANT

Para que los componentes funcionen correctamente, seguí estos pasos:

### 1) Configurar Tailwind para escanear la librería

En tu `tailwind.config.js`, agregá el path de la librería:

```js
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    // ... otros paths
    'node_modules/pdm-ui-kit/**/*.{ts,html}'
  ],
  // ... resto de tu config
};
```

**Sin esto, las clases Tailwind no se generarán y la UI se verá sin estilos.**

### 2) Definir los tokens CSS

Copiá las variables en tu CSS base (por ejemplo `styles.css`):

```css
:root {
  /* Colores base */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  /* Colores de componente */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;

  /* Bordes y inputs */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;

  /* Radio */
  --radius: 0.5rem;

  /* Charts (para pdm-chart) */
  --chart-1: 12 76% 61%;
  --chart-2: 173 58% 39%;
  --chart-3: 197 37% 24%;
  --chart-4: 43 74% 66%;
  --chart-5: 27 87% 67%;
}

/* Dark mode (opcional) */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;

  /* Ayuda a los controles nativos (scrollbars, <select>, <option>) a usar la paleta oscura. */
  color-scheme: dark;
}
```

> **Dark mode + overlays:** poné la clase `.dark` en `<html>` o `<body>`, **no** en un wrapper intermedio.
> Los paneles de `pdm-select`, `pdm-combobox`, `pdm-popover`, `pdm-tooltip`, `pdm-dialog`,
> `pdm-dropdown-menu`, `pdm-context-menu` y `pdm-hover-card` se adjuntan al overlay container
> global de Angular CDK (que vive en `<body>`). Si `.dark` está en un contenedor interno,
> esos paneles quedan fuera del scope y se renderizan con tema claro.

### 3) Configurar los colores en Tailwind

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  }
};
```

> El kit **no** necesita plugins de Tailwind: las animaciones de entrada las define el propio kit. No instales `tailwindcss-animate` para el kit.

### 4) Opcional: Importar tokens directamente

Si preferís importar los tokens desde el paquete:

```css
@import 'pdm-ui-kit/styles';
```

> **Nota:** Esta opción aún requiere la configuración de Tailwind content.

---

## ✨ What's New in v1.10.0

- 🧩 **`ControlValueAccessor` en los controles de formulario** — `pdm-input`, `pdm-textarea`, `pdm-checkbox`, `pdm-switch`, `pdm-select` y `pdm-native-select` se bindean directo a `[formControl]` / `[formControlName]` / `[(ngModel)]`

> v1.10.0 es **aditivo**: no hay cambios breaking. Agrega la dependencia peer `@angular/forms` (`>=15.0.0`), que ya viene en todo proyecto generado por Angular CLI.

## ✨ What's New in v1.9.0

- 🖥️ **`pdm-data-table` en modo servidor** — `paginationMode="server"`, `totalRows`, `sortState`, `loading`; la tabla deja de filtrar/ordenar/paginar en el cliente
- ⚡ **`pdm-virtual-table`** — tabla virtualizada con `@angular/cdk/scrolling` para cientos/miles de filas
- ⏱️ **`pdm-input` con `debounceMs`** — emite `valueChange` con debounce configurable (0 = comportamiento actual)
- 🎨 **`pdm-chart` con `colors` y `valueFormatter`** — color por datapoint y formato de valores
- ♿ **Soporte `prefers-reduced-motion`** — el kit respeta la preferencia de movimiento reducido
- 🎞️ **Keyframes propios** — el kit ya no depende de `tailwindcss-animate`
- 🧩 **`pdm-sonner` con lista de toasts** — `[toasts]` renderiza un stack dismissible
- ♿ **`pdm-table` con `caption` y `aria-sort`** — nuevo `pdmSortHeader` directive
- 🪜 **Escala de z-index como tokens Tailwind** — `Z_INDEX_VALUE`, `pdmZIndex()` y `PDM_TAILWIND_PRESET`

> v1.9.0 es **aditivo**: no hay cambios breaking. Todos los inputs nuevos son opcionales.

## ✨ What's New in v0.3.0

- 🐛 **Overlay robustness** — Tooltip, popover, hover-card ahora usan CDK Overlay y no se tapan
- 📱 **Responsive fixes** — Button-group, toggle-group, input-group ahora funcionan en mobile
- 📦 **CSS bundle** — Tokens exportados para consumo directo
- 🏷️ **Host display** — Componentes ahora responden correctamente a `w-full`, flex y grid
- 📜 **Dialog scroll** — Scroll interno ahora funciona correctamente en todos los navegadores

- 🎯 **Responsive by default** — Todas las tablas y dialogs manejan mobile correctamente
- 🔧 **Generic data-table** — Configurá columnas para cualquier tipo de dato
- 📦 **Separated concerns** — Drag & drop ahora en `pdm-draggable-table`
- 🚀 **Responsive utilities** — Sistema centralizado de breakpoints y helpers
- 📱 **Dialog/Drawer/Sheet mejorados** — Fullscreen mobile, modal/panel desktop
- 🎨 **Tamaños configurables** — sm, md, lg, xl en todos los componentes overlay

➡️ **[Ver Migration Guide](./MIGRATION.md)** si estás actualizando desde v0.1.x

## Base de diseño

Este kit está **basado en el Figma de shadcn/ui** y mantiene una estructura de estilos por tokens CSS (por ejemplo: `--background`, `--foreground`, `--primary`, `--border`, `--ring`, `--radius`).

## Compatibilidad

- Angular: 15, 16, 17
- Peer dependencies: `@angular/cdk`, `@angular/common`, `@angular/core`, `@angular/forms`, `@angular/platform-browser` (`>=15.0.0`)
- Arquitectura: NgModules (no standalone)
- Estilos: Tailwind CSS v3 + variables CSS del proyecto consumidor

## Uso rápido

### 1) Importa el módulo

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { PdmUiKitModule } from 'pdm-ui-kit';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, PdmUiKitModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

### 2) Usa componentes en tus templates

#### Botón

```html
<pdm-button variant="primary" size="default">Guardar</pdm-button>
<pdm-button variant="destructive" size="small">Eliminar</pdm-button>
<pdm-button variant="outline" size="large">Cancelar</pdm-button>
```

#### Alert

```html
<pdm-alert
  variant="default"
  title="Cambios guardados"
  description="La configuración fue actualizada correctamente.">
</pdm-alert>

<pdm-alert
  variant="destructive"
  title="Error al procesar"
  description="Intenta nuevamente en unos minutos.">
</pdm-alert>
```

#### Tabs

```html
<pdm-tabs [items]="tabs" [(value)]="activeTab"></pdm-tabs>
<p>Tab activa: {{ activeTab }}</p>
```

```ts
tabs = [
  { label: 'General', value: 'general' },
  { label: 'Seguridad', value: 'security' },
  { label: 'Facturación', value: 'billing' }
];

activeTab = 'general';
```

#### Table (responsive)

```html
<!-- Tabla simple con scroll horizontal en mobile -->
<pdm-table variant="interactive" responsiveStrategy="scroll">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>john@example.com</td>
      <td>Admin</td>
    </tr>
  </tbody>
</pdm-table>
```

#### Data Table (genérico)

```ts
import { PdmDataTableColumn } from 'pdm-ui-kit';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

columns: PdmDataTableColumn<User>[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', hideOnMobile: true }
];

users: User[] = [
  { id: 1, name: 'John', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane', email: 'jane@example.com', role: 'User' }
];
```

```html
<pdm-data-table
  [columns]="columns"
  [rows]="users"
  [selectable]="true"
  responsiveStrategy="scroll"
  (selectionChange)="onSelect($event)">
</pdm-data-table>
```

#### Data Table (modo servidor)

Cuando la paginación, el filtrado y el ordenamiento viven en el backend, poné la tabla en modo `server`: el componente deja de filtrar/ordenar/paginar en el cliente y sólo emite eventos.

```html
<pdm-data-table
  paginationMode="server"
  [columns]="columns"
  [rows]="currentPageRows"
  [totalRows]="totalRows"
  [sortState]="sortState"
  [loading]="loading"
  [page]="page"
  [pageSize]="pageSize"
  (queryChange)="onQuery($event)"
  (pageChange)="onPage($event)"
  (columnSort)="onSort($event)">
</pdm-data-table>
```

```ts
sortState: PdmDataTableSortState<User> = {
  column: this.columns[0],
  direction: 'asc'
};

onQuery(query: string): void {
  this.page = 1;
  this.reload({ query });
}

onPage(page: number): void {
  this.page = page;
  this.reload();
}

onSort(event: { column: PdmDataTableColumn<User>; direction: 'asc' | 'desc' }): void {
  this.sortState = { column: event.column, direction: event.direction };
  this.page = 1;
  this.reload();
}
```

- `paginationMode`: `'client'` (default, comportamiento actual) o `'server'`.
- `totalRows`: total de filas del backend; define `totalPages` y el contador del footer. Sin este input se usa `rows.length`.
- `sortState`: estado de ordenamiento controlado por el host. Sin este input se usa el estado interno del componente.
- `loading`: renderiza un estado de carga (skeleton) y expone `aria-busy="true"`.
- `queryChange`, `pageChange` y `columnSort` son los únicos canales hacia el backend en modo servidor.

#### Virtual Table

Para cientos o miles de filas, `pdm-virtual-table` renderiza sólo las filas visibles usando `@angular/cdk/scrolling`. Comparte el tipo de columna con `pdm-data-table`.

```html
<pdm-virtual-table
  [columns]="columns"
  [rows]="users"
  [rowHeight]="44"
  [height]="520"
  (selectionChange)="onSelect($event)">
</pdm-virtual-table>
```

- Requiere `@angular/cdk` en las dependencias del proyecto consumidor.
- El header queda fijo fuera del viewport; el cuerpo se virtualiza.
- `rowHeight` debe coincidir con el alto real de la fila.

#### Draggable Table

```html
<pdm-draggable-table 
  variant="interactive"
  [reorderRows]="true"
  (rowOrderChange)="onOrderChange($event)">
  <tbody>
    <tr data-row-id="1"><td>Task 1</td></tr>
    <tr data-row-id="2"><td>Task 2</td></tr>
    <tr data-row-id="3"><td>Task 3</td></tr>
  </tbody>
</pdm-draggable-table>
```

#### Dialog (responsive)

```html
<!-- Fullscreen en mobile, modal en desktop -->
<pdm-dialog 
  [open]="isOpen" 
  size="responsive"
  title="Edit Profile"
  description="Make changes to your profile here"
  (openChange)="isOpen = $event"
  (primaryAction)="onSave()">
  <div class="space-y-4">
    <input type="text" placeholder="Name" class="w-full" />
    <input type="email" placeholder="Email" class="w-full" />
  </div>
</pdm-dialog>
```

`maxWidth` overrides the desktop size while responsive mobile mode remains fullscreen:

```html
<pdm-dialog [open]="isOpen" maxWidth="800px" title="Custom width">
  <p>Dialog content</p>
</pdm-dialog>
```

`className` overrides base Tailwind utilities reliably through `cn()` and `tailwind-merge`, so the last conflicting utility wins:

```html
<pdm-dialog size="lg" className="sm:max-w-[900px]">
  <p>Dialog content</p>
</pdm-dialog>
```

Replace the built-in header or footer with projected slots:

```html
<pdm-dialog [open]="isOpen">
  <div pdmHeader>Custom header</div>
  <p>Dialog content</p>
  <div pdmFooter>Custom footer</div>
</pdm-dialog>
```

`pdm-alert-dialog` also supports `size`, responsive layouts, `maxWidth`, and reliable `className` overrides.

#### Drawer (side panel)

```html
<!-- Bottom sheet en mobile, side panel en desktop -->
<pdm-drawer
  [open]="isOpen"
  position="right"
  size="md"
  title="Settings"
  (openChange)="isOpen = $event">
  <div class="space-y-4">
    <h4>Preferences</h4>
    <p>Configure your settings here</p>
  </div>
</pdm-drawer>
```

#### Iconos

```html
<pdm-icon name="search" library="lucide" [size]="18"></pdm-icon>
<pdm-icon name="user" library="phosphor" [size]="20"></pdm-icon>
```

Si necesitas un asset exportado desde Figma MCP:

```html
<pdm-icon
  [assetUrl]="'http://localhost:3845/assets/icon-alert.svg'"
  ariaLabel="Alerta">
</pdm-icon>
```

#### Toasts (pdm-sonner)

`pdm-sonner` renderiza un toast individual (comportamiento original) o una lista de toasts:

```html
<!-- Toast individual -->
<pdm-sonner title="Guardado" description="Los cambios ya están aplicados" tone="success"></pdm-sonner>

<!-- Lista de toasts -->
<pdm-sonner [toasts]="toasts" (toastDismissed)="removeToast($event)"></pdm-sonner>
```

```ts
toasts: PdmToastItem[] = [
  { id: 1, title: 'Guardado', tone: 'success' },
  { id: 2, title: 'Error de red', description: 'Reintentá en unos segundos', tone: 'error' }
];
```

- `toasts`: lista de items (`title`, `description`, `tone`, `id`, `duration`). Sin este input (o con array vacío) se mantiene el toast individual.
- `toastDismissed`: emite el item descartado; el host decide cuándo quitarlo del array.
- `duration` se acepta por simetría de API pero el kit **no** descarta toasts automáticamente.
- `dismissed` sigue existiendo para el modo individual.

#### Chart

```html
<pdm-chart
  type="line"
  title="Visitas"
  description="Últimos 30 días"
  [labels]="['Lun', 'Mar', 'Mie', 'Jue', 'Vie']"
  [line]="[12, 18, 15, 22, 19]">
</pdm-chart>
```

Tipos soportados en `pdm-chart`:

- `area`
- `bar`
- `line`
- `pie`
- `radar`
- `radial`
- `tooltips`

#### Chart (colores por datapoint y formato de valores)

```html
<pdm-chart
  type="bar"
  [bars]="[12, 8, 20]"
  [labels]="['RED', 'YELLOW', 'GREEN']"
  [colors]="['#dc2626', '#eab308', '#16a34a']"
  [valueFormatter]="formatValue">
</pdm-chart>
```

```ts
formatValue = (value: number, index: number): string => `${value} ms`;
```

- `colors`: un color CSS por datapoint. Se aplica a las barras (chart `bar`) y a los segmentos y su leyenda (chart `pie`). Sin este input se usa la paleta por defecto.
- `valueFormatter`: formatea los valores numéricos que renderiza el chart (fila de valores en `bar`, métricas en `radar`, valor central en `radial`).

#### Input (debounce)

```html
<pdm-input [debounceMs]="700" (valueChange)="onSearch($event)"></pdm-input>
```

- `debounceMs`: `0` (default) emite `valueChange` de forma síncrona en cada input; con `> 0` emite sólo el último valor cuando el usuario deja de escribir.

#### Formularios reactivos (`[formControl]`)

Desde v1.10.0 los controles de formulario del kit implementan `ControlValueAccessor`, así que se bindean directo a un control de Angular Forms:

```html
<pdm-input      [formControl]="nameCtrl"></pdm-input>
<pdm-textarea   [formControl]="notesCtrl"></pdm-textarea>
<pdm-checkbox   [formControl]="acceptCtrl"></pdm-checkbox>
<pdm-switch     [formControl]="notifyCtrl"></pdm-switch>
<pdm-select     [formControl]="countryCtrl" [options]="countries"></pdm-select>
<pdm-native-select [formControl]="cityCtrl" [options]="cities"></pdm-native-select>
```

También funcionan con `[formControlName]` (dentro de un `FormGroup`) y con `[(ngModel)]`.

```ts
export class ProfileFormComponent {
  readonly nameCtrl = new FormControl('', { nonNullable: true, validators: [Validators.required] });
  readonly acceptCtrl = new FormControl(false, { nonNullable: true });
}
```

Comportamiento:

- **Valor**: el control escribe el valor en el componente y el componente escribe el valor de vuelta en el control cuando el usuario interactúa con él. El output existente (`valueChange` / `checkedChange`) sigue emitiendo igual que antes.
- **Tocado**: el control se marca como *touched* al salir el foco del campo (blur).
- **Deshabilitado**: `control.disable()` / `control.enable()` mapea al input `disabled` del componente.
- **`debounceMs`**: con `debounceMs > 0` el control recibe el valor con el mismo debounce que el output `valueChange` (la primera vez que se bindea un control de formulario, usá `debounceMs: 0`).

Estado de validación: el kit no agrega validadores propios — los validadores del control siguen siendo la única fuente de verdad. El estado visual de error se sigue expresando con los inputs `invalid` / `errorText`:

```html
<pdm-input
  [formControl]="nameCtrl"
  [invalid]="nameCtrl.invalid && nameCtrl.touched"
  [errorText]="nameCtrl.hasError('required') ? 'El nombre es obligatorio' : ''"
></pdm-input>
```

> Requisito: el proyecto consumidor debe tener `@angular/forms` instalado (`>=15.0.0`). Los proyectos generados por Angular CLI ya lo incluyen.

#### Z-index tokens

El kit expone su escala de z-index como tokens compartidos para que el proyecto consumidor no defina una escala en conflicto.

```ts
import { Z_INDEX, Z_INDEX_VALUE, pdmZIndex, PDM_TAILWIND_PRESET } from 'pdm-ui-kit';

Z_INDEX.modal;          // 'z-50'
Z_INDEX_VALUE.modal;    // 50
pdmZIndex('loadingOverlay'); // 200
```

Tokens disponibles: `base` (0), `dropdown` (10), `sticky` (20), `drawerBackdrop` (30), `drawer` (40), `modalBackdrop` (40), `modal` (50), `popover` (70), `toast` (100), `loadingOverlay` (200).

Para generarlos como utilidades Tailwind (`z-modal`, `z-popover`, `z-toast`, `z-loading-overlay`, ...) agregá el preset en tu `tailwind.config.js` y **eliminá tu escala propia**:

```js
// tailwind.config.js
const { PDM_TAILWIND_PRESET } = require('pdm-ui-kit/tailwind-preset');

module.exports = {
  presets: [PDM_TAILWIND_PRESET],
  content: [
    './src/**/*.{html,ts}',
    'node_modules/pdm-ui-kit/**/*.{ts,html}'
  ]
};
```

> `pdm-ui-kit/tailwind-preset` es un archivo standalone (CommonJS + ESM) sin dependencias: funciona en configs CommonJS y ESM. Con una config ESM también podés hacer `import { PDM_TAILWIND_PRESET } from 'pdm-ui-kit'`.

> Un loading overlay del consumidor debe usar `loadingOverlay` (200) en lugar de un valor propio como 9500.

#### Movimiento reducido

El kit respeta `prefers-reduced-motion: reduce`: las animaciones de entrada y los movimientos (tooltips, sidebar, etc.) se desactivan cuando el usuario pide movimiento reducido. No requiere configuración adicional; alcanzá con importar los estilos del kit (`@import 'pdm-ui-kit/styles';`).

## Responsive Design

Todos los componentes siguen **mobile-first approach**:

| Componente | Mobile Behavior | Desktop Behavior |
|------------|----------------|------------------|
| `pdm-table` | Scroll horizontal | Full width, no scroll |
| `pdm-data-table` | Oculta columnas opcionales | Muestra todas |
| `pdm-dialog` | Fullscreen | Modal centrado |
| `pdm-drawer` | Bottom sheet | Side panel |

### Breakpoints

```typescript
import { BREAKPOINTS } from 'pdm-ui-kit';

const breakpoints = {
  sm: '640px',   // tablet portrait
  md: '768px',   // tablet landscape
  lg: '1024px',  // desktop
  xl: '1280px',  // large desktop
  '2xl': '1536px' // extra large
};
```

### Responsive Utilities

```typescript
import { responsive, overflowResponsive, TABLE_RESPONSIVE } from 'pdm-ui-kit';

// Helper para clases responsive
const classes = responsive({ 
  default: 'block', 
  sm: 'flex', 
  lg: 'grid' 
}); // 'block sm:flex lg:grid'

// Helper para overflow
const overflow = overflowResponsive('x', 'scroll', 'auto'); 
// 'overflow-x-scroll sm:overflow-x-auto'

// Clases pre-definidas para tablas
const tableClasses = TABLE_RESPONSIVE.scroll.wrapper;
// 'relative w-full overflow-x-auto'
```

## Theming

Los componentes leen los tokens CSS del proyecto consumidor. Define tus variables globales para aplicar tu tema (light/dark o custom branding) sin modificar el kit.

## Componentes disponibles

Incluye componentes como:

- `pdm-button`, `pdm-input`, `pdm-textarea`, `pdm-select`
- `pdm-alert`, `pdm-badge`, `pdm-card`, `pdm-dialog`
- `pdm-tabs`, `pdm-table`, `pdm-data-table`, `pdm-draggable-table`
- `pdm-chart`, `pdm-tooltip`, `pdm-popover`, `pdm-dropdown-menu`
- `pdm-sidebar`, `pdm-sheet`, `pdm-drawer`, `pdm-calendar`
- `pdm-virtual-table` (tabla virtualizada), `pdm-sonner` (toasts)

Y más, todos exportados desde `PdmUiKitModule`.

## Documentación

- **[Migration Guide](./MIGRATION.md)** — Guía de migración desde v0.1.x
- **[API Reference](./docs/API.md)** — Documentación completa de todos los componentes (próximamente)

## Changelog

### v1.10.0
- ✨ `pdm-input`, `pdm-textarea`, `pdm-checkbox`, `pdm-switch`, `pdm-select`, `pdm-native-select`: implementan `ControlValueAccessor` (`[formControl]`, `[formControlName]`, `[(ngModel)]`)
- ✨ Estado `touched` en blur y estado `disabled` desde el control de formulario
- 📦 Nueva peer dependency `@angular/forms` (`>=15.0.0`)
- 📖 Documentación de uso con formularios reactivos

### v1.9.0
- ✨ `pdm-data-table`: modo servidor (`paginationMode`, `totalRows`, `sortState`, `loading`)
- ✨ `pdm-virtual-table`: tabla virtualizada con `@angular/cdk/scrolling`
- ✨ `pdm-input`: input `debounceMs`
- ✨ `pdm-chart`: inputs `colors` y `valueFormatter`
- ✨ `pdm-sonner`: modo lista con `[toasts]` y output `toastDismissed`
- ✨ `pdm-table`: input `caption` + directive `pdmSortHeader` (`aria-sort`)
- ✨ Escala de z-index exportada como tokens Tailwind (`Z_INDEX_VALUE`, `pdmZIndex`, `PDM_TAILWIND_PRESET`)
- ♿ Soporte de `prefers-reduced-motion` en el kit
- 🎞️ Keyframes propios: el kit ya no requiere `tailwindcss-animate`
- 📖 Documentación de adopción para consumidores

### v0.2.0 (2024)
- ✨ Sistema de responsive utilities centralizado
- ✨ `pdm-table` refactorizado con responsive strategies
- ✨ `pdm-draggable-table` componente nuevo (drag & drop)
- ✨ `pdm-data-table` ahora genérico con configuración de columnas
- ✨ `pdm-dialog` con modo responsive y tamaños configurables
- ✨ `pdm-drawer` refactorizado con posicionamiento y contenido genérico
- ✨ `pdm-sheet` con tamaños responsive
- 🐛 Fix: Tablas rompiendo el width en mobile
- 🐛 Fix: Dialog/Drawer sin responsive adecuado
- 📚 Migration guide completo
- 📚 Documentación mejorada con ejemplos responsive

### v0.1.x
- Componentes base adaptados de shadcn/ui
