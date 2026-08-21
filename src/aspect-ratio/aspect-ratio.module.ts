import { NgModule } from '@angular/core';
import { PdmAspectRatioComponent } from './aspect-ratio.component';

/**
 * @deprecated Import PdmAspectRatioComponent directly instead. This module is kept for backwards compatibility.
 * For modern Angular (v14+), use: import { PdmAspectRatioComponent } from 'pdm-ui-kit/aspect-ratio'
 */
@NgModule({
  imports: [PdmAspectRatioComponent],
  exports: [PdmAspectRatioComponent]
})
export class PdmAspectRatioModule {}
