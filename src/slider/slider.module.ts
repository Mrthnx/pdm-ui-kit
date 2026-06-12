import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmSliderComponent } from './slider.component';

const COMPONENTS = [
  PdmSliderComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmSliderModule {}
