import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmToggleComponent } from './toggle.component';
import { PdmToggleGroupComponent } from './toggle-group.component';

const COMPONENTS = [
  PdmToggleComponent,
  PdmToggleGroupComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmToggleModule {}
