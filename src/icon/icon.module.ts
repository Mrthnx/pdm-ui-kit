import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmIconComponent } from './icon.component';

const COMPONENTS = [
  PdmIconComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmIconModule {}
