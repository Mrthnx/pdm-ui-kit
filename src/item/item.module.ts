import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmItemComponent } from './item.component';

const COMPONENTS = [
  PdmItemComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmItemModule {}
