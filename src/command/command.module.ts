import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PdmIconModule } from "pdm-ui-kit/src/icon";
import { PdmCommandComponent } from "./command.component";

const COMPONENTS = [PdmCommandComponent];

@NgModule({
	imports: [CommonModule, PdmIconModule],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class PdmCommandModule {}
