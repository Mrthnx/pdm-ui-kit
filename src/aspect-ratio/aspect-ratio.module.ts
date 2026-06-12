import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmAspectRatioComponent } from './aspect-ratio.component';

const COMPONENTS = [
  PdmAspectRatioComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmAspectRatioModule {}
