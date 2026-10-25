import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	Output,
	ViewChild,
	forwardRef,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

import { PdmControlValueAccessor } from "pdm-ui-kit/src/utils";

export type PdmInputSize = "mini" | "small" | "regular" | "large";
export type PdmInputRoundness = "default" | "round";
export type PdmInputIconPosition = "left" | "right";

@Component({
	selector: "pdm-input",
	templateUrl: "./input.component.html",
	styles: [":host { display: block; }"],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PdmInputComponent),
			multi: true,
		},
	],
})
export class PdmInputComponent
	extends PdmControlValueAccessor<string>
	implements OnDestroy
{
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

	/** Native input element, used to write the model value into the DOM. */
	@ViewChild("inputEl") private inputRef?: ElementRef<HTMLInputElement>;

	/** Pending debounced emission handle (null when nothing is scheduled). */
	private pendingValue: ReturnType<typeof setTimeout> | null = null;

	constructor() {
		super();

		if (this.required && this.disabled) {
			console.warn('PdmInputComponent: required + disabled is invalid — a required field cannot be disabled');
		}
	}

	onInput(event: Event): void {
		const value = (event.target as HTMLInputElement).value;

		if (this.debounceMs <= 0) {
			this.emitValue(value);
			return;
		}

		if (this.pendingValue !== null) {
			clearTimeout(this.pendingValue);
		}

		this.pendingValue = setTimeout(() => {
			this.pendingValue = null;
			this.emitValue(value);
		}, this.debounceMs);
	}

	/**
	 * Emits the user-originated value exactly once and propagates the same
	 * value to the form model, keeping the output and the model in sync.
	 */
	private emitValue(value: string): void {
		this.valueChange.emit(value);
		this.notifyValueChange(value);
	}

	ngOnDestroy(): void {
		if (this.pendingValue !== null) {
			clearTimeout(this.pendingValue);
			this.pendingValue = null;
		}
	}

	onBlur(event: FocusEvent): void {
		this.notifyTouched();
		this.blurred.emit(event);
	}

	/**
	 * Writes the model value into the component and into the DOM.
	 *
	 * The native element is written imperatively because, while the user types,
	 * the internal `value` does not change: the value binding alone would not
	 * rewrite the DOM on a form reset.
	 */
	protected applyValue(value: string | null): void {
		if (this.pendingValue !== null) {
			clearTimeout(this.pendingValue);
			this.pendingValue = null;
		}

		const next = value ?? "";
		this.value = next;
		this.syncNativeValue(next);
	}

	/** Writes the value into the native element only when it actually differs. */
	private syncNativeValue(next: string): void {
		const el = this.inputRef?.nativeElement;

		if (el && el.value !== next) {
			el.value = next;
		}
	}

	/** Maps the model disabled state onto the `disabled` input. */
	protected applyDisabled(isDisabled: boolean): void {
		this.disabled = isDisabled;
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
