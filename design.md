# PDM UI Kit - Design System Documentation

> **Versión:** 0.2.0  
> **Framework:** Angular 15+  
> **Base Visual:** shadcn/ui Figma  
> **CSS Framework:** Tailwind CSS v3

---

## 1. Visión General

PDM UI Kit es una librería de componentes UI para Angular construida sobre los patrones visuales del Figma de shadcn/ui. Está diseñada con un enfoque **mobile-first** y **responsive by default**.

### Características Principales

- ✅ **Responsive by default** — Todos los componentes manejan mobile correctamente
- ✅ **Tokens CSS** — Sistema de diseño basado en variables CSS
- ✅ **TypeScript** — Tipado completo en todos los componentes
- ✅ **Overlay System** — Z-index escalonado para componentes flotantes
- ✅ **Accessibility** — ARIA labels, keyboard navigation, focus management
- ✅ **ChangeDetection.OnPush** — Optimizado para performance

---

## 2. Tokens de Diseño (CSS Variables)

Los componentes leen los tokens CSS del proyecto consumidor. Estas son las variables requeridas:

### 2.1 Colores Base

```css
:root {
  /* Background & Foreground */
  --background: 0 0% 100%;          /* hsl(0 0% 100%) */
  --foreground: 240 10% 3.9%;       /* hsl(240 10% 3.9%) */
  
  /* Cards */
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  
  /* Popovers */
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  
  /* Primary */
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  
  /* Secondary */
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  
  /* Muted */
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  
  /* Accent */
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  
  /* Destructive */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  
  /* Border & Input */
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  
  /* Ring (focus) */
  --ring: 240 5.9% 10%;
  
  /* Radius */
  --radius: 0.5rem;
}
```

### 2.2 Colores Específicos (Sonner/Toast)

```css
/* Success */
--success-bg: 152 69% 95%;        /* emerald-50 */
--success-border: 152 53% 85%;    /* emerald-200 */
--success-text: 160 84% 25%;      /* emerald-900 */

/* Error */
--error-bg: 0 93% 95%;            /* red-50 */
--error-border: 0 79% 85%;        /* red-200 */
--error-text: 0 84% 35%;          /* red-900 */

/* Warning */
--warning-bg: 48 96% 95%;         /* amber-50 */
--warning-border: 48 96% 85%;     /* amber-200 */
--warning-text: 26 91% 25%;       /* amber-900 */
```

### 2.3 Breakpoints (Tailwind)

```typescript
const BREAKPOINTS = {
  sm: '640px',   // tablet portrait
  md: '768px',   // tablet landscape
  lg: '1024px',  // desktop
  xl: '1280px',  // large desktop
  '2xl': '1536px' // extra large
};
```

---

## 3. Sistema de Z-Index

El sistema de z-index está **centralizado** en `Z_INDEX` para evitar conflictos entre componentes overlay.

### Jerarquía (de menor a mayor)

| Capa | Valor | Uso |
|------|-------|-----|
| `base` | `z-0` | Elementos normales del DOM |
| `dropdown` | `z-10` | Selects, combobox, date-pickers |
| `sticky` | `z-20` | Headers, navigation bars |
| `overlay` | `z-30` | Popovers, hover cards, context menus |
| `drawerBackdrop` | `z-40` | Backdrop de sidebar drawer |
| `drawer` | `z-50` | Sidebar drawer, sheets laterales |
| `modalBackdrop` | `z-50` | Backdrop de dialogs |
| `modal` | `z-[60]` | Dialogs, alert-dialogs |
| `popover` | `z-[70]` | **CRÍTICO**: Tooltips, dropdowns DENTRO de modals |
| `toast` | `z-[100]` | Notificaciones globales (sobre todo) |

### ⚠️ Reglas Críticas

1. **Componentes overlay** (select options, dropdown menu, tooltip) SIEMPRE usan `z-[70]`
2. Esto permite que funcionen **DENTRO de modals** (z-[60])
3. El backdrop de modal debe ser `z-50` para estar DEBAJO del contenido del modal

### Uso en Código

```typescript
import { Z_INDEX } from 'pdm-ui-kit';

// En componentes
panelClass = Z_INDEX.popover;  // z-[70]
```

---

## 4. Componentes

### 4.1 Button (`pdm-button`)

**Selector:** `pdm-button`

#### Variantes

| Variante | Descripción | Uso |
|----------|-------------|-----|
| `default` | Fondo primary, texto primary-foreground | Acción principal |
| `primary` | Igual que default | Acción principal (alias) |
| `destructive` | Fondo destructive | Acciones peligrosas (eliminar) |
| `outline` | Borde border, fondo background | Acciones secundarias |
| `subtle` | Fondo secondary | Acciones menos prominentes |
| `secondary` | Igual que subtle | Alias de subtle |
| `ghost` | Transparente con hover | Toolbars, icon buttons |
| `link` | Estilo link con underline | Navegación |
| `with-icon` | Con icono integrado | Botones con icono + texto |
| `icon` | Cuadrado 36x36, solo icono | Icon buttons |
| `icon-circle` | Circular 40x40, solo icono | Icon buttons redondos |
| `rounded` | Circular 36x36 | Variant legacy |
| `loading` | Estado de carga | Durante operaciones async |

#### Sizes

| Size | Altura | Padding |
|------|--------|---------|
| `small` | h-8 (32px) | px-3 |
| `default` | h-9 (36px) | px-4 |
| `large` | h-10 (40px) | px-8 |

#### Props

```typescript
@Input() type: 'button' | 'submit' | 'reset' = 'button';
@Input() variant: PdmButtonVariant = 'default';
@Input() state: 'default' | 'hover' = 'default';
@Input() size: 'small' | 'default' | 'large' = 'default';
@Input() disabled = false;
@Input() loading = false;
@Input() className = '';
@Output() pressed = new EventEmitter<MouseEvent>();
```

#### Ejemplo

```html
<pdm-button variant="primary" size="default">Guardar</pdm-button>
<pdm-button variant="destructive" size="small">Eliminar</pdm-button>
<pdm-button variant="outline" [loading]="isLoading">Cancelar</pdm-button>
```

---

### 4.2 Input (`pdm-input`)

**Selector:** `pdm-input`

#### Sizes

| Size | Altura |
|------|--------|
| `mini` | h-6 (24px) |
| `small` | h-7 (28px) |
| `regular` | h-9 (36px) - default |
| `large` | h-10 (40px) |

#### Roundness

| Value | Descripción |
|-------|-------------|
| `default` | rounded-md (6px) |
| `round` | rounded-full |

#### Props

```typescript
@Input() type = 'text';
@Input() size: 'mini' | 'small' | 'regular' | 'large' = 'regular';
@Input() roundness: 'default' | 'round' = 'default';
@Input() invalid = false;  // Aplica borde destructive
@Input() label = '';
@Input() helperText = '';
@Input() errorText = '';
@Output() valueChange = new EventEmitter<string>();
@Output() blurred = new EventEmitter<FocusEvent>();
```

---

### 4.3 Select (`pdm-select`)

**Selector:** `pdm-select`

Usa **Angular CDK Overlay** para posicionar el panel dropdown.

#### Props

```typescript
@Input() value = '';
@Input() options: PdmSelectOption[] = [];
@Input() placeholder = 'Select an option';
@Input() disabled = false;
@Input() invalid = false;
@Input() overlayOptions?: PdmOverlayOptions;  // Override CDK config
@Output() valueChange = new EventEmitter<string>();
```

#### Z-Index

El panel usa `Z_INDEX.popover` (`z-[70]`) para aparecer sobre modals.

#### Position Strategy

Usa `createFlexiblePositionStrategy()` con fallback:
1. Bottom-left (default)
2. Top-left
3. Bottom-right
4. Top-right

---

### 4.4 Dialog (`pdm-dialog`)

**Selector:** `pdm-dialog`

Modal/Dialog con soporte responsive. **Mejorado en v0.2.0**.

#### Sizes

| Size | Mobile | Desktop |
|------|--------|---------|
| `responsive` | Fullscreen | max-w-[640px] - **RECOMENDADO** |
| `sm` | Fullscreen | max-w-[400px] |
| `md` | Fullscreen | max-w-[500px] |
| `lg` | Fullscreen | max-w-[640px] |
| `xl` | Fullscreen | max-w-[800px] |

#### Variantes

| Variante | Descripción |
|----------|-------------|
| `default` | Header + Footer con botones |
| `custom-close` | Footer alineado a la izquierda |

#### Footer Align

| Value | Comportamiento |
|-------|----------------|
| `right` | Botones alineados a la derecha (default) |
| `left` | Botones alineados a la izquierda |
| `full-width` | Botones apilados, ancho completo |

#### Props

```typescript
@Input() open = false;
@Input() size: 'responsive' | 'sm' | 'md' | 'lg' | 'xl' = 'responsive';
@Input() variant: 'default' | 'custom-close' = 'default';
@Input() title = 'Edit profile';
@Input() description = '';
@Input() closeOnBackdrop = true;
@Input() closeOnEsc = true;
@Input() showCloseButton = true;
@Input() showHeader = true;
@Input() showFooter = true;
@Input() alignFooter: 'right' | 'full-width' | 'left' = 'right';
@Output() openChange = new EventEmitter<boolean>();
@Output() primaryAction = new EventEmitter<void>();
@Output() secondaryAction = new EventEmitter<void>();
```

#### Z-Index

- Container (backdrop): `Z_INDEX.modalBackdrop` (`z-50`)
- Panel: `Z_INDEX.modal` (`z-[60]`)

#### Ejemplo

```html
<pdm-dialog 
  [open]="isOpen" 
  size="responsive"
  title="Edit Profile"
  (openChange)="isOpen = $event"
  (primaryAction)="onSave()">
  <!-- Content via ng-content -->
  <form>...</form>
</pdm-dialog>
```

---

### 4.5 Drawer (`pdm-drawer`)

**Selector:** `pdm-drawer`

Drawer/Sheet con soporte responsive y posicionamiento configurable.

#### Positions

| Position | Mobile | Desktop |
|----------|--------|---------|
| `bottom` | Bottom sheet | Bottom sheet |
| `left` | Side panel | Side panel |
| `right` | Side panel | Side panel |
| `top` | Top sheet | Top sheet |

#### Sizes

| Size | Vertical (bottom/top) | Horizontal (left/right) |
|------|----------------------|-------------------------|
| `sm` | max-h-[50vh] | max-w-[400px] |
| `md` | max-h-[66vh] | max-w-[500px] - **default** |
| `lg` | max-h-[80vh] | max-w-[640px] |
| `full` | 100% | 100% |

#### Props

```typescript
@Input() open = false;
@Input() position: 'bottom' | 'left' | 'right' | 'top' = 'bottom';
@Input() size: 'sm' | 'md' | 'lg' | 'full' = 'md';
@Input() title = '';
@Input() description = '';
@Input() showHandle = true;  // Solo para bottom
@Input() showCloseButton = true;
@Input() closeOnEsc = true;
@Input() closeOnBackdropClick = true;
@Output() openChange = new EventEmitter<boolean>();
```

#### Z-Index

- Container: `Z_INDEX.drawer` (`z-50`)

---

### 4.6 Sheet (`pdm-sheet`)

**Selector:** `pdm-sheet`

Side panel simplificado (sin lógica de legacy drawer).

#### Props

```typescript
@Input() open = false;
@Input() side: 'top' | 'right' | 'bottom' | 'left' = 'right';
@Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
@Input() closeOnEsc = true;
@Input() closeOnBackdropClick = true;
@Output() openChange = new EventEmitter<boolean>();
```

#### Sizes

| Size | Horizontal | Vertical |
|------|------------|----------|
| `sm` | 320px / 40vh | - |
| `md` | 400px / 50vh | default |
| `lg` | 500px / 66vh | - |
| `xl` | 640px / 80vh | - |
| `full` | 100% | 100% |

---

### 4.7 Table (`pdm-table`)

**Selector:** `pdm-table`

Tabla base con soporte responsive. **Simplificada en v0.2.0** (sin drag & drop).

#### Variantes

| Variante | Descripción |
|----------|-------------|
| `default` | Tabla básica sin estilos extra |
| `data` | Tabla con bordes y espaciado para data |
| `interactive` | Tabla con hover, sticky header y estilos interactivos |

#### Responsive Strategies

| Strategy | Mobile | Desktop |
|----------|--------|---------|
| `scroll` | Scroll horizontal | Full width |
| `wrap` | Contenido hace wrap | Contenido hace wrap |
| `stack` | Filas como cards | Tabla normal |
| `collapse` | Columnas opcionales ocultas | Todas visibles |

#### Props

```typescript
@Input() variant: 'default' | 'data' | 'interactive' = 'default';
@Input() responsiveStrategy: 'scroll' | 'wrap' | 'stack' | 'collapse' = 'scroll';
@Input() fullBleed = false;  // Scroll edge-to-edge en mobile
```

#### Ejemplo

```html
<pdm-table variant="interactive" responsiveStrategy="scroll" [fullBleed]="true">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John</td>
      <td>john@example.com</td>
    </tr>
  </tbody>
</pdm-table>
```

---

### 4.8 Data Table (`pdm-data-table`)

**Selector:** `pdm-data-table`

Tabla genérica con paginación, filtrado y selección. **Genérica desde v0.2.0**.

#### Column Interface

```typescript
interface PdmDataTableColumn<T> {
  key: keyof T;           // Key del campo
  label: string;          // Header label
  width?: string;         // CSS width
  sortable?: boolean;     // Enable sorting
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => string;  // Custom render
  cellTemplate?: TemplateRef;  // Custom template
  hideOnMobile?: boolean; // Ocultar en mobile
  cellClass?: string;     // Classes para celdas
  headerClass?: string;   // Classes para header
}
```

#### Props

```typescript
@Input() columns: PdmDataTableColumn<T>[] = [];
@Input() rows: T[] = [];
@Input() responsiveStrategy: TableResponsiveStrategy = 'scroll';
@Input() selectable = false;
@Input() showActions = false;
@Input() showFilter = true;
@Input() showPagination = true;
@Input() showColumnSelector = false;
@Input() page = 1;
@Input() pageSize = 10;
@Input() query = '';
```

#### Ejemplo

```typescript
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
```

```html
<pdm-data-table
  [columns]="columns"
  [rows]="users"
  [selectable]="true"
  (selectionChange)="onSelect($event)">
</pdm-data-table>
```

---

### 4.9 Card (`pdm-card`)

**Selector:** `pdm-card`

Visual container primitivo.

#### Estructura (Directivas)

```html
<pdm-card>
  <div pdmCardHeader>
    <h3>Title</h3>
    <p>Description</p>
  </div>
  <div pdmCardContent>
    <!-- Content -->
  </div>
  <div pdmCardFooter>
    <!-- Actions -->
  </div>
</pdm-card>
```

---

### 4.10 Alert (`pdm-alert`)

**Selector:** `pdm-alert`

Mensaje de alerta con icono, título y descripción.

#### Variantes

| Variante | Descripción |
|----------|-------------|
| `default` | Alerta con icono, título y descripción |
| `title-only` | Solo título, sin descripción |
| `destructive` | Estilo de error (rojo) |

#### Props

```typescript
@Input() variant: 'default' | 'title-only' | 'destructive' = 'default';
@Input() title = 'Success!';
@Input() description = '';
@Input() details: string[] = [];  // Lista de bullets
```

---

### 4.11 Badge (`pdm-badge`)

**Selector:** `pdm-badge`

Etiqueta de estado.

#### Variantes

| Variante | Descripción |
|----------|-------------|
| `default` | Primary style |
| `secondary` | Secondary style |
| `destructive` | Red style |
| `outline` | Bordered style |
| `icon` | Con icono |
| `number` | Estilo número/contador |
| `destructive-number` | Contador en rojo |
| `secondary-number` | Contador en gris |

---

### 4.12 Tabs (`pdm-tabs`)

**Selector:** `pdm-tabs`

Tabs horizontales.

#### Props

```typescript
@Input() items: PdmTabItem[] = [];  // { label, value, disabled? }
@Input() value = '';
@Output() valueChange = new EventEmitter<string>();
```

---

### 4.13 Sonner/Toast (`pdm-sonner`)

**Selector:** `pdm-sonner`

Notificación tipo toast.

#### Tones

| Tone | Colores |
|------|---------|
| `default` | border-border bg-background |
| `success` | emerald (green) |
| `error` | red |
| `warning` | amber (yellow) |

#### Z-Index

`Z_INDEX.toast` (`z-[100]`) — Sobre todo lo demás.

---

### 4.14 Switch (`pdm-switch`)

**Selector:** `pdm-switch`

Toggle switch.

#### Sizes

| Size | Track | Thumb |
|------|-------|-------|
| `default` | w-8 h-[18.4px] | size-4 (16px) |
| `sm` | w-6 h-[14px] | size-3 (12px) |

---

### 4.15 Checkbox (`pdm-checkbox`)

**Selector:** `pdm-checkbox`

Checkbox con label opcional.

#### Variantes

| Variante | Descripción |
|----------|-------------|
| `default` | Checkbox simple con label |
| `subtext` | Checkbox con label + descripción |
| `card` | Checkbox en formato card |

---

### 4.16 Popover (`pdm-popover`)

**Selector:** `pdm-popover`

Panel flotante posicionado relativamente al trigger.

#### Props

```typescript
@Input() open = false;
@Input() triggerText = 'Open';
@Input() showTrigger = true;
@Output() openChange = new EventEmitter<boolean>();
```

#### Z-Index

`Z_INDEX.popover` (`z-[70]`)

#### Auto-placement

El componente detecta automáticamente si hay espacio debajo del trigger y coloca el panel arriba si es necesario.

---

### 4.17 Dropdown Menu (`pdm-dropdown-menu`)

**Selector:** `pdm-dropdown-menu`

Menú contextual con items, separadores y shortcuts.

#### Variantes

| Variante | Descripción |
|----------|-------------|
| `default` | Menú normal con items |
| `checkboxes` | Items con checkbox |
| `radio-group` | Items con radio button |

#### Menu Item Interface

```typescript
interface PdmMenuItem {
  type?: 'item' | 'label' | 'separator';
  label?: string;
  value?: string;
  shortcut?: string;      // Ej: "⌘K"
  disabled?: boolean;
  inset?: boolean;        // Indentado
  showChevron?: boolean;  // Indica sub-menú
  checked?: boolean;      // Para checkboxes
  radioSelected?: boolean; // Para radio-group
}
```

#### Z-Index

`Z_INDEX.popover` (`z-[70]`)

---

### 4.18 Tooltip (`pdm-tooltip`)

**Selector:** `pdm-tooltip`

Tooltip simple posicionado en los 4 lados.

#### Props

```typescript
@Input() text = '';
@Input() side: 'top' | 'right' | 'bottom' | 'left' = 'top';
```

---

### 4.19 Alert Dialog (`pdm-alert-dialog`)

**Selector:** `pdm-alert-dialog`

Dialog de confirmación.

#### Props

```typescript
@Input() open = false;
@Input() title = 'Are you absolutely sure?';
@Input() description = '';
@Input() confirmText = 'Continue';
@Input() cancelText = 'Cancel';
@Input() closeOnEsc = true;
@Output() confirm = new EventEmitter<void>();
@Output() cancel = new EventEmitter<void>();
```

---

## 5. Sistema Responsive

### 5.1 Mobile-First Approach

Todos los componentes están diseñados mobile-first:
- Los estilos base son para mobile
- Los breakpoints (`sm:`, `md:`, etc.) añaden comportamiento para desktop

### 5.2 Helpers Disponibles

```typescript
import { 
  responsive, 
  overflowResponsive, 
  spacingResponsive, 
  widthResponsive,
  TABLE_RESPONSIVE 
} from 'pdm-ui-kit';

// Generar clases responsive
const classes = responsive({ 
  default: 'block', 
  sm: 'flex', 
  lg: 'grid' 
}); // 'block sm:flex lg:grid'

// Overflow responsive
const overflow = overflowResponsive('x', 'scroll', 'auto'); 
// 'overflow-x-scroll sm:overflow-x-auto'

// Spacing responsive
const padding = spacingResponsive('px', { default: '4', sm: '6', lg: '8' });
// 'px-4 sm:px-6 lg:px-8'

// Width responsive
const width = widthResponsive({ default: 'full', sm: 'auto' });
// 'w-full sm:w-auto'
```

### 5.3 Constantes de Responsive

```typescript
import { RESPONSIVE_CONTAINER, RESPONSIVE_DISPLAY } from 'pdm-ui-kit';

// Containers
RESPONSIVE_CONTAINER.tableWrapper;      // Scroll horizontal en mobile
RESPONSIVE_CONTAINER.tableWrapperFullBleed;  // Edge-to-edge scroll
RESPONSIVE_CONTAINER.contentWrapper;    // Max-width responsive

// Display
RESPONSIVE_DISPLAY.hideOnMobile;        // hidden sm:block
RESPONSIVE_DISPLAY.showOnMobile;        // block sm:hidden
RESPONSIVE_DISPLAY.stackToFlex;         // flex flex-col sm:flex-row
```

---

## 6. Overlay System

### 6.1 Angular CDK Overlay

Los componentes overlay (select, dropdown-menu) usan Angular CDK Overlay:

```typescript
import { Overlay } from '@angular/cdk/overlay';
import { PdmOverlayOptions } from 'pdm-ui-kit';
```

### 6.2 Flexible Position Strategy

Helper para crear estrategias de posición:

```typescript
import { createFlexiblePositionStrategy } from 'pdm-ui-kit';

const strategy = createFlexiblePositionStrategy(
  overlay,
  triggerElement,
  4  // offset en px
);
```

### 6.3 Overlay Options

Override de configuración CDK:

```html
<pdm-select
  [options]="items"
  [overlayOptions]="{ panelClass: ['my-panel'], minWidth: 300 }">
</pdm-select>
```

### 6.4 Outside Click Directive

```typescript
import { PdmOutsideClickDirective } from 'pdm-ui-kit';
```

```html
<div pdmOutsideClick (outsideClick)="close()">
  <!-- Content -->
</div>
```

---

## 7. Patrones de Uso

### 7.1 Formularios

```html
<pdm-card>
  <div pdmCardHeader>
    <h3>Login</h3>
  </div>
  <div pdmCardContent>
    <pdm-field>
      <pdm-label>Email</pdm-label>
      <pdm-input type="email" [(value)]="email" />
    </pdm-field>
    <pdm-field>
      <pdm-label>Password</pdm-label>
      <pdm-input-password [(value)]="password" />
    </pdm-field>
  </div>
  <div pdmCardFooter>
    <pdm-button variant="primary" (pressed)="onLogin()">
      Login
    </pdm-button>
  </div>
</pdm-card>
```

### 7.2 Tablas con Acciones

```html
<pdm-data-table
  [columns]="columns"
  [rows]="users"
  [selectable]="true"
  [showActions]="true"
  (rowAction)="onAction($event)"
  (selectionChange)="onSelect($event)">
</pdm-data-table>
```

### 7.3 Overlay Dentro de Modal

```html
<!-- Dialog con Select dentro -->
<pdm-dialog [open]="isOpen" title="Edit User">
  <pdm-field>
    <pdm-label>Role</pdm-label>
    <!-- El select se posicionará sobre el dialog gracias a z-[70] -->
    <pdm-select
      [options]="roles"
      [(value)]="selectedRole">
    </pdm-select>
  </pdm-field>
</pdm-dialog>
```

### 7.4 Responsive Layout

```html
<!-- Stack en mobile, flex en desktop -->
<div class="flex flex-col sm:flex-row gap-4">
  <pdm-button variant="primary" class="w-full sm:w-auto">
    Save
  </pdm-button>
  <pdm-button variant="outline" class="w-full sm:w-auto">
    Cancel
  </pdm-button>
</div>
```

---

## 8. Debugging

### 8.1 Z-Index Stack

Helper para debuggear problemas de z-index:

```typescript
import { logZIndexStack } from 'pdm-ui-kit';

// En el navegador
logZIndexStack(element);
// Muestra en consola la jerarquía de z-index del elemento
```

### 8.2 Common Issues

| Problema | Causa | Solución |
|----------|-------|----------|
| Select no aparece en modal | z-index bajo | Usar `Z_INDEX.popover` (z-[70]) |
| Drawer cubre modal | Drawer z-50, modal z-50 | Drawer debe ser z-40 |
| Toast cubierto por modal | Toast z-index bajo | Usar `Z_INDEX.toast` (z-[100]) |

---

## 9. Changelog

### v0.2.0 (2024)

- ✨ Sistema de responsive utilities centralizado
- ✨ `pdm-table` refactorizado con responsive strategies
- ✨ `pdm-draggable-table` componente nuevo
- ✨ `pdm-data-table` ahora genérico
- ✨ `pdm-dialog` con modo responsive
- ✨ `pdm-drawer` refactorizado
- ✨ `pdm-sheet` con tamaños responsive
- ✨ Sistema de Z_INDEX centralizado

### v0.1.x

- Componentes base adaptados de shadcn/ui

---

## 10. Recursos

- **Repositorio:** https://github.com/corelusa/pdm-ui-kit
- **Figma Base:** https://www.figma.com/community/file/...
- **Documentación:** README.md, MIGRATION.md
- **Issues:** GitHub Issues
