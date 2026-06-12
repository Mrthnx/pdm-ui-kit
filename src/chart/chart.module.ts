import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmChartComponent } from './chart.component';

const COMPONENTS = [
  PdmChartComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmChartModule {}
