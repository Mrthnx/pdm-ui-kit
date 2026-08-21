import { NgModule } from '@angular/core';
import { PdmBadgeComponent } from './badge.component';

/**
 * @deprecated Import PdmBadgeComponent directly instead. This module is kept for backwards compatibility.
 * For modern Angular (v14+), use: import { PdmBadgeComponent } from 'pdm-ui-kit/badge'
 */
@NgModule({
  imports: [PdmBadgeComponent],
  exports: [PdmBadgeComponent]
})
export class PdmBadgeModule {}
