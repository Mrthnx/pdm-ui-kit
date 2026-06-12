import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmCardComponent } from './card.component';

const COMPONENTS = [
  PdmCardComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmCardModule {}
