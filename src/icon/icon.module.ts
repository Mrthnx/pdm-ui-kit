import { NgModule } from '@angular/core';
import { PdmIconComponent } from './icon.component';

/**
 * @deprecated Import PdmIconComponent directly instead. This module is kept for backwards compatibility.
 * For modern Angular (v14+), use: import { PdmIconComponent } from 'pdm-ui-kit/icon'
 */
@NgModule({
  imports: [PdmIconComponent],
  exports: [PdmIconComponent]
})
export class PdmIconModule {}
