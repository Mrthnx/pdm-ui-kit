import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmVirtualTableComponent } from './virtual-table.component';

@NgModule({
  imports: [CommonModule, ScrollingModule],
  declarations: [PdmVirtualTableComponent],
  exports: [PdmVirtualTableComponent],
})
export class PdmVirtualTableModule {}
