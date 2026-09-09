import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmAlertComponent } from './alert.component';
import { PdmAlertDialogComponent } from './alert-dialog.component';

const COMPONENTS = [
  PdmAlertComponent,
  PdmAlertDialogComponent,
];

@NgModule({
  imports: [CommonModule, A11yModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmAlertModule {}
