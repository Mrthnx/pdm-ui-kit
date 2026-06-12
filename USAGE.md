# Guía de uso — pdm-ui-kit v1.0

## Imports granulares (recomendado)

Importá solo los módulos que usás. El bundler carga únicamente el bundle de ese feature (~3–50KB) en vez del barrel completo (~526KB).

```typescript
// app.module.ts (o cualquier feature module)
import { PdmButtonModule }      from 'pdm-ui-kit/button';
import { PdmInputModule }       from 'pdm-ui-kit/input';
import { PdmCalendarModule }    from 'pdm-ui-kit/calendar';
import { PdmDialogModule }      from 'pdm-ui-kit/dialog';
import { PdmSelectModule }      from 'pdm-ui-kit/select';

@NgModule({
  imports: [
    PdmButtonModule,
    PdmInputModule,
    PdmCalendarModule,
    PdmDialogModule,
    PdmSelectModule,
  ]
})
export class MyFeatureModule {}
```

---

## Referencia de sub-paths

| Import                                    | Componentes / Directivas incluidos                                              |
|-------------------------------------------|---------------------------------------------------------------------------------|
| `pdm-ui-kit/accordion`                    | `PdmAccordionModule`, `PdmAccordionComponent`                                  |
| `pdm-ui-kit/alert`                        | `PdmAlertModule`, `PdmAlertComponent`, `PdmAlertDialogComponent`               |
| `pdm-ui-kit/aspect-ratio`                 | `PdmAspectRatioModule`, `PdmAspectRatioComponent`                              |
| `pdm-ui-kit/avatar`                       | `PdmAvatarModule`, `PdmAvatarComponent`                                        |
| `pdm-ui-kit/badge`                        | `PdmBadgeModule`, `PdmBadgeComponent`                                          |
| `pdm-ui-kit/breadcrumb`                   | `PdmBreadcrumbModule`, `PdmBreadcrumbComponent`                                |
| `pdm-ui-kit/button`                       | `PdmButtonModule`, `PdmButtonComponent`, `PdmButtonGroupComponent`             |
| `pdm-ui-kit/calendar`                     | `PdmCalendarModule`, `PdmCalendarComponent`, `PdmDatePickerComponent`          |
| `pdm-ui-kit/card`                         | `PdmCardModule`, `PdmCardComponent`                                            |
| `pdm-ui-kit/carousel`                     | `PdmCarouselModule`, `PdmCarouselComponent`                                    |
| `pdm-ui-kit/chart`                        | `PdmChartModule`, `PdmChartComponent`                                          |
| `pdm-ui-kit/checkbox`                     | `PdmCheckboxModule`, `PdmCheckboxComponent`                                    |
| `pdm-ui-kit/collapsible`                  | `PdmCollapsibleModule`, `PdmCollapsibleComponent`                              |
| `pdm-ui-kit/combobox`                     | `PdmComboboxModule`, `PdmComboboxComponent`                                    |
| `pdm-ui-kit/command`                      | `PdmCommandModule`, `PdmCommandComponent`                                      |
| `pdm-ui-kit/context-menu`                 | `PdmContextMenuModule`, `PdmContextMenuComponent`                              |
| `pdm-ui-kit/data-table`                   | `PdmDataTableModule`, `PdmDataTableComponent`, `PdmDraggableTableComponent`, `PdmTableComponent` |
| `pdm-ui-kit/dialog`                       | `PdmDialogModule`, `PdmDialogComponent`                                        |
| `pdm-ui-kit/drawer`                       | `PdmDrawerModule`, `PdmDrawerComponent`, `PdmSheetComponent`                   |
| `pdm-ui-kit/dropdown-menu`                | `PdmDropdownMenuModule`, `PdmDropdownMenuComponent`                            |
| `pdm-ui-kit/empty`                        | `PdmEmptyModule`, `PdmEmptyComponent`                                          |
| `pdm-ui-kit/field`                        | `PdmFieldModule`, `PdmFieldComponent`                                          |
| `pdm-ui-kit/hover-card`                   | `PdmHoverCardModule`, `PdmHoverCardComponent`                                  |
| `pdm-ui-kit/icon`                         | `PdmIconModule`, `PdmIconComponent`                                            |
| `pdm-ui-kit/input`                        | `PdmInputModule`, `PdmInputComponent`, `PdmInputGroupComponent`, `PdmInputOtpComponent`, `PdmInputPasswordComponent`, `PdmTextareaComponent` |
| `pdm-ui-kit/item`                         | `PdmItemModule`, `PdmItemComponent`                                            |
| `pdm-ui-kit/kbd`                          | `PdmKbdModule`, `PdmKbdComponent`                                              |
| `pdm-ui-kit/label`                        | `PdmLabelModule`, `PdmLabelComponent`                                          |
| `pdm-ui-kit/menubar`                      | `PdmMenubarModule`, `PdmMenubarComponent`                                      |
| `pdm-ui-kit/native-select`                | `PdmNativeSelectModule`, `PdmNativeSelectComponent`                            |
| `pdm-ui-kit/navigation-menu`              | `PdmNavigationMenuModule`, `PdmNavigationMenuComponent`                        |
| `pdm-ui-kit/pagination`                   | `PdmPaginationModule`, `PdmPaginationComponent`                                |
| `pdm-ui-kit/popover`                      | `PdmPopoverModule`, `PdmPopoverComponent`                                      |
| `pdm-ui-kit/progress`                     | `PdmProgressModule`, `PdmProgressComponent`                                    |
| `pdm-ui-kit/radio-group`                  | `PdmRadioGroupModule`, `PdmRadioGroupComponent`                                |
| `pdm-ui-kit/scroll-area`                  | `PdmScrollAreaModule`, `PdmScrollAreaComponent`                                |
| `pdm-ui-kit/select`                       | `PdmSelectModule`, `PdmSelectComponent`, `PdmSelectOptionDirective`            |
| `pdm-ui-kit/separator`                    | `PdmSeparatorModule`, `PdmSeparatorComponent`                                  |
| `pdm-ui-kit/sidebar`                      | `PdmSidebarModule`, `PdmSidebarComponent`                                      |
| `pdm-ui-kit/skeleton`                     | `PdmSkeletonModule`, `PdmSkeletonComponent`                                    |
| `pdm-ui-kit/slider`                       | `PdmSliderModule`, `PdmSliderComponent`                                        |
| `pdm-ui-kit/sonner`                       | `PdmSonnerModule`, `PdmSonnerComponent`                                        |
| `pdm-ui-kit/spinner`                      | `PdmSpinnerModule`, `PdmSpinnerComponent`                                      |
| `pdm-ui-kit/switch`                       | `PdmSwitchModule`, `PdmSwitchComponent`                                        |
| `pdm-ui-kit/tabs`                         | `PdmTabsModule`, `PdmTabsComponent`                                            |
| `pdm-ui-kit/toggle`                       | `PdmToggleModule`, `PdmToggleComponent`, `PdmToggleGroupComponent`             |
| `pdm-ui-kit/tooltip`                      | `PdmTooltipModule`, `PdmTooltipComponent`                                      |
| `pdm-ui-kit/overlay`                      | `PdmOutsideClickModule`, `PdmOutsideClickDirective`, utilidades overlay        |

---

## Import del barrel completo (backward compatible)

Si migrás de a poco o usás muchos componentes en el mismo módulo, podés seguir usando el barrel. El tree-shaking funciona peor pero no rompe nada:

```typescript
import { PdmUiKitModule } from 'pdm-ui-kit';

@NgModule({
  imports: [PdmUiKitModule]
})
```

---

## Tipos y utilidades

```typescript
// Tipos de un componente
import type { PdmButtonVariant } from 'pdm-ui-kit/button';
import type { PdmCalendarRange }  from 'pdm-ui-kit/calendar';
import type { PdmIconName }       from 'pdm-ui-kit/icon';

// Directiva outside-click standalone
import { PdmOutsideClickModule } from 'pdm-ui-kit/overlay';
```

---

## Ejemplo real: página de formulario

```typescript
// form-page.module.ts
import { NgModule }             from '@angular/core';
import { CommonModule }         from '@angular/common';
import { PdmButtonModule }      from 'pdm-ui-kit/button';
import { PdmInputModule }       from 'pdm-ui-kit/input';
import { PdmSelectModule }      from 'pdm-ui-kit/select';
import { PdmLabelModule }       from 'pdm-ui-kit/label';
import { PdmCalendarModule }    from 'pdm-ui-kit/calendar';
import { FormPageComponent }    from './form-page.component';

@NgModule({
  declarations: [FormPageComponent],
  imports: [
    CommonModule,
    PdmButtonModule,    // ~21KB
    PdmInputModule,     // ~39KB  (input + input-group + otp + password + textarea)
    PdmSelectModule,    // ~17KB
    PdmLabelModule,     // ~3KB
    PdmCalendarModule,  // ~49KB  (calendar + date-picker)
  ]
})
export class FormPageModule {}
// Total: ~129KB vs 526KB del barrel completo
```
