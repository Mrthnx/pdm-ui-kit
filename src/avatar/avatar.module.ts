import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmAvatarComponent } from './avatar.component';

const COMPONENTS = [
  PdmAvatarComponent,
];

@NgModule({
  imports: [CommonModule],
  declarations: COMPONENTS,
  exports: COMPONENTS
})
export class PdmAvatarModule {}
