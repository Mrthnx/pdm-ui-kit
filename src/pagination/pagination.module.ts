import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PdmIconModule } from "pdm-ui-kit/src/icon";
import { PdmSelectModule } from "pdm-ui-kit/src/select";
import { PdmPaginationComponent } from "./pagination.component";

const COMPONENTS = [PdmPaginationComponent];

@NgModule({
	imports: [CommonModule, PdmIconModule, PdmSelectModule],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class PdmPaginationModule {}
