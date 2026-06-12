import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PdmMenubarComponent } from './menubar.component';

const COMPONENTS = [
  PdmMenubarComponent,
];

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmMenubarModule {}
