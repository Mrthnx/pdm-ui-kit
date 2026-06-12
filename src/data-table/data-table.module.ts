import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmDataTableComponent } from './data-table.component';
import { PdmDraggableTableComponent } from './draggable-table.component';
import { PdmTableComponent } from './table.component';

const COMPONENTS = [
  PdmDataTableComponent,
  PdmDraggableTableComponent,
  PdmTableComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmDataTableModule {}
