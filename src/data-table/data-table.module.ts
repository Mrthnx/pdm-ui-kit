import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmDataTableComponent } from './data-table.component';
import { PdmDraggableTableComponent } from './draggable-table.component';
import { PdmSortHeaderDirective } from './sort-header.directive';
import { PdmTableComponent } from './table.component';

const COMPONENTS = [
  PdmDataTableComponent,
  PdmDraggableTableComponent,
  PdmTableComponent,
];

const DIRECTIVES = [
  PdmSortHeaderDirective,
];

@NgModule({
  imports: [CommonModule],
  declarations: [...COMPONENTS, ...DIRECTIVES],
  exports: [...COMPONENTS, ...DIRECTIVES]
})
export class PdmDataTableModule {}
