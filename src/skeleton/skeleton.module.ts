import { NgModule } from '@angular/core';
import { PdmSkeletonComponent } from './skeleton.component';

/**
 * @deprecated Import PdmSkeletonComponent directly instead. This module is kept for backwards compatibility.
 * For modern Angular (v14+), use: import { PdmSkeletonComponent } from 'pdm-ui-kit/skeleton'
 */
@NgModule({
  imports: [PdmSkeletonComponent],
  exports: [PdmSkeletonComponent]
})
export class PdmSkeletonModule {}
