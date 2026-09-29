import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PdmIconModule } from 'pdm-ui-kit/src/icon';
import { PdmDropdownMenuComponent } from './dropdown-menu.component';

const COMPONENTS = [
  PdmDropdownMenuComponent,
];

@NgModule({
  imports: [CommonModule, OverlayModule, PdmIconModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmDropdownMenuModule {}
