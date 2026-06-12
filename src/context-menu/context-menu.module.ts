import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { PdmContextMenuComponent } from './context-menu.component';

const COMPONENTS = [
  PdmContextMenuComponent,
];

@NgModule({
  imports: [CommonModule, OverlayModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmContextMenuModule {}
