import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmKbdComponent } from './kbd.component';

const COMPONENTS = [
  PdmKbdComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmKbdModule {}
