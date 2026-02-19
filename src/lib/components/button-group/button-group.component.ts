import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type PdmButtonGroupVariant = 'default' | 'group' | 'orientation' | 'separator';
export type PdmButtonGroupOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'pdm-button-group',
  templateUrl: './button-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmButtonGroupComponent {
  @Input() variant: PdmButtonGroupVariant = 'default';
  @Input() orientation?: PdmButtonGroupOrientation;
  @Input() direction?: PdmButtonGroupOrientation;
  @Input() separated = true;
  @Input() className = '';

  get rootClasses(): string[] {
    const effectiveOrientation = this.orientation ?? this.direction ?? 'horizontal';
    const isVertical = this.variant === 'orientation' || effectiveOrientation === 'vertical';
    const isGroup = this.variant === 'group';
    const isAttached = !this.separated && this.variant !== 'default';
    const isSeparator = this.variant === 'separator';

    const attachedClasses = isAttached && !isGroup
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
      : '';

    const groupHorizontalClasses = isGroup && !isVertical && !this.separated
      ? [
          '[&>*:not(:first-child)]:-ml-px',
          '[&>pdm-button]:flex',
          '[&>pdm-button>button]:h-9',
          '[&>pdm-input]:flex-1',
          '[&>pdm-input>div]:w-full',
          '[&>pdm-button>button]:!rounded-none',
          '[&>pdm-button:first-child>button]:!rounded-l-md',
          '[&>pdm-button:last-child>button]:!rounded-r-md',
          '[&>pdm-input>div>input]:!rounded-none',
          '[&>pdm-input:first-child>div>input]:!rounded-l-md',
          '[&>pdm-input:last-child>div>input]:!rounded-r-md',
          '[&>pdm-input-group>div]:!rounded-none',
          '[&>pdm-input-group:first-child>div]:!rounded-l-md',
          '[&>pdm-input-group:last-child>div]:!rounded-r-md',
          '[&>pdm-input>div>input]:bg-background',
          '[&>pdm-input>div>input]:shadow-none',
          '[&>pdm-button>button]:rounded-l-none',
          '[&>pdm-button>button]:shadow-none'
        ].join(' ')
      : '';

    const groupVerticalClasses = isGroup && isVertical && !this.separated
      ? [
          '[&>*:not(:first-child)]:-mt-px',
          '[&>pdm-button]:flex',
          '[&>pdm-button>button]:h-9',
          '[&>pdm-button>button]:!rounded-none',
          '[&>pdm-button:first-child>button]:!rounded-t-md',
          '[&>pdm-button:last-child>button]:!rounded-b-md',
          '[&>pdm-input>div>input]:!rounded-none',
          '[&>pdm-input:first-child>div>input]:!rounded-t-md',
          '[&>pdm-input:last-child>div>input]:!rounded-b-md',
          '[&>pdm-input-group>div]:!rounded-none',
          '[&>pdm-input-group:first-child>div]:!rounded-t-md',
          '[&>pdm-input-group:last-child>div]:!rounded-b-md',
          '[&>pdm-input>div>input]:bg-background',
          '[&>pdm-input>div>input]:shadow-none',
          '[&>pdm-button>button]:shadow-none'
        ].join(' ')
      : '';

    return [
      'inline-flex w-fit',
      isVertical ? 'flex-col items-stretch' : 'items-center',
      this.variant === 'default' || this.separated ? 'gap-2' : 'gap-0',
      isGroup ? '*:focus-visible:relative *:focus-visible:z-10' : '',
      attachedClasses,
      groupHorizontalClasses,
      groupVerticalClasses,
      isSeparator
        ? 'overflow-hidden rounded-md border border-border bg-secondary shadow-sm'
        : '',
      this.className
    ];
  }
}
