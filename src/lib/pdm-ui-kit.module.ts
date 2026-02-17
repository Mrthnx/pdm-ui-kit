import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmAccordionComponent } from './components/accordion/accordion.component';
import { PdmAlertComponent } from './components/alert/alert.component';
import { PdmAlertDialogComponent } from './components/alert-dialog/alert-dialog.component';
import { PdmAspectRatioComponent } from './components/aspect-ratio/aspect-ratio.component';
import { PdmAvatarComponent } from './components/avatar/avatar.component';
import { PdmBadgeComponent } from './components/badge/badge.component';
import { PdmBreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { PdmButtonGroupComponent } from './components/button-group/button-group.component';
import { PdmButtonComponent } from './components/button/button.component';
import { PdmCalendarComponent } from './components/calendar/calendar.component';
import { PdmCarouselComponent } from './components/carousel/carousel.component';
import { PdmCardComponent } from './components/card/card.component';
import { PdmChartComponent } from './components/chart/chart.component';
import { PdmCheckboxComponent } from './components/checkbox/checkbox.component';
import { PdmCollapsibleComponent } from './components/collapsible/collapsible.component';
import { PdmComboboxComponent } from './components/combobox/combobox.component';
import { PdmCommandComponent } from './components/command/command.component';
import { PdmContextMenuComponent } from './components/context-menu/context-menu.component';
import { PdmDataTableComponent } from './components/data-table/data-table.component';
import { PdmDatePickerComponent } from './components/date-picker/date-picker.component';
import { PdmDialogComponent } from './components/dialog/dialog.component';
import { PdmDropdownMenuComponent } from './components/dropdown-menu/dropdown-menu.component';
import { PdmDrawerComponent } from './components/drawer/drawer.component';
import { PdmEmptyComponent } from './components/empty/empty.component';
import { PdmFieldComponent } from './components/field/field.component';
import { PdmHoverCardComponent } from './components/hover-card/hover-card.component';
import { PdmIconComponent } from './components/icon/icon.component';
import { PdmItemComponent } from './components/item/item.component';
import { PdmInputComponent } from './components/input/input.component';
import { PdmInputPasswordComponent } from './components/input-password/input-password.component';
import { PdmInputGroupComponent } from './components/input-group/input-group.component';
import { PdmInputOtpComponent } from './components/input-otp/input-otp.component';
import { PdmKbdComponent } from './components/kbd/kbd.component';
import { PdmLabelComponent } from './components/label/label.component';
import { PdmMenubarComponent } from './components/menubar/menubar.component';
import { PdmNativeSelectComponent } from './components/native-select/native-select.component';
import { PdmNavigationMenuComponent } from './components/navigation-menu/navigation-menu.component';
import { PdmPaginationComponent } from './components/pagination/pagination.component';
import { PdmPopoverComponent } from './components/popover/popover.component';
import { PdmProgressComponent } from './components/progress/progress.component';
import { PdmRadioGroupComponent } from './components/radio-group/radio-group.component';
import { PdmScrollAreaComponent } from './components/scroll-area/scroll-area.component';
import { PdmSelectComponent } from './components/select/select.component';
import { PdmSeparatorComponent } from './components/separator/separator.component';
import { PdmSheetComponent } from './components/sheet/sheet.component';
import { PdmSidebarComponent } from './components/sidebar/sidebar.component';
import { PdmSkeletonComponent } from './components/skeleton/skeleton.component';
import { PdmSliderComponent } from './components/slider/slider.component';
import { PdmSonnerComponent } from './components/sonner/sonner.component';
import { PdmSpinnerComponent } from './components/spinner/spinner.component';
import { PdmSwitchComponent } from './components/switch/switch.component';
import { PdmTableComponent } from './components/table/table.component';
import { PdmTabsComponent } from './components/tabs/tabs.component';
import { PdmTextareaComponent } from './components/textarea/textarea.component';
import { PdmToggleComponent } from './components/toggle/toggle.component';
import { PdmToggleGroupComponent } from './components/toggle-group/toggle-group.component';
import { PdmTooltipComponent } from './components/tooltip/tooltip.component';

const COMPONENTS = [
  PdmAccordionComponent,
  PdmAlertComponent,
  PdmAlertDialogComponent,
  PdmAspectRatioComponent,
  PdmAvatarComponent,
  PdmBadgeComponent,
  PdmBreadcrumbComponent,
  PdmButtonGroupComponent,
  PdmButtonComponent,
  PdmCalendarComponent,
  PdmCarouselComponent,
  PdmCardComponent,
  PdmChartComponent,
  PdmCheckboxComponent,
  PdmCollapsibleComponent,
  PdmComboboxComponent,
  PdmCommandComponent,
  PdmContextMenuComponent,
  PdmDataTableComponent,
  PdmDatePickerComponent,
  PdmDialogComponent,
  PdmDropdownMenuComponent,
  PdmDrawerComponent,
  PdmEmptyComponent,
  PdmFieldComponent,
  PdmHoverCardComponent,
  PdmIconComponent,
  PdmItemComponent,
  PdmInputComponent,
  PdmInputPasswordComponent,
  PdmInputGroupComponent,
  PdmInputOtpComponent,
  PdmKbdComponent,
  PdmLabelComponent,
  PdmMenubarComponent,
  PdmNativeSelectComponent,
  PdmNavigationMenuComponent,
  PdmPaginationComponent,
  PdmPopoverComponent,
  PdmProgressComponent,
  PdmRadioGroupComponent,
  PdmScrollAreaComponent,
  PdmSelectComponent,
  PdmSeparatorComponent,
  PdmSheetComponent,
  PdmSidebarComponent,
  PdmSkeletonComponent,
  PdmSliderComponent,
  PdmSonnerComponent,
  PdmSpinnerComponent,
  PdmSwitchComponent,
  PdmTableComponent,
  PdmTabsComponent,
  PdmTextareaComponent,
  PdmToggleComponent,
  PdmToggleGroupComponent,
  PdmTooltipComponent
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmUiKitModule {}
