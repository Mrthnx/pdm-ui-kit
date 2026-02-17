import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface PdmAccordionItem {
  id: string;
  title: string;
  content: string | string[];
  disabled?: boolean;
}

@Component({
  selector: 'pdm-accordion',
  templateUrl: './accordion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmAccordionComponent {
  @Input() items: PdmAccordionItem[] = [];
  @Input() expandedIndex = -1;
  @Input() className = '';

  @Output() expandedIndexChange = new EventEmitter<number>();

  isExpanded(index: number): boolean {
    return this.expandedIndex === index;
  }

  contentLines(content: string | string[]): string[] {
    if (Array.isArray(content)) return content;
    return content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  toggle(index: number): void {
    if (this.items[index]?.disabled) return;
    this.expandedIndexChange.emit(this.expandedIndex === index ? -1 : index);
  }
}
