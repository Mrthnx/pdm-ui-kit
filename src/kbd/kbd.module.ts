import { NgModule } from '@angular/core';
import { PdmKbdComponent } from './kbd.component';

/**
 * @deprecated Import PdmKbdComponent directly instead. This module is kept for backwards compatibility.
 * For modern Angular (v14+), use: import { PdmKbdComponent } from 'pdm-ui-kit/kbd'
 */
@NgModule({
  imports: [PdmKbdComponent],
  exports: [PdmKbdComponent]
})
export class PdmKbdModule {}
