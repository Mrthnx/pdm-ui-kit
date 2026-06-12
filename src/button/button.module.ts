import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmButtonComponent } from './button.component';
import { PdmButtonGroupComponent } from './button-group.component';

const COMPONENTS = [
  PdmButtonComponent,
  PdmButtonGroupComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmButtonModule {}
