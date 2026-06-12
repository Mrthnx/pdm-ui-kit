import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmTabsComponent } from './tabs.component';

const COMPONENTS = [
  PdmTabsComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmTabsModule {}
