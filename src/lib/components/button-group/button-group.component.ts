import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type PdmButtonGroupVariant = 'default' | 'group' | 'orientation' | 'separator';
export type PdmButtonGroupDirection = 'horizontal' | 'vertical';

@Component({
  selector: 'pdm-button-group',
  templateUrl: './button-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmButtonGroupComponent {
  @Input() variant: PdmButtonGroupVariant = 'default';
  @Input() direction: PdmButtonGroupDirection = 'horizontal';
  @Input() separated = true;
  @Input() className = '';

  get rootClasses(): string[] {
    const isVertical = this.variant === 'orientation' || this.direction === 'vertical';
    const isAttached = this.variant !== 'default' && !this.separated;
    const isSeparator = this.variant === 'separator';

    return [
      'inline-flex w-fit',
      isVertical ? 'flex-col items-stretch' : 'items-center',
      this.variant === 'default' || this.separated ? 'gap-2' : 'gap-0',
      isAttached
        ? isVertical
          ? [
              '[&>*]:rounded-none',
              '[&>*:first-child]:rounded-t-md',
              '[&>*:last-child]:rounded-b-md',
              '[&>*:not(:first-child)]:border-t-0',
              '[&>*:not(:first-child)]:-mt-px'
            ].join(' ')
          : [
              '[&>*]:rounded-none',
              '[&>*:first-child]:rounded-l-md',
              '[&>*:last-child]:rounded-r-md',
              '[&>*:not(:first-child)]:border-l-0',
              '[&>*:not(:first-child)]:-ml-px'
            ].join(' ')
        : '',
      isSeparator
        ? 'overflow-hidden rounded-md border border-border bg-secondary shadow-sm'
        : '',
      this.className
    ];
  }
}
