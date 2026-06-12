import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmAccordionComponent } from './accordion.component';

const COMPONENTS = [
  PdmAccordionComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmAccordionModule {}
