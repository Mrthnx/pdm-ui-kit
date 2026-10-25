import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  forwardRef
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { PdmControlValueAccessor } from 'pdm-ui-kit/src/utils';

@Component({
  selector: 'pdm-textarea',
  templateUrl: './textarea.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PdmTextareaComponent),
      multi: true
    }
  ]
})
export class PdmTextareaComponent extends PdmControlValueAccessor<string> {
  @Input() id = '';
  @Input() value = '';
  @Input() placeholder = '';
  @Input() rows = 4;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() invalid = false;
  @Input() className = '';
  @Input() textareaClassName = '';
  @Input() label = '';
  @Input() helperText = '';
  @Input() errorText = '';

  @Output() valueChange = new EventEmitter<string>();

  /** Native textarea element, used to write the model value into the DOM. */
  @ViewChild('textareaEl') private textareaRef?: ElementRef<HTMLTextAreaElement>;

  onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.valueChange.emit(value);
    this.notifyValueChange(value);
  }

  onBlur(event: FocusEvent): void {
    this.notifyTouched();
  }

  /**
   * Writes the model value into the component and into the DOM.
   *
   * The native element is written imperatively because, while the user types,
   * the internal `value` does not change: the value binding alone would not
   * rewrite the DOM on a form reset.
   */
  protected applyValue(value: string | null): void {
    const next = value ?? '';
    this.value = next;
    this.syncNativeValue(next);
  }

  /** Writes the value into the native element only when it actually differs. */
  private syncNativeValue(next: string): void {
    const el = this.textareaRef?.nativeElement;

    if (el && el.value !== next) {
      el.value = next;
    }
  }

  /** Maps the model disabled state onto the `disabled` input. */
  protected applyDisabled(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
