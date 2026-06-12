import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmSidebarComponent } from './sidebar.component';

const COMPONENTS = [
  PdmSidebarComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmSidebarModule {}
