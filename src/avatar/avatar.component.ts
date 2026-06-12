import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type PdmAvatarShape = 'circle' | 'square';

@Component({
  selector: 'pdm-avatar',
  templateUrl: './avatar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PdmAvatarComponent {
  @Input() src = '';
  @Input() alt = 'Avatar';
  @Input() fallback = 'U';
  @Input() shape: PdmAvatarShape = 'circle';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() groupSources: string[] = [];
  @Input() className = '';

  readonly sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  get isGroup(): boolean {
    return this.groupSources.length > 0;
  }

  get radiusClass(): string {
    return this.shape === 'square' ? 'rounded-[8px]' : 'rounded-full';
  }
}
