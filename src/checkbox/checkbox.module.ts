import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmCheckboxComponent } from './checkbox.component';

const COMPONENTS = [
  PdmCheckboxComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmCheckboxModule {}
