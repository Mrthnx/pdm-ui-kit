import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PdmIconModule } from "pdm-ui-kit/src/icon";
import { PdmNativeSelectComponent } from "./native-select.component";

const COMPONENTS = [PdmNativeSelectComponent];

@NgModule({
	imports: [CommonModule, PdmIconModule],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class PdmNativeSelectModule {}
