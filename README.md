# PDM UI Kit

Librería de componentes UI para Angular (13, 14 y 15), construida sobre patrones visuales del **Figma de shadcn/ui** y adaptada para el ecosistema de Corelusa.

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

## Theming

Los componentes leen los tokens CSS del proyecto consumidor. Define tus variables globales para aplicar tu tema (light/dark o custom branding) sin modificar el kit.

## Componentes disponibles

Incluye componentes como:

- `pdm-button`, `pdm-input`, `pdm-textarea`, `pdm-select`
- `pdm-alert`, `pdm-badge`, `pdm-card`, `pdm-dialog`
- `pdm-tabs`, `pdm-table`, `pdm-data-table`, `pdm-chart`
- `pdm-tooltip`, `pdm-popover`, `pdm-dropdown-menu`, `pdm-sidebar`

Y más, todos exportados desde `PdmUiKitModule`.
