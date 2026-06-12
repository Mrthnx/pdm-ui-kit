import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PdmPopoverComponent } from './popover.component';

const COMPONENTS = [
  PdmPopoverComponent,
];

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmPopoverModule {}
