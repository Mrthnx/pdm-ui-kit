import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmCarouselComponent } from './carousel.component';

const COMPONENTS = [
  PdmCarouselComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmCarouselModule {}
