import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pdm-textarea',
  templateUrl: './textarea.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmTextareaComponent {
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

  onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLTextAreaElement).value);
  }
}
