import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmScrollAreaComponent } from './scroll-area.component';

const COMPONENTS = [
  PdmScrollAreaComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmScrollAreaModule {}
