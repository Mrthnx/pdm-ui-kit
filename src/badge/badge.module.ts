import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmBadgeComponent } from './badge.component';

const COMPONENTS = [
  PdmBadgeComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmBadgeModule {}
