# Migration Guide v0.2.0 — Responsive & Generic Components

## 🎯 Overview

Esta versión introduce mejoras significativas al sistema responsive con:
- Tablas genéricas y responsive
- Dialog/Drawer/Sheet mejorados con responsive
- Sistema de utilities centralizado

---

## ✨ What's New

### 1. Sistema de Responsive Utilities

Nuevo módulo `@pdm-ui-kit/utils/responsive` con constantes, tipos y helpers para manejar responsive design de forma consistente.

```typescript
import { 
  BREAKPOINTS, 
  TABLE_RESPONSIVE, 
  responsive, 
  overflowResponsive 
} from 'pdm-ui-kit';
```

### 2. `pdm-table` — Refactorizado y Simplificado

**BREAKING CHANGE**: Drag & drop removido del componente base.

**Antes:**
```html
<pdm-table [reorderRows]="true" (rowOrderChange)="onOrderChange($event)">
  ...
</pdm-table>
```

**Ahora:** Usar `pdm-draggable-table` para drag & drop (ver abajo)

**Nuevas features:**
- ✅ Soporte responsive con estrategias configurables
- ✅ Componente más liviano y simple
- ✅ Mejores defaults para mobile

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

<!-- Tabla que permite wrap del contenido -->
<pdm-table variant="data" responsiveStrategy="wrap">
  ...
</pdm-table>

<!-- Tabla con scroll edge-to-edge en mobile (útil en containers con padding) -->
<pdm-table variant="interactive" responsiveStrategy="scroll" [fullBleed]="true">
  ...
</pdm-table>
```

### 3. `pdm-draggable-table` — NUEVO Componente

Drag & drop ahora en componente separado. Mismo API que antes, más responsive.

```html
<pdm-draggable-table 
  variant="interactive"
  responsiveStrategy="scroll"
  [reorderRows]="true"
  (rowOrderChange)="onOrderChange($event)">
  <tbody>
    <tr data-row-id="1"><td>Row 1</td></tr>
    <tr data-row-id="2"><td>Row 2</td></tr>
  </tbody>
</pdm-draggable-table>
```

**IMPORTANTE:** Cada `<tr>` debe tener atributo `data-row-id` único.

### 4. `pdm-data-table` — Ahora Genérico

**BREAKING CHANGE**: Interface hardcodeada reemplazada por configuración de columnas.

#### Modo Legacy (backward compatible)

Si no pasás columnas, funciona como antes (solo para `PdmDataTableRow`):

```typescript
interface PdmDataTableRow {
  id: string;
  status: string;
  email: string;
  amount: string;
  selected?: boolean;
}

rows: PdmDataTableRow[] = [
  { id: '1', status: 'Active', email: 'user@example.com', amount: '$100' }
];
```

```html
<pdm-data-table [rows]="rows"></pdm-data-table>
```

#### Modo Genérico (RECOMENDADO)

Define tus columnas y usa cualquier tipo de dato:

```typescript
import { PdmDataTableColumn } from 'pdm-ui-kit';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

columns: PdmDataTableColumn<User>[] = [
  { 
    key: 'name', 
    label: 'Name', 
    sortable: true 
  },
  { 
    key: 'email', 
    label: 'Email', 
    sortable: true 
  },
  { 
    key: 'role', 
    label: 'Role', 
    hideOnMobile: true  // Ocultar en mobile
  },
  { 
    key: 'createdAt', 
    label: 'Created', 
    render: (val) => new Date(val).toLocaleDateString(),
    width: '150px'
  }
];

users: User[] = [ /* tus datos */ ];
```

```html
<pdm-data-table
  [columns]="columns"
  [rows]="users"
  [selectable]="true"
  [showFilter]="true"
  [showPagination]="true"
  responsiveStrategy="scroll"
  (selectionChange)="onSelect($event)"
  (rowAction)="onAction($event)">
</pdm-data-table>
```

#### Configuración de Columnas

```typescript
interface PdmDataTableColumn<T> {
  key: keyof T;                  // Campo a mostrar
  label: string;                 // Label del header
  width?: string;                // Ancho CSS (ej: '100px', '20%')
  sortable?: boolean;            // Si es sortable
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: T) => string;  // Renderizado custom
  cellTemplate?: TemplateRef<...>;          // Template custom
  hideOnMobile?: boolean;        // Ocultar en < 768px
  cellClass?: string;            // Clases CSS para celdas
  headerClass?: string;          // Clases CSS para header
}
```

#### Inputs Adicionales

```typescript
@Input() responsiveStrategy: 'scroll' | 'wrap' | 'stack' | 'collapse' = 'scroll';
@Input() selectable = false;           // Mostrar checkboxes
@Input() showActions = false;          // Mostrar botón de acciones
@Input() showFilter = true;            // Mostrar filtro
@Input() showPagination = true;        // Mostrar paginación
@Input() showColumnSelector = false;   // Mostrar selector de columnas
@Input() filterFn?: (row: T, query: string) => boolean;  // Filtro custom
```

### 5. `pdm-card` — BREAKING CHANGE: variant="login" eliminado

**Card es ahora un componente UI primitivo puro sin lógica de negocio.**

**ANTES (v0.1.x):**
```html
<pdm-card 
  variant="login"
  title="Login to your account"
  [emailLabel]="'Email'"
  (primaryAction)="onLogin($event)">
</pdm-card>
```

**AHORA (v0.2.0):** Componer con primitivos

```html
<pdm-card>
  <div pdmCardHeader>
    <h3 class="text-lg font-semibold">Login to your account</h3>
    <p class="text-sm text-muted-foreground">Enter your email below to login</p>
  </div>
  
  <div pdmCardContent>
    <form [formGroup]="loginForm" class="flex flex-col gap-4">
      <pdm-field>
        <pdm-label>Email</pdm-label>
        <pdm-input 
          type="email" 
          formControlName="email" 
          placeholder="m@example.com" />
      </pdm-field>
      
      <pdm-field>
        <div class="flex items-center justify-between mb-2">
          <pdm-label>Password</pdm-label>
          <button type="button" class="text-sm text-foreground">
            Forgot password?
          </button>
        </div>
        <pdm-input-password formControlName="password" />
      </pdm-field>
    </form>
  </div>
  
  <div pdmCardFooter class="flex flex-col gap-2">
    <pdm-button 
      [fullWidth]="true" 
      [loading]="isLoading"
      (click)="onLogin()">
      Login
    </pdm-button>
    <pdm-button 
      variant="outline" 
      [fullWidth]="true"
      (click)="onGoogleLogin()">
      Login with Google
    </pdm-button>
  </div>
</pdm-card>
```

**¿Por qué el cambio?**
- ✅ Card ahora es un **primitivo UI puro** sin lógica de negocio
- ✅ Máxima flexibilidad para componer cualquier tipo de formulario
- ✅ Congruente con el resto de la librería (componentes primitivos componibles)
- ✅ No contamina componentes UI con lógica específica de dominio

**Componente TypeScript:**
```typescript
import { FormBuilder, Validators } from '@angular/forms';

export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  
  isLoading = false;

  constructor(private fb: FormBuilder) {}

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      // Tu lógica de autenticación aquí
    }
  }
  
  onGoogleLogin() {
    // Lógica OAuth Google
  }
}
```

---

### 6. Responsive Widths — Fixed en Pagination, Calendar, Context-menu, Menubar

**Componentes con widths fijos ahora usan estrategia mobile-first:**

#### `pdm-pagination`
- Select de "rows per page": `w-[100px]` mobile → `sm:w-[120px]` desktop

#### `pdm-calendar`
- Month dropdown: `w-16` mobile → `sm:w-[72px]` desktop
- Year dropdown: `w-16` mobile → `sm:w-[82px]` desktop

#### `pdm-context-menu`
- Menu width: `min-w-48 max-w-xs` mobile → `sm:min-w-52` desktop
- Permite wrapping en screens pequeñas

#### `pdm-menubar`
- Submenu dropdown: `min-w-40` mobile → `sm:min-w-48` desktop

**No requiere cambios en tu código** — mejoras automáticas en mobile.

---

### 7. `pdm-sidebar` — Responsive con Mobile Drawer

**Sidebar ahora tiene dos modos: drawer overlay (default) y sidebar persistente.**

#### Modo Drawer (default) — Mobile overlay, desktop sidebar fijo

**ANTES (v0.1.x):**
```html
<pdm-sidebar [collapsed]="collapsed">
  <nav>Menu items</nav>
</pdm-sidebar>
```

**AHORA (v0.2.0):**
```html
<pdm-sidebar [open]="sidebarOpen" (openChange)="sidebarOpen = $event">
  <nav>Menu items</nav>
</pdm-sidebar>
```

**Comportamiento:**
- Mobile (`< lg`): drawer overlay con backdrop (toggle con `open`)
- Desktop (`>= lg`): sidebar fijo siempre visible

#### Modo Sidebar Persistente

Si necesitás sidebar persistente en todas las pantallas:

```html
<pdm-sidebar mobileMode="sidebar" [collapsed]="collapsed">
  <nav>Menu items</nav>
</pdm-sidebar>
```

**Widths responsive:**
- Collapsed: `w-14` (todas las pantallas)
- Expanded mobile: `w-48`
- Expanded tablet: `w-56`
- Expanded desktop: `w-64`

---

### 8. `pdm-navigation-menu` — Scroll Horizontal Mobile

**Navigation menu ahora maneja overflow con scroll horizontal.**

**ANTES (v0.1.x):**
```html
<!-- Overflow si había muchos items -->
<pdm-navigation-menu [items]="navItems"></pdm-navigation-menu>
```

**AHORA (v0.2.0):**
```html
<!-- Scroll horizontal automático -->
<pdm-navigation-menu [items]="navItems"></pdm-navigation-menu>

<!-- O modo compact (items se adaptan) -->
<pdm-navigation-menu [items]="navItems" mobileMode="compact"></pdm-navigation-menu>
```

**Mejoras:**
- ✅ Scroll horizontal con `scrollbar-thin`
- ✅ `whitespace-nowrap` previene wrapping
- ✅ Full width en mobile, fit-content en desktop

---

### 9. `pdm-tabs` — Overflow-x-auto

**Tabs ahora soportan scroll horizontal cuando hay muchos items.**

**ANTES (v0.1.x):**
```html
<!-- Overflow invisible si había 10+ tabs -->
<pdm-tabs [items]="tabItems" [value]="activeTab"></pdm-tabs>
```

**AHORA (v0.2.0):**
```html
<!-- Scroll horizontal automático -->
<pdm-tabs [items]="tabItems" [value]="activeTab"></pdm-tabs>
```

**Mejoras:**
- ✅ Mobile: full width con scroll, padding responsive
- ✅ Desktop: fit-content, padding ampliado
- ✅ Smooth scroll automático

---

### 10. `pdm-command` — Max-height Responsive

**Command palette ahora adapta su altura al viewport en mobile.**

**Cambio automático (no requiere modificación):**
- Mobile: `max-h-[50vh]` (50% viewport height)
- Desktop: `max-h-72` (288px fijo)

---

### 11. Sistema Z-Index — Jerarquía Centralizada

**Se implementó un sistema centralizado de z-index para solucionar conflictos de stacking context.**

#### El Problema (v0.1.x)
```html
<!-- Select options dentro de modal salían DEBAJO del modal -->
<pdm-dialog [open]="true">
  <pdm-select [options]="options"></pdm-select>
  <!-- Options aparecían z-10, modal z-50 → options invisibles -->
</pdm-dialog>

<!-- Tooltip dentro de dropdown salía debajo -->
<pdm-dropdown-menu>
  <button pdmTooltip="Help">Item</button>
  <!-- Tooltip z-50, dropdown z-50 → conflicto -->
</pdm-dropdown-menu>
```

#### La Solución (v0.2.0)

**Jerarquía Z-Index:**
```typescript
import { Z_INDEX } from 'pdm-ui-kit';

// Escala completa:
Z_INDEX.base          // z-0   - Contenido normal
Z_INDEX.dropdown      // z-10  - Selects base, combobox
Z_INDEX.sticky        // z-20  - Headers fijos
Z_INDEX.overlay       // z-30  - Popovers base
Z_INDEX.drawerBackdrop // z-40 - Backdrop de sidebar drawer
Z_INDEX.drawer        // z-50  - Sidebar drawer, sheets
Z_INDEX.modalBackdrop // z-50  - Backdrop de modals
Z_INDEX.modal         // z-[60] - Dialogs, alert-dialogs
Z_INDEX.popover       // z-[70] - Tooltips, dropdowns, selects options
Z_INDEX.toast         // z-[100] - Notificaciones globales
```

**CRÍTICO**: Todos los popovers (select options, tooltips, dropdowns) usan `z-[70]`, que es MAYOR que modals (`z-[60]`). Esto permite que funcionen **dentro** de modals.

#### Componentes Actualizados

**Automático (no requiere cambios):**
- ✅ Select options ahora aparecen sobre modals
- ✅ Dropdown menu options sobre modals
- ✅ Tooltips sobre dropdowns y modals
- ✅ Context menus sobre todo excepto toast
- ✅ Hover cards sobre modals
- ✅ Dialog content sobre su backdrop
- ✅ Sheet content sobre su backdrop
- ✅ Alert dialog content sobre su backdrop

**Uso en componentes custom:**
```typescript
import { Z_INDEX } from 'pdm-ui-kit';

@Component({
  template: `
    <div [class]="Z_INDEX.popover">
      <!-- Tu contenido overlay -->
    </div>
  `
})
export class MyComponent {
  Z_INDEX = Z_INDEX; // Exponer al template
}
```

**Debugging z-index issues:**
```typescript
import { logZIndexStack } from 'pdm-ui-kit';

// En browser console o component:
const element = document.querySelector('.my-overlay');
logZIndexStack(element); // Muestra tabla con z-index de ancestors
```

---

## 🔧 Migration Steps

### Step 1: Actualizar pdm-table

Si usabas `reorderRows="true"`:

```diff
- <pdm-table [reorderRows]="true" (rowOrderChange)="onOrderChange($event)">
+ <pdm-draggable-table [reorderRows]="true" (rowOrderChange)="onOrderChange($event)">
```

Si NO usabas drag & drop, solo agregá estrategia responsive:

```diff
- <pdm-table variant="interactive">
+ <pdm-table variant="interactive" responsiveStrategy="scroll">
```

### Step 2: Migrar pdm-data-table a Genérico

1. **Define tus columnas:**

```typescript
import { PdmDataTableColumn } from 'pdm-ui-kit';

// Tu interfaz de datos
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

// Define columnas
columns: PdmDataTableColumn<Product>[] = [
  { key: 'name', label: 'Product Name', sortable: true },
  { key: 'price', label: 'Price', align: 'right', render: (val) => `$${val}` },
  { key: 'category', label: 'Category', hideOnMobile: true },
  { key: 'stock', label: 'Stock', align: 'center' }
];
```

2. **Actualiza el template:**

```diff
- <pdm-data-table [rows]="products"></pdm-data-table>
+ <pdm-data-table 
+   [columns]="columns"
+   [rows]="products"
+   [selectable]="true"
+   responsiveStrategy="scroll">
+ </pdm-data-table>
```

3. **Actualiza event handlers:**

```diff
- (selectionChange)="onSelect($event)"  // $event: { id: string; selected: boolean }
+ (selectionChange)="onSelect($event)"  // $event: { row: T; selected: boolean }

- (rowAction)="onAction($event)"        // $event: string (id)
+ (rowAction)="onAction($event)"        // $event: T (row completo)
```

### Step 3: Migrar pdm-card variant="login"

Si usabas `<pdm-card variant="login">`, reemplazar con composición de primitivos:

**1. Crear el formulario en tu componente:**

```typescript
import { FormBuilder, Validators } from '@angular/forms';

export class YourComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {}

  onLogin() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      // Tu lógica de autenticación
    }
  }
}
```

**2. Actualizar el template:**

```diff
- <pdm-card 
-   variant="login"
-   title="Login"
-   (primaryAction)="onLogin($event)">
- </pdm-card>

+ <pdm-card>
+   <div pdmCardHeader>
+     <h3 class="text-lg font-semibold">Login</h3>
+   </div>
+   <div pdmCardContent>
+     <form [formGroup]="loginForm" class="flex flex-col gap-4">
+       <pdm-field>
+         <pdm-label>Email</pdm-label>
+         <pdm-input type="email" formControlName="email" />
+       </pdm-field>
+       <pdm-field>
+         <pdm-label>Password</pdm-label>
+         <pdm-input-password formControlName="password" />
+       </pdm-field>
+     </form>
+   </div>
+   <div pdmCardFooter>
+     <pdm-button [fullWidth]="true" (click)="onLogin()">Login</pdm-button>
+   </div>
+ </pdm-card>
```

**3. Importar módulos necesarios:**

```typescript
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    ReactiveFormsModule,
    PdmUiKitModule
  ]
})
```

### Step 4 (Opcional): Usar Utilities

Si creaste tus propios componentes con overflow, podés usar las utilities:

```typescript
import { overflowResponsive, responsive } from 'pdm-ui-kit';

// Clases responsive para overflow
classes = overflowResponsive('x');  // 'overflow-x-auto'

// O crear clases responsive dinámicas
displayClasses = responsive({ 
  default: 'block', 
  sm: 'flex', 
  lg: 'grid' 
}); // 'block sm:flex lg:grid'
```

### Step 5: Actualizar pdm-sidebar (si lo usás)

Si tu sidebar es un **overlay mobile**:

```diff
- <pdm-sidebar [collapsed]="collapsed">
+ <pdm-sidebar [open]="sidebarOpen" (openChange)="sidebarOpen = $event">
    <nav>Menu items</nav>
  </pdm-sidebar>
```

Si necesitás sidebar **persistente** en todas las pantallas:

```html
<pdm-sidebar mobileMode="sidebar" [collapsed]="collapsed">
  <nav>Menu items</nav>
</pdm-sidebar>
```

### Step 6: Verificar Navigation Menu (si tenés muchos items)

Si tu navigation menu tiene 5+ items:

```diff
- <pdm-navigation-menu [items]="navItems"></pdm-navigation-menu>
+ <pdm-navigation-menu [items]="navItems"></pdm-navigation-menu>
  <!-- Scroll horizontal automático ahora -->
```

O usa modo compact:

```html
<pdm-navigation-menu [items]="navItems" mobileMode="compact"></pdm-navigation-menu>
```

---

## ⚠️ Breaking Changes

### 1. `pdm-table`
- ❌ `@Input() reorderRows` removido
- ❌ `@Input() dragHandleSelector` removido
- ❌ `@Output() rowOrderChange` removido
- ➡️ **Solución:** Usar `pdm-draggable-table` en su lugar

### 2. `pdm-data-table`
- ⚠️ `PdmDataTableRow` deprecado (aún funciona)
- ⚠️ Labels hardcodeados (`statusLabel`, `emailLabel`, `amountLabel`) deprecados
- ➡️ **Solución:** Migrar a configuración de columnas

### 3. Eventos de `pdm-data-table`
- `rowAction` ahora emite el row completo (`T`) en lugar de `string` (id)
- `selectionChange` ahora emite `{ row: T; selected: boolean }` en lugar de `{ id: string; selected: boolean }`

### 4. `pdm-card`
- ❌ `variant="login"` eliminado completamente
- ❌ Todos los inputs relacionados (`emailLabel`, `passwordLabel`, etc.) removidos
- ❌ Eventos `primaryAction` y `secondaryAction` removidos
- ➡️ **Solución:** Componer con primitivos (`pdm-input`, `pdm-button`, `ReactiveFormsModule`)

### 5. `pdm-sidebar`
- ⚠️ `collapsed` ahora solo aplica en `mobileMode="sidebar"`
- ➕ Nuevo: `mobileMode` input (`'drawer'` | `'sidebar'`)
- ➕ Nuevo: `open` input y `openChange` output para drawer mode
- ➡️ **Backward compatible:** Si no pasás `mobileMode`, usa drawer mode (overlay mobile)

---

## 💡 Best Practices

### 1. Elegir Estrategia Responsive

```typescript
// Tablas con muchas columnas → scroll
responsiveStrategy="scroll"

// Tablas con contenido largo → wrap
responsiveStrategy="wrap"

// Tablas con pocas columnas importantes → collapse
responsiveStrategy="collapse"  // Marca columnas con hideOnMobile
```

### 2. Usar hideOnMobile para Columnas Opcionales

```typescript
columns: PdmDataTableColumn<User>[] = [
  { key: 'name', label: 'Name' },                    // Siempre visible
  { key: 'email', label: 'Email' },                  // Siempre visible
  { key: 'phone', label: 'Phone', hideOnMobile: true },  // Oculto en mobile
  { key: 'address', label: 'Address', hideOnMobile: true }  // Oculto en mobile
];
```

### 3. Filtrado Custom

```typescript
// Filtrado por múltiples campos
filterFn = (user: User, query: string) => {
  const q = query.toLowerCase();
  return user.name.toLowerCase().includes(q) 
      || user.email.toLowerCase().includes(q)
      || user.role.toLowerCase().includes(q);
};
```

```html
<pdm-data-table [filterFn]="filterFn" ...></pdm-data-table>
```

### 4. Renderizado Custom

```typescript
columns: PdmDataTableColumn<Order>[] = [
  { 
    key: 'status', 
    label: 'Status',
    render: (status) => {
      const map = { pending: '⏳ Pending', completed: '✅ Complete', cancelled: '❌ Cancelled' };
      return map[status] || status;
    }
  },
  {
    key: 'amount',
    label: 'Amount',
    align: 'right',
    render: (val) => new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(val)
  }
];
```

---

## 📚 API Reference

### Responsive Strategies

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| `scroll` | Scroll horizontal en mobile | Tablas con muchas columnas |
| `wrap` | Contenido hace wrap | Tablas con texto largo |
| `stack` | Filas se convierten en cards (requiere data-label) | Tablas con pocas filas |
| `collapse` | Oculta columnas marcadas con hideOnMobile | Tablas con columnas opcionales |

### Breakpoints

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

## 🎯 Dialog, Drawer & Sheet — Responsive Improvements

### `pdm-dialog` — Nuevos tamaños y modo responsive

**Nuevas opciones de tamaño:**
- `responsive` (NEW, recomendado): fullscreen en mobile, modal centrado en desktop
- `sm`, `md`, `lg`, `xl`: tamaños fijos con mejor responsive
- `desktop`, `mobile`, `mobile-fullscreen`: legacy, deprecados

```html
<!-- Modo responsive (recomendado) -->
<pdm-dialog [open]="isOpen" size="responsive" title="Settings">
  <p>Fullscreen en mobile, modal en desktop</p>
</pdm-dialog>

<!-- Tamaño fijo responsive -->
<pdm-dialog [open]="isOpen" size="lg" title="Large Dialog">
  <p>Fullscreen en mobile, 640px max en desktop</p>
</pdm-dialog>
```

**Mejoras:**
- Footer con botones full-width en mobile, inline en desktop
- Header con padding responsive
- Backdrop con blur
- Overflow mejor manejado

### `pdm-drawer` — Ahora genérico con posicionamiento

**BREAKING CHANGE**: `variant` deprecado, usar `position` + ng-content

**Antes (legacy, aún funciona):**
```html
<pdm-drawer [open]="isOpen" variant="drawer" title="Goal">
  <!-- Contenido hardcodeado específico -->
</pdm-drawer>
```

**Ahora (recomendado):**
```html
<pdm-drawer [open]="isOpen" position="bottom" size="md" title="Settings">
  <!-- Tu contenido aquí -->
  <div class="space-y-4">
    <p>Custom content</p>
    <button>Action</button>
  </div>
</pdm-drawer>
```

**Opciones:**
- `position`: `bottom` (default), `left`, `right`, `top`
- `size`: `sm`, `md` (default), `lg`, `xl`, `full`
- `showHandle`: true (mostrar línea de drag, solo `bottom`)
- `showCloseButton`: true

```html
<!-- Side panel desde la derecha -->
<pdm-drawer [open]="isOpen" position="right" size="lg">
  <h3>Navigation</h3>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</pdm-drawer>

<!-- Bottom sheet sin handle -->
<pdm-drawer [open]="isOpen" position="bottom" [showHandle]="false">
  <p>Content</p>
</pdm-drawer>
```

### `pdm-sheet` — Tamaños configurables

**Antes:**
```html
<pdm-sheet [open]="isOpen" side="right">
  <!-- 360px fijo -->
</pdm-sheet>
```

**Ahora:**
```html
<pdm-sheet [open]="isOpen" side="right" size="lg">
  <!-- 500px en desktop, responsive en mobile -->
</pdm-sheet>
```

**Opciones de tamaño:**
- `sm`: 320px (side) / 40vh (top/bottom)
- `md`: 400px (side) / 50vh (top/bottom) (default)
- `lg`: 500px (side) / 66vh (top/bottom)
- `xl`: 640px (side) / 80vh (top/bottom)
- `full`: 100%

---

## 🐛 Known Issues & Workarounds

### Issue 1: Templates en Columnas

Si usás `cellTemplate` en columnas, asegurate de declarar el template en el componente padre:

```html
<pdm-data-table [columns]="columns" [rows]="users">
</pdm-data-table>

<ng-template #statusTemplate let-user let-value="value">
  <span [class]="getStatusClass(value)">{{ value }}</span>
</ng-template>
```

```typescript
@ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

ngAfterViewInit() {
  this.columns[0].cellTemplate = this.statusTemplate;
}
```

---

## 📞 Support

Para reportar issues o sugerir mejoras:
- GitHub Issues: [github.com/corelusa/pdm-ui-kit/issues](https://github.com/corelusa/pdm-ui-kit/issues)
- Email: dev@corelusa.com

---

## 🎉 Summary

### Componentes mejorados (10):
- ✅ **Tablas**: responsive strategies, drag & drop separado, genérico con columnas
- ✅ **Dialog**: modo responsive (fullscreen mobile, modal desktop)
- ✅ **Drawer**: posicionamiento configurable, contenido genérico
- ✅ **Sheet**: tamaños responsive
- ✅ **Card**: primitivo UI puro (login variant eliminado)
- ✅ **Breadcrumb**: overflow-x-auto + collapse mobile
- ✅ **Sidebar**: mobile drawer mode con overlay + backdrop
- ✅ **Navigation Menu**: scroll horizontal responsive
- ✅ **Tabs**: overflow-x-auto con scroll
- ✅ **Command**: max-height viewport-relative

### Mejoras responsive (6):
- ✅ **Pagination**: select width responsive
- ✅ **Calendar**: dropdowns responsive
- ✅ **Context-menu**: min-width responsive
- ✅ **Menubar**: submenu responsive
- ✅ **Tabs**: scroll horizontal + padding responsive
- ✅ **Command**: height viewport-aware

### Arquitectura:
- ✅ Sistema de utilities centralizado (`responsive.ts`)
- ✅ **Sistema Z-Index centralizado (`z-index.ts`)** — soluciona stacking context issues
- ✅ Primitivos UI puros sin lógica de negocio
- ✅ Backward compatibility donde sea posible
- ✅ Mobile-first approach en todos los componentes

### Z-Index Hierarchy (NUEVO):
- ✅ **13 componentes overlay** con z-index correcto
- ✅ **Select options sobre modals** — z-[70] > z-[60]
- ✅ **Tooltips sobre dropdowns** — jerarquía clara
- ✅ **Debugging helper** — `logZIndexStack()` para troubleshooting
