import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { OverlayModule } from "@angular/cdk/overlay";
import { PdmIconModule } from "pdm-ui-kit/src/icon";
import { PdmSelectComponent } from "./select.component";
import { PdmSelectOptionDirective } from "./select-option.directive";

const COMPONENTS = [PdmSelectComponent, PdmSelectOptionDirective];

@NgModule({
	imports: [CommonModule, OverlayModule, PdmIconModule],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class PdmSelectModule {}
