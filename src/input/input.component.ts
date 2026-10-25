import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnDestroy,
	Output,
} from "@angular/core";

export type PdmInputSize = "mini" | "small" | "regular" | "large";
export type PdmInputRoundness = "default" | "round";
export type PdmInputIconPosition = "left" | "right";

@Component({
	selector: "pdm-input",
	templateUrl: "./input.component.html",
	styles: [":host { display: block; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdmInputComponent implements OnDestroy {
	@Input() id = "";
	@Input() type = "text";
	@Input() value = "";
	@Input() placeholder = "";
	@Input() disabled = false;
	@Input() readonly = false;
	@Input() required = false;
	@Input() invalid = false;
	@Input() size: PdmInputSize = "regular";
	@Input() roundness: PdmInputRoundness = "default";
	@Input() icon = "";
	@Input() iconPosition: PdmInputIconPosition = "left";
	@Input() className = "";
	@Input() inputClassName = "";
	@Input() label = "";
	@Input() helperText = "";
	@Input() errorText = "";

	/**
	 * Debounce (in milliseconds) applied to `valueChange`.
	 *
	 * - `0` (default): `valueChange` is emitted synchronously on every input.
	 * - `> 0`: `valueChange` is emitted once the user stops typing for that many
	 *   milliseconds. Only the last keystroke is emitted.
	 *
	 * @example
	 * <pdm-input [debounceMs]="700" (valueChange)="onSearch($event)"></pdm-input>
	 */
	@Input() debounceMs = 0;

	@Output() valueChange = new EventEmitter<string>();
	@Output() blurred = new EventEmitter<FocusEvent>();

	/** Pending debounced emission handle (null when nothing is scheduled). */
	private pendingValue: ReturnType<typeof setTimeout> | null = null;

	constructor() {
		if (this.required && this.disabled) {
			console.warn('PdmInputComponent: required + disabled is invalid — a required field cannot be disabled');
		}
	}

	onInput(event: Event): void {
		const value = (event.target as HTMLInputElement).value;

		if (this.debounceMs <= 0) {
			this.valueChange.emit(value);
			return;
		}

		if (this.pendingValue !== null) {
			clearTimeout(this.pendingValue);
		}

		this.pendingValue = setTimeout(() => {
			this.pendingValue = null;
			this.valueChange.emit(value);
		}, this.debounceMs);
	}

	ngOnDestroy(): void {
		if (this.pendingValue !== null) {
			clearTimeout(this.pendingValue);
			this.pendingValue = null;
		}
	}

	onBlur(event: FocusEvent): void {
		this.blurred.emit(event);
	}

	get helperAttrId(): string | null {
		return this.id ? `${this.id}-helper` : null;
	}

	get errorAttrId(): string | null {
		return this.id ? `${this.id}-error` : null;
	}

	get descriptionAttrId(): string | null {
		return this.invalid && this.errorText ? this.errorAttrId : this.helperAttrId;
	}
}
