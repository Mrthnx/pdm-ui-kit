import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmNavigationMenuComponent } from './navigation-menu.component';

const COMPONENTS = [
  PdmNavigationMenuComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmNavigationMenuModule {}
