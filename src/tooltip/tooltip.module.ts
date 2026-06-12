import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PdmTooltipComponent } from './tooltip.component';

const COMPONENTS = [
  PdmTooltipComponent,
];

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmTooltipModule {}
