import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PdmIconModule } from "pdm-ui-kit/src/icon";
import { PdmDrawerComponent } from "./drawer.component";
import { PdmSheetComponent } from "./sheet.component";

const COMPONENTS = [PdmDrawerComponent, PdmSheetComponent];

@NgModule({
	imports: [CommonModule, PdmIconModule],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class PdmDrawerModule {}
