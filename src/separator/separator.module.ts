import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmSeparatorComponent } from './separator.component';

const COMPONENTS = [
  PdmSeparatorComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmSeparatorModule {}
