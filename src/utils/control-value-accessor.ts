import { ChangeDetectorRef, inject } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";

/**
 * Shared `ControlValueAccessor` plumbing for the kit's form controls.
 *
 * The kit ships plain (non-standalone) NgModule components, so every control
 * that must support reactive forms has to:
 *
 * 1. extend this class (it implements `ControlValueAccessor`),
 * 2. register itself as a `NG_VALUE_ACCESSOR` provider
 *    (`provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TheComponent), multi: true`),
 * 3. implement {@link applyValue} and {@link applyDisabled}.
 *
 * Contract for implementers:
 *
 * - {@link applyValue} writes the model into the component and **must not**
 *   emit `valueChange` / `checkedChange`: writing the model into the view must
 *   never bounce back to the model.
 * - User-originated changes are propagated with {@link notifyValueChange} (and
 *   keep the existing output firing exactly once per change).
 * - {@link notifyTouched} is called on blur.
 * - The DOM value must always converge to the model value, including after a
 *   form reset: when the user typed into the field the model value did not
 *   change, so a value binding alone would not rewrite the DOM.
 */
export abstract class PdmControlValueAccessor<T = unknown>
	implements ControlValueAccessor
{
	/** Change detector used to refresh the view when the model writes into it. */
	protected readonly formCdr = inject(ChangeDetectorRef);

	/** Registered by Angular Forms: propagates user changes to the model. */
	protected onChange: (value: T) => void = () => undefined;

	/** Registered by Angular Forms: propagates the "touched" state to the model. */
	protected onTouched: () => void = () => undefined;

	/** Writes a model value into the component. Never emits back to the model. */
	writeValue(value: T | null): void {
		this.applyValue(value);
		this.formCdr.markForCheck();
	}

	/** Registers the callback that propagates user changes to the model. */
	registerOnChange(fn: (value: T) => void): void {
		this.onChange = fn;
	}

	/** Registers the callback that propagates the touched state to the model. */
	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	/** Applies the disabled state coming from the model. */
	setDisabledState(isDisabled: boolean): void {
		this.applyDisabled(isDisabled);
		this.formCdr.markForCheck();
	}

	/** Propagates a user-originated value change to the form model. */
	protected notifyValueChange(value: T): void {
		this.onChange(value);
	}

	/** Propagates the touched state (usually on blur) to the form model. */
	protected notifyTouched(): void {
		this.onTouched();
	}

	/** Writes the model value into the component state (and into the DOM). */
	protected abstract applyValue(value: T | null): void;

	/** Applies the model disabled state to the component. */
	protected abstract applyDisabled(isDisabled: boolean): void;
}
