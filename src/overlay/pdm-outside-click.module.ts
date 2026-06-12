import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdmOutsideClickDirective } from './pdm-outside-click.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [PdmOutsideClickDirective],
  exports: [PdmOutsideClickDirective]
})
export class PdmOutsideClickModule {}
