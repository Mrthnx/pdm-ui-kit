import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmSwitchComponent } from './switch.component';

const COMPONENTS = [
  PdmSwitchComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmSwitchModule {}
