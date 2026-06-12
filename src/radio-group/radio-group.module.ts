import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmRadioGroupComponent } from './radio-group.component';

const COMPONENTS = [
  PdmRadioGroupComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmRadioGroupModule {}
