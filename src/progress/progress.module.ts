import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmProgressComponent } from './progress.component';

const COMPONENTS = [
  PdmProgressComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmProgressModule {}
