import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmFieldComponent } from './field.component';

const COMPONENTS = [
  PdmFieldComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmFieldModule {}
