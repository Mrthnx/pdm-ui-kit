import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PdmDropdownMenuComponent } from './dropdown-menu.component';

const COMPONENTS = [
  PdmDropdownMenuComponent,
];

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmDropdownMenuModule {}
