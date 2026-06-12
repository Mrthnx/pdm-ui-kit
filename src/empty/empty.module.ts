import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PdmButtonModule } from "pdm-ui-kit/src/button";
import { PdmIconModule } from "pdm-ui-kit/src/icon";
import { PdmEmptyComponent } from "./empty.component";

const COMPONENTS = [PdmEmptyComponent];

@NgModule({
	imports: [CommonModule, PdmButtonModule, PdmIconModule],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class PdmEmptyModule {}
