# PDM UI Kit

Librería de componentes UI para Angular (13, 14 y 15), construida sobre patrones visuales del **Figma de shadcn/ui** y adaptada para el ecosistema de Corelusa.

## ✨ What's New in v0.2.0

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

- Angular: 13, 14, 15
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

Y más, todos exportados desde `PdmUiKitModule`.

## Documentación

- **[Migration Guide](./MIGRATION.md)** — Guía de migración desde v0.1.x
- **[API Reference](./docs/API.md)** — Documentación completa de todos los componentes (próximamente)

## Changelog

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
