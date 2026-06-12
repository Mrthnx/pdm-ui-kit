import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmBreadcrumbComponent } from './breadcrumb.component';

const COMPONENTS = [
  PdmBreadcrumbComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmBreadcrumbModule {}
