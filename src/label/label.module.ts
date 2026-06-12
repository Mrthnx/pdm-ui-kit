import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmLabelComponent } from './label.component';

const COMPONENTS = [
  PdmLabelComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmLabelModule {}
