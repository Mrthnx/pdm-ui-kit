import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmSkeletonComponent } from './skeleton.component';

const COMPONENTS = [
  PdmSkeletonComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmSkeletonModule {}
