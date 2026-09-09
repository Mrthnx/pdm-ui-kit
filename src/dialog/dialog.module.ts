import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';
import {
  PdmDialogComponent,
  PdmDialogFooterDirective,
  PdmDialogHeaderDirective,
} from './dialog.component';

const COMPONENTS = [
  PdmDialogComponent,
  PdmDialogHeaderDirective,
  PdmDialogFooterDirective,
];

@NgModule({
  imports: [CommonModule, A11yModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmDialogModule {}
