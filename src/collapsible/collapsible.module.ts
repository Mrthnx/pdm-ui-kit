import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmCollapsibleComponent } from './collapsible.component';

const COMPONENTS = [
  PdmCollapsibleComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmCollapsibleModule {}
