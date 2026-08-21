import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { A11yModule } from '@angular/cdk/a11y';
import { PdmDialogComponent } from './dialog.component';

const COMPONENTS = [
  PdmDialogComponent,
];

@NgModule({
  imports: [CommonModule, A11yModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmDialogModule {}
