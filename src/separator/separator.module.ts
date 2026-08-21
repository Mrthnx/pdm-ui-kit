import { NgModule } from '@angular/core';
import { PdmSeparatorComponent } from './separator.component';

/**
 * @deprecated Import PdmSeparatorComponent directly instead. This module is kept for backwards compatibility.
 * For modern Angular (v14+), use: import { PdmSeparatorComponent } from 'pdm-ui-kit/separator'
 */
@NgModule({
  imports: [PdmSeparatorComponent],
  exports: [PdmSeparatorComponent]
})
export class PdmSeparatorModule {}
