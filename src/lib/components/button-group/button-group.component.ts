import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

export type PdmButtonGroupVariant =
	| "default"
	| "group"
	| "orientation"
	| "separator";
export type PdmButtonGroupOrientation = "horizontal" | "vertical";

type Axis = "horizontal" | "vertical";

const ROOT_LAYOUT: Record<Axis, string> = {
	horizontal: "w-full flex flex-row items-center overflow-x-auto",
	vertical: "flex flex-col items-stretch",
};

const ATTACHMENT_EDGE_CLASSES: Record<Axis, string[]> = {
	horizontal: [
		"[&>*]:rounded-none",
		"[&>*:first-child]:rounded-l-md",
		"[&>*:last-child]:rounded-r-md",
		"[&>*:not(:first-child)]:border-l-0",
		"[&>*:not(:first-child)]:-ml-px",
	],
	vertical: [
		"[&>*]:rounded-none",
		"[&>*:first-child]:rounded-t-md",
		"[&>*:last-child]:rounded-b-md",
		"[&>*:not(:first-child)]:border-t-0",
		"[&>*:not(:first-child)]:-mt-px",
	],
};

const ATTACHMENT_CONTROL_CLASSES: Record<Axis, string[]> = {
	horizontal: [
		"[&>pdm-button]:flex",
		"[&>pdm-button>button]:h-9",
		"[&>pdm-button>button]:!rounded-none",
		"[&>pdm-button>button]:shadow-none",
		"[&>pdm-button:first-child>button]:!rounded-l-md",
		"[&>pdm-button:last-child>button]:!rounded-r-md",

		"[&>pdm-input]:flex-1",
		"[&>pdm-input]:min-w-0",
		"[&>pdm-input>div]:w-full",
		"[&>pdm-input>div]:min-w-0",
		"[&>pdm-input>div]:!rounded-none",
		"[&>pdm-input>div]:shadow-none",
		"[&>pdm-input>div>input]:!rounded-none",
		"[&>pdm-input>div>input]:bg-background",
		"[&>pdm-input>div>input]:shadow-none",
		"[&>pdm-input:first-child>div]:!rounded-l-md",
		"[&>pdm-input:last-child>div]:!rounded-r-md",
		"[&>pdm-input:first-child>div>input]:!rounded-l-md",
		"[&>pdm-input:last-child>div>input]:!rounded-r-md",

		"[&>pdm-input-group]:min-w-0",
		"[&>pdm-input-group>div]:!rounded-none",
		"[&>pdm-input-group>div]:shadow-none",
		"[&>pdm-input-group:first-child>div]:!rounded-l-md",
		"[&>pdm-input-group:last-child>div]:!rounded-r-md",

		"[&>pdm-select>select]:!rounded-none",
		"[&>pdm-select>select]:shadow-none",
		"[&>pdm-select>div>button]:!rounded-none",
		"[&>pdm-select>div>button]:shadow-none",
		"[&>pdm-select:first-child>select]:!rounded-l-md",
		"[&>pdm-select:last-child>select]:!rounded-r-md",
		"[&>pdm-select:first-child>div>button]:!rounded-l-md",
		"[&>pdm-select:last-child>div>button]:!rounded-r-md",
		"[&>pdm-select:not(:first-child)>div>button]:!rounded-l-none",
		"[&>pdm-select:not(:last-child)>div>button]:!rounded-r-none",

		"[&>pdm-tooltip>span>*]:rounded-none",
		"[&>pdm-tooltip>span>*]:shadow-none",
		"[&>pdm-tooltip:not(:first-child)>span>*]:border-l-0",
		"[&>pdm-tooltip>span>button]:!rounded-none",
		"[&>pdm-tooltip>span>button]:shadow-none",
		"[&>pdm-tooltip:first-child>span>button]:!rounded-l-md",
		"[&>pdm-tooltip:last-child>span>button]:!rounded-r-md",
		"[&>pdm-tooltip>span>input]:!rounded-none",
		"[&>pdm-tooltip>span>input]:bg-background",
		"[&>pdm-tooltip>span>input]:shadow-none",
		"[&>pdm-tooltip:first-child>span>input]:!rounded-l-md",
		"[&>pdm-tooltip:last-child>span>input]:!rounded-r-md",
		"[&>pdm-tooltip>span>select]:!rounded-none",
		"[&>pdm-tooltip>span>select]:shadow-none",
		"[&>pdm-tooltip:first-child>span>select]:!rounded-l-md",
		"[&>pdm-tooltip:last-child>span>select]:!rounded-r-md",
		"[&>pdm-tooltip>span>pdm-button>button]:!rounded-none",
		"[&>pdm-tooltip>span>pdm-button>button]:shadow-none",
		"[&>pdm-tooltip:first-child>span>pdm-button>button]:!rounded-l-md",
		"[&>pdm-tooltip:last-child>span>pdm-button>button]:!rounded-r-md",
		"[&>pdm-tooltip>span>pdm-input>div]:!rounded-none",
		"[&>pdm-tooltip>span>pdm-input>div]:shadow-none",
		"[&>pdm-tooltip>span>pdm-input>div>input]:!rounded-none",
		"[&>pdm-tooltip>span>pdm-input>div>input]:bg-background",
		"[&>pdm-tooltip>span>pdm-input>div>input]:shadow-none",
		"[&>pdm-tooltip:first-child>span>pdm-input>div]:!rounded-l-md",
		"[&>pdm-tooltip:last-child>span>pdm-input>div]:!rounded-r-md",
		"[&>pdm-tooltip:first-child>span>pdm-input>div>input]:!rounded-l-md",
		"[&>pdm-tooltip:last-child>span>pdm-input>div>input]:!rounded-r-md",
		"[&>pdm-tooltip>span>pdm-input-group>div]:!rounded-none",
		"[&>pdm-tooltip>span>pdm-input-group>div]:shadow-none",
		"[&>pdm-tooltip:first-child>span>pdm-input-group>div]:!rounded-l-md",
		"[&>pdm-tooltip:last-child>span>pdm-input-group>div]:!rounded-r-md",
		"[&>pdm-tooltip>span>pdm-select>select]:!rounded-none",
		"[&>pdm-tooltip>span>pdm-select>select]:shadow-none",
		"[&>pdm-tooltip>span>pdm-select>div>button]:!rounded-none",
		"[&>pdm-tooltip>span>pdm-select>div>button]:shadow-none",
		"[&>pdm-tooltip:first-child>span>pdm-select>select]:!rounded-l-md",
		"[&>pdm-tooltip:last-child>span>pdm-select>select]:!rounded-r-md",
		"[&>pdm-tooltip:first-child>span>pdm-select>div>button]:!rounded-l-md",
		"[&>pdm-tooltip:last-child>span>pdm-select>div>button]:!rounded-r-md",
		"[&>pdm-tooltip:not(:first-child)>span>pdm-select>div>button]:!rounded-l-none",
		"[&>pdm-tooltip:not(:last-child)>span>pdm-select>div>button]:!rounded-r-none",
	],
	vertical: [
		"[&>*]:rounded-none",
		"[&>*:first-child]:rounded-t-md",
		"[&>*:last-child]:rounded-b-md",
		"[&>*:not(:first-child)]:border-t-0",
		"[&>*:not(:first-child)]:-mt-px",

		"[&>pdm-button]:flex",
		"[&>pdm-button>button]:h-9",
		"[&>pdm-button>button]:!rounded-none",
		"[&>pdm-button>button]:shadow-none",
		"[&>pdm-button:first-child>button]:!rounded-t-md",
		"[&>pdm-button:last-child>button]:!rounded-b-md",

		"[&>pdm-input>div]:!rounded-none",
		"[&>pdm-input>div]:shadow-none",
		"[&>pdm-input>div>input]:!rounded-none",
		"[&>pdm-input>div>input]:bg-background",
		"[&>pdm-input>div>input]:shadow-none",
		"[&>pdm-input:first-child>div]:!rounded-t-md",
		"[&>pdm-input:last-child>div]:!rounded-b-md",
		"[&>pdm-input:first-child>div>input]:!rounded-t-md",
		"[&>pdm-input:last-child>div>input]:!rounded-b-md",

		"[&>pdm-input-group>div]:!rounded-none",
		"[&>pdm-input-group>div]:shadow-none",
		"[&>pdm-input-group:first-child>div]:!rounded-t-md",
		"[&>pdm-input-group:last-child>div]:!rounded-b-md",

		"[&>pdm-select>select]:!rounded-none",
		"[&>pdm-select>select]:shadow-none",
		"[&>pdm-select>div>button]:!rounded-none",
		"[&>pdm-select>div>button]:shadow-none",
		"[&>pdm-select:first-child>select]:!rounded-t-md",
		"[&>pdm-select:last-child>select]:!rounded-b-md",
		"[&>pdm-select:first-child>div>button]:!rounded-t-md",
		"[&>pdm-select:last-child>div>button]:!rounded-b-md",
		"[&>pdm-select:not(:first-child)>div>button]:!rounded-t-none",
		"[&>pdm-select:not(:last-child)>div>button]:!rounded-b-none",

		"[&>pdm-tooltip>span>*]:rounded-none",
		"[&>pdm-tooltip>span>*]:shadow-none",
		"[&>pdm-tooltip:not(:first-child)>span>*]:border-t-0",
		"[&>pdm-tooltip>span>button]:!rounded-none",
		"[&>pdm-tooltip>span>button]:shadow-none",
		"[&>pdm-tooltip:first-child>span>button]:!rounded-t-md",
		"[&>pdm-tooltip:last-child>span>button]:!rounded-b-md",
		"[&>pdm-tooltip>span>input]:!rounded-none",
		"[&>pdm-tooltip>span>input]:bg-background",
		"[&>pdm-tooltip>span>input]:shadow-none",
		"[&>pdm-tooltip:first-child>span>input]:!rounded-t-md",
		"[&>pdm-tooltip:last-child>span>input]:!rounded-b-md",
		"[&>pdm-tooltip>span>select]:!rounded-none",
		"[&>pdm-tooltip>span>select]:shadow-none",
		"[&>pdm-tooltip:first-child>span>select]:!rounded-t-md",
		"[&>pdm-tooltip:last-child>span>select]:!rounded-b-md",
		"[&>pdm-tooltip>span>pdm-button>button]:!rounded-none",
		"[&>pdm-tooltip>span>pdm-button>button]:shadow-none",
		"[&>pdm-tooltip:first-child>span>pdm-button>button]:!rounded-t-md",
		"[&>pdm-tooltip:last-child>span>pdm-button>button]:!rounded-b-md",
		"[&>pdm-tooltip>span>pdm-input>div]:!rounded-none",
		"[&>pdm-tooltip>span>pdm-input>div]:shadow-none",
		"[&>pdm-tooltip>span>pdm-input>div>input]:!rounded-none",
		"[&>pdm-tooltip>span>pdm-input>div>input]:bg-background",
		"[&>pdm-tooltip>span>pdm-input>div>input]:shadow-none",
		"[&>pdm-tooltip:first-child>span>pdm-input>div]:!rounded-t-md",
		"[&>pdm-tooltip:last-child>span>pdm-input>div]:!rounded-b-md",
		"[&>pdm-tooltip:first-child>span>pdm-input>div>input]:!rounded-t-md",
		"[&>pdm-tooltip:last-child>span>pdm-input>div>input]:!rounded-b-md",
		"[&>pdm-tooltip>span>pdm-input-group>div]:!rounded-none",
		"[&>pdm-tooltip>span>pdm-input-group>div]:shadow-none",
		"[&>pdm-tooltip:first-child>span>pdm-input-group>div]:!rounded-t-md",
		"[&>pdm-tooltip:last-child>span>pdm-input-group>div]:!rounded-b-md",
		"[&>pdm-tooltip>span>pdm-select>select]:!rounded-none",
		"[&>pdm-tooltip>span>pdm-select>select]:shadow-none",
		"[&>pdm-tooltip>span>pdm-select>div>button]:!rounded-none",
		"[&>pdm-tooltip>span>pdm-select>div>button]:shadow-none",
		"[&>pdm-tooltip:first-child>span>pdm-select>select]:!rounded-t-md",
		"[&>pdm-tooltip:last-child>span>pdm-select>select]:!rounded-b-md",
		"[&>pdm-tooltip:first-child>span>pdm-select>div>button]:!rounded-t-md",
		"[&>pdm-tooltip:last-child>span>pdm-select>div>button]:!rounded-b-md",
		"[&>pdm-tooltip:not(:first-child)>span>pdm-select>div>button]:!rounded-t-none",
		"[&>pdm-tooltip:not(:last-child)>span>pdm-select>div>button]:!rounded-b-none",
	],
};

const FOCUS_STACKING_CLASS = "*:focus-visible:relative *:focus-visible:z-10";
const SEPARATOR_CLASSES =
	"overflow-hidden rounded-md border border-border bg-secondary shadow-sm";

@Component({
	selector: "pdm-button-group",
	templateUrl: "./button-group.component.html",
	styles: [":host { display: block; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmButtonGroupComponent {
	@Input() variant: PdmButtonGroupVariant = "default";
	@Input() orientation?: PdmButtonGroupOrientation;
	@Input() direction?: PdmButtonGroupOrientation;
	@Input() separated = true;
	@Input() className = "";

	get axis(): Axis {
		return this.orientation ?? this.direction ?? "horizontal";
	}

	get isVertical(): boolean {
		return this.variant === "orientation" || this.axis === "vertical";
	}

	get shouldAttach(): boolean {
		return !this.separated && this.variant !== "default";
	}

	get ariaOrientation(): PdmButtonGroupOrientation {
		return this.isVertical ? "vertical" : "horizontal";
	}

	get rootClasses(): string[] {
		return [
			ROOT_LAYOUT[this.isVertical ? "vertical" : "horizontal"],
			this.variant === "default" || this.separated ? "gap-2" : "gap-0",
			this.shouldAttach
				? ATTACHMENT_EDGE_CLASSES[
						this.isVertical ? "vertical" : "horizontal"
					].join(" ")
				: "",
			this.shouldAttach
				? ATTACHMENT_CONTROL_CLASSES[
						this.isVertical ? "vertical" : "horizontal"
					].join(" ")
				: "",
			this.shouldAttach ? FOCUS_STACKING_CLASS : "",
			this.variant === "separator" ? SEPARATOR_CLASSES : "",
			this.className,
		];
	}
}
