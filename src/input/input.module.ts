import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PdmIconModule } from "pdm-ui-kit/src/icon";
import { PdmInputComponent } from "./input.component";
import { PdmInputGroupComponent } from "./input-group.component";
import { PdmInputOtpComponent } from "./input-otp.component";
import { PdmInputPasswordComponent } from "./input-password.component";
import { PdmTextareaComponent } from "./textarea.component";

const COMPONENTS = [
	PdmInputComponent,
	PdmInputGroupComponent,
	PdmInputOtpComponent,
	PdmInputPasswordComponent,
	PdmTextareaComponent,
];

@NgModule({
	imports: [CommonModule, PdmIconModule],
	declarations: COMPONENTS,
	exports: COMPONENTS,
})
export class PdmInputModule {}
