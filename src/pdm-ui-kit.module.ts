import { NgModule } from '@angular/core';
import { PdmAccordionModule } from './accordion/accordion.module';
import { PdmAlertModule } from './alert/alert.module';
import { PdmAspectRatioModule } from './aspect-ratio/aspect-ratio.module';
import { PdmAvatarModule } from './avatar/avatar.module';
import { PdmBadgeModule } from './badge/badge.module';
import { PdmBreadcrumbModule } from './breadcrumb/breadcrumb.module';
import { PdmButtonModule } from './button/button.module';
import { PdmCalendarModule } from './calendar/calendar.module';
import { PdmCardModule } from './card/card.module';
import { PdmCarouselModule } from './carousel/carousel.module';
import { PdmChartModule } from './chart/chart.module';
import { PdmCheckboxModule } from './checkbox/checkbox.module';
import { PdmCollapsibleModule } from './collapsible/collapsible.module';
import { PdmComboboxModule } from './combobox/combobox.module';
import { PdmCommandModule } from './command/command.module';
import { PdmContextMenuModule } from './context-menu/context-menu.module';
import { PdmDataTableModule } from './data-table/data-table.module';
import { PdmDialogModule } from './dialog/dialog.module';
import { PdmDrawerModule } from './drawer/drawer.module';
import { PdmDropdownMenuModule } from './dropdown-menu/dropdown-menu.module';
import { PdmEmptyModule } from './empty/empty.module';
import { PdmFieldModule } from './field/field.module';
import { PdmHoverCardModule } from './hover-card/hover-card.module';
import { PdmIconModule } from './icon/icon.module';
import { PdmInputModule } from './input/input.module';
import { PdmItemModule } from './item/item.module';
import { PdmKbdModule } from './kbd/kbd.module';
import { PdmLabelModule } from './label/label.module';
import { PdmMenubarModule } from './menubar/menubar.module';
import { PdmNativeSelectModule } from './native-select/native-select.module';
import { PdmNavigationMenuModule } from './navigation-menu/navigation-menu.module';
import { PdmPaginationModule } from './pagination/pagination.module';
import { PdmPopoverModule } from './popover/popover.module';
import { PdmProgressModule } from './progress/progress.module';
import { PdmRadioGroupModule } from './radio-group/radio-group.module';
import { PdmScrollAreaModule } from './scroll-area/scroll-area.module';
import { PdmSelectModule } from './select/select.module';
import { PdmSeparatorModule } from './separator/separator.module';
import { PdmSidebarModule } from './sidebar/sidebar.module';
import { PdmSkeletonModule } from './skeleton/skeleton.module';
import { PdmSliderModule } from './slider/slider.module';
import { PdmSonnerModule } from './sonner/sonner.module';
import { PdmSpinnerModule } from './spinner/spinner.module';
import { PdmSwitchModule } from './switch/switch.module';
import { PdmTabsModule } from './tabs/tabs.module';
import { PdmToggleModule } from './toggle/toggle.module';
import { PdmTooltipModule } from './tooltip/tooltip.module';
import { PdmOutsideClickModule } from './overlay/pdm-outside-click.module';

const MODULES = [
  PdmAccordionModule,
  PdmAlertModule,
  PdmAspectRatioModule,
  PdmAvatarModule,
  PdmBadgeModule,
  PdmBreadcrumbModule,
  PdmButtonModule,
  PdmCalendarModule,
  PdmCardModule,
  PdmCarouselModule,
  PdmChartModule,
  PdmCheckboxModule,
  PdmCollapsibleModule,
  PdmComboboxModule,
  PdmCommandModule,
  PdmContextMenuModule,
  PdmDataTableModule,
  PdmDialogModule,
  PdmDrawerModule,
  PdmDropdownMenuModule,
  PdmEmptyModule,
  PdmFieldModule,
  PdmHoverCardModule,
  PdmIconModule,
  PdmInputModule,
  PdmItemModule,
  PdmKbdModule,
  PdmLabelModule,
  PdmMenubarModule,
  PdmNativeSelectModule,
  PdmNavigationMenuModule,
  PdmPaginationModule,
  PdmPopoverModule,
  PdmProgressModule,
  PdmRadioGroupModule,
  PdmScrollAreaModule,
  PdmSelectModule,
  PdmSeparatorModule,
  PdmSidebarModule,
  PdmSkeletonModule,
  PdmSliderModule,
  PdmSonnerModule,
  PdmSpinnerModule,
  PdmSwitchModule,
  PdmTabsModule,
  PdmToggleModule,
  PdmTooltipModule,
  PdmOutsideClickModule,
];

/**
 * Umbrella module that imports and re-exports all PDM UI Kit feature modules.
 *
 * For tree-shakeable builds, prefer importing individual feature modules:
 *   import { PdmButtonModule } from 'pdm-ui-kit/button';
 */
@NgModule({
  imports: MODULES,
  exports: MODULES
})
export class PdmUiKitModule {}
