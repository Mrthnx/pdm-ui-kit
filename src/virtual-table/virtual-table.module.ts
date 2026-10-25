import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmVirtualTableSemanticComponent } from './virtual-table-semantic.component';
import { PdmVirtualTableComponent } from './virtual-table.component';

@NgModule({
  imports: [CommonModule, ScrollingModule],
  declarations: [PdmVirtualTableComponent, PdmVirtualTableSemanticComponent],
  exports: [PdmVirtualTableComponent, PdmVirtualTableSemanticComponent],
})
export class PdmVirtualTableModule {}
