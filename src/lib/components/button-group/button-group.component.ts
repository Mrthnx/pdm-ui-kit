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
          '[&>*]:rounded-none',
          '[&>*:first-child]:rounded-l-md',
          '[&>*:last-child]:rounded-r-md',
          '[&>*:not(:first-child)]:-ml-px',
          '[&>*:not(:first-child)]:border-l-0',
          '[&>pdm-button]:flex',
          '[&>pdm-button>button]:h-9',
          '[&>pdm-input]:flex-1',
          '[&>pdm-input>div]:w-full',
          '[&>pdm-select>select]:!rounded-none',
          '[&>pdm-select:first-child>select]:!rounded-l-md',
          '[&>pdm-select:last-child>select]:!rounded-r-md',
          '[&>pdm-select>select]:shadow-none',
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
          '[&>pdm-button>button]:shadow-none',
          '[&>pdm-tooltip>span>*]:rounded-none',
          '[&>pdm-tooltip:first-child>span>*]:rounded-l-md',
          '[&>pdm-tooltip:last-child>span>*]:rounded-r-md',
          '[&>pdm-tooltip:not(:first-child)>span>*]:border-l-0',
          '[&>pdm-tooltip>span>pdm-button>button]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>pdm-button>button]:!rounded-l-md',
          '[&>pdm-tooltip:last-child>span>pdm-button>button]:!rounded-r-md',
          '[&>pdm-tooltip>span>pdm-button>button]:shadow-none',
          '[&>pdm-tooltip>span>button]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>button]:!rounded-l-md',
          '[&>pdm-tooltip:last-child>span>button]:!rounded-r-md',
          '[&>pdm-tooltip>span>button]:shadow-none',
          '[&>pdm-tooltip>span>pdm-input>div>input]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>pdm-input>div>input]:!rounded-l-md',
          '[&>pdm-tooltip:last-child>span>pdm-input>div>input]:!rounded-r-md',
          '[&>pdm-tooltip>span>pdm-input>div>input]:shadow-none',
          '[&>pdm-tooltip>span>input]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>input]:!rounded-l-md',
          '[&>pdm-tooltip:last-child>span>input]:!rounded-r-md',
          '[&>pdm-tooltip>span>input]:shadow-none',
          '[&>pdm-tooltip>span>pdm-input-group>div]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>pdm-input-group>div]:!rounded-l-md',
          '[&>pdm-tooltip:last-child>span>pdm-input-group>div]:!rounded-r-md',
          '[&>pdm-tooltip>span>pdm-select>select]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>pdm-select>select]:!rounded-l-md',
          '[&>pdm-tooltip:last-child>span>pdm-select>select]:!rounded-r-md',
          '[&>pdm-tooltip>span>pdm-select>select]:shadow-none',
          '[&>pdm-tooltip>span>select]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>select]:!rounded-l-md',
          '[&>pdm-tooltip:last-child>span>select]:!rounded-r-md',
          '[&>pdm-tooltip>span>select]:shadow-none'
        ].join(' ')
      : '';

    const groupVerticalClasses = isGroup && isVertical && !this.separated
      ? [
          '[&>*]:rounded-none',
          '[&>*:first-child]:rounded-t-md',
          '[&>*:last-child]:rounded-b-md',
          '[&>*:not(:first-child)]:-mt-px',
          '[&>*:not(:first-child)]:border-t-0',
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
          '[&>pdm-select>select]:!rounded-none',
          '[&>pdm-select:first-child>select]:!rounded-t-md',
          '[&>pdm-select:last-child>select]:!rounded-b-md',
          '[&>pdm-select>select]:shadow-none',
          '[&>pdm-input>div>input]:bg-background',
          '[&>pdm-input>div>input]:shadow-none',
          '[&>pdm-button>button]:shadow-none',
          '[&>pdm-tooltip>span>*]:rounded-none',
          '[&>pdm-tooltip:first-child>span>*]:rounded-t-md',
          '[&>pdm-tooltip:last-child>span>*]:rounded-b-md',
          '[&>pdm-tooltip:not(:first-child)>span>*]:border-t-0',
          '[&>pdm-tooltip>span>pdm-button>button]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>pdm-button>button]:!rounded-t-md',
          '[&>pdm-tooltip:last-child>span>pdm-button>button]:!rounded-b-md',
          '[&>pdm-tooltip>span>pdm-button>button]:shadow-none',
          '[&>pdm-tooltip>span>button]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>button]:!rounded-t-md',
          '[&>pdm-tooltip:last-child>span>button]:!rounded-b-md',
          '[&>pdm-tooltip>span>button]:shadow-none',
          '[&>pdm-tooltip>span>pdm-input>div>input]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>pdm-input>div>input]:!rounded-t-md',
          '[&>pdm-tooltip:last-child>span>pdm-input>div>input]:!rounded-b-md',
          '[&>pdm-tooltip>span>pdm-input>div>input]:shadow-none',
          '[&>pdm-tooltip>span>input]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>input]:!rounded-t-md',
          '[&>pdm-tooltip:last-child>span>input]:!rounded-b-md',
          '[&>pdm-tooltip>span>input]:shadow-none',
          '[&>pdm-tooltip>span>pdm-input-group>div]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>pdm-input-group>div]:!rounded-t-md',
          '[&>pdm-tooltip:last-child>span>pdm-input-group>div]:!rounded-b-md',
          '[&>pdm-tooltip>span>pdm-select>select]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>pdm-select>select]:!rounded-t-md',
          '[&>pdm-tooltip:last-child>span>pdm-select>select]:!rounded-b-md',
          '[&>pdm-tooltip>span>pdm-select>select]:shadow-none',
          '[&>pdm-tooltip>span>select]:!rounded-none',
          '[&>pdm-tooltip:first-child>span>select]:!rounded-t-md',
          '[&>pdm-tooltip:last-child>span>select]:!rounded-b-md',
          '[&>pdm-tooltip>span>select]:shadow-none'
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
