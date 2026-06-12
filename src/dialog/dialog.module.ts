import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmDialogComponent } from './dialog.component';

const COMPONENTS = [
  PdmDialogComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmDialogModule {}
