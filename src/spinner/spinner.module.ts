import { NgModule } from '@angular/core';
import { PdmSpinnerComponent } from './spinner.component';

/**
 * @deprecated Import PdmSpinnerComponent directly instead. This module is kept for backwards compatibility.
 * For modern Angular (v14+), use: import { PdmSpinnerComponent } from 'pdm-ui-kit/spinner'
 */
@NgModule({
  imports: [PdmSpinnerComponent],
  exports: [PdmSpinnerComponent]
})
export class PdmSpinnerModule {}
