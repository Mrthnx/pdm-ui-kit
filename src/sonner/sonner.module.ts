import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PdmIconModule } from "pdm-ui-kit/src/icon";
import { PdmSonnerComponent } from "./sonner.component";

const COMPONENTS = [PdmSonnerComponent];

@NgModule({
	imports: [CommonModule, PdmIconModule],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class PdmSonnerModule {}
