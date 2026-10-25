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
 *
 * Scope of the base class:
 *
 * - It resolves the `ChangeDetectorRef` with `inject()`, so the class that
 *   extends it must be instantiated in an injection context (an Angular
 *   component, a directive or a factory). It cannot be extended from a plain
 *   class created with `new` (for example a model-side `AbstractControl`).
 * - It is public API: within the `1.x` major its members are never renamed or
 *   removed, and a minor release may add new `protected` members.
 */
export abstract class PdmControlValueAccessor<T = unknown>
	implements ControlValueAccessor
{
	/** Change detector used to refresh the view when the model writes into it. */
	protected readonly formCdr = inject(ChangeDetectorRef);

	/**
	 * Registered by Angular Forms: propagates user changes to the model.
	 *
	 * Named `onChangeFn`/`onTouchedFn` (and not `onChange`/`onTouched`) on
	 * purpose: several kit components already expose a public `onChange`
	 * method for the native DOM `change` event, and a base-class field with
	 * the same name would collide with it.
	 */
	protected onChangeFn: (value: T) => void = () => undefined;

	/** Registered by Angular Forms: propagates the "touched" state to the model. */
	protected onTouchedFn: () => void = () => undefined;

	/** Writes a model value into the component. Never emits back to the model. */
	writeValue(value: T | null): void {
		this.applyValue(value);
		this.formCdr.markForCheck();
	}

	/** Registers the callback that propagates user changes to the model. */
	registerOnChange(fn: (value: T) => void): void {
		this.onChangeFn = fn;
	}

	/** Registers the callback that propagates the touched state to the model. */
	registerOnTouched(fn: () => void): void {
		this.onTouchedFn = fn;
	}

	/** Applies the disabled state coming from the model. */
	setDisabledState(isDisabled: boolean): void {
		this.applyDisabled(isDisabled);
		this.formCdr.markForCheck();
	}

	/** Propagates a user-originated value change to the form model. */
	protected notifyValueChange(value: T): void {
		this.onChangeFn(value);
	}

	/** Propagates the touched state (usually on blur) to the form model. */
	protected notifyTouched(): void {
		this.onTouchedFn();
	}

	/** Writes the model value into the component state (and into the DOM). */
	protected abstract applyValue(value: T | null): void;

	/** Applies the model disabled state to the component. */
	protected abstract applyDisabled(isDisabled: boolean): void;
}
