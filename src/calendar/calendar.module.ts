import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { OverlayModule } from "@angular/cdk/overlay";
import { PdmLabelModule } from "pdm-ui-kit/src/label";
import { PdmCalendarComponent } from "./calendar.component";
import { PdmDatePickerComponent } from "./date-picker.component";

const COMPONENTS = [PdmCalendarComponent, PdmDatePickerComponent];

@NgModule({
	imports: [CommonModule, OverlayModule, PdmLabelModule],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class PdmCalendarModule {}
