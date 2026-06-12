import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmSpinnerComponent } from './spinner.component';

const COMPONENTS = [
  PdmSpinnerComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmSpinnerModule {}
